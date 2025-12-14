# Cred Saathi

## This is a banking related, AI-agentic loan approval app

### Techs Used:
1. Next.js
2. Tailwind CSS

### Getting Started (Frontend Only):

From the `frontend` directory, run:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Dummy Server (Prompt Demo)

A small Express server is available to accept user prompts from the frontend and return a demo response.

From the `frontend` directory, install the server dependencies and start the server:
```bash
npm install express cors
npm run server
```

The server listens on [http://localhost:4000](http://localhost:4000).

- Healthcheck: `GET /health`
- Prompt endpoint: `POST /prompt` with JSON body `{ "prompt": "your text" }`

You can call this from the frontend using `fetch('http://localhost:4000/prompt', { method: 'POST', body: JSON.stringify({ prompt }) })`.

## About Us:
Team – SyntaxErr<br>
Project – Cred Saathi<br>
Hriddhiman – Frontend(Next.js), UI/UX<br>
Shorya – presentation, logo, AI agents<br>
Shreejan – AI agents<br>
Yasin – Backend , AI agent integration , database<br>
