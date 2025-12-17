from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from graph.state import AgentState
from services.data_services import offer_service
import os
import re

llm = ChatGroq(
        model="llama-3.1-8b-instant",  
    temperature=0.7,
    groq_api_key=os.getenv("GROQ_API_KEY")
)


def extract_loan_details(user_message: str, state: AgentState) -> dict:
    """
    Extract loan amount and tenure from user message using regex and LLM.
    
    Returns:
        dict with 'amount', 'tenure', 'has_info'
    """
    # extract numbers from message
    amounts = re.findall(r'(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:lakhs?|lacs?|k|thousand)?', user_message.lower())
    tenures = re.findall(r'(\d+)\s*(?:months?|years?|yr)', user_message.lower())
    
    result = {
        'amount': None,
        'tenure': None,
        'has_info': False
    }
    
    if amounts:
        amount_str = amounts[0].replace(',', '')
        amount = float(amount_str)
        
        # Handle lakhs/thousands
        if 'lakh' in user_message.lower() or 'lac' in user_message.lower():
            amount = amount * 100000
        elif 'k' in user_message.lower() or 'thousand' in user_message.lower():
            amount = amount * 1000
        elif amount < 1000:  # Assume lakhs if small number
            amount = amount * 100000
        
        result['amount'] = amount
        result['has_info'] = True
    
    if tenures:
        tenure = int(tenures[0])
        if 'year' in user_message.lower() or 'yr' in user_message.lower():
            tenure = tenure * 12
        result['tenure'] = tenure
        result['has_info'] = True
    
    return result


def sales_agent_node(state: AgentState) -> AgentState:
    """
    Sales Agent - Negotiates loan terms.
    
    Workflow:
    1. Check if we have loan details already
    2. If not, extract from user message
    3. Ask for missing information (amount or tenure)
    4. Once both collected, get pre-approved offer
    5. Present offer and move to verification
    """
    
    # Get last user message
    user_messages = [msg for msg in state["messages"] if isinstance(msg, HumanMessage)]
    last_user_message = user_messages[-1].content if user_messages else ""
    
    # Extract loan details from message
    extracted = extract_loan_details(last_user_message, state)
    
    # Update state with extracted info
    if extracted['amount'] and not state['requested_loan_amount']:
        state['requested_loan_amount'] = extracted['amount']
    
    if extracted['tenure'] and not state['requested_tenure']:
        state['requested_tenure'] = extracted['tenure']
    
    # Check what information we still need
    missing_info = []
    if not state['requested_loan_amount']:
        missing_info.append('loan amount')
    if not state['requested_tenure']:
        missing_info.append('tenure')
    
    # If missing information, ask for it
    if missing_info:
        prompt = f"""You are a sales agent helping with a personal loan.

Customer: {state['customer_name']}
Pre-approved limit: ₹{state['pre_approved_limit']:,.0f}

Missing information: {', '.join(missing_info)}

User said: "{last_user_message}"

Generate a friendly response that:
1. Acknowledges what they said (if anything relevant)
2. Asks for the missing information: {missing_info[0]}
3. Provides helpful context (e.g., "Our loans range from ₹1L to ₹10L" or "You can choose tenure from 12-60 months")

Keep it conversational and brief (2-3 sentences)."""
        
        response = llm.invoke([SystemMessage(content=prompt)])
        state["messages"].append(AIMessage(content=response.content))
        return state

    offer = offer_service.get_offer(state['phone'])
    
  
    if offer:
        base_rate = offer.interest_rate
    else:
        # Default rates based on tenure
        if state['requested_tenure'] <= 12:
            base_rate = 10.5
        elif state['requested_tenure'] <= 24:
            base_rate = 11.5