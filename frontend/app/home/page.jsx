"use client";
import { useState, useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

const Home = () => {
	const chatId = useSearchParams().get("id");
	const router = useRouter();
	const [sideBar, setSideBar] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [prompt, setPrompt] = useState("");
	const { isLoaded, isSignedIn } = useUser();
	const [open, setOpen] = useState(true); // Start with modal open
	const cardRef = useRef(null);
	const [phone, setPhone] = useState("");
	const [salary, setSalary] = useState(0);
	const [detailsSubmitted, setDetailsSubmitted] = useState(false);
	const [errors, setErrors] = useState({ phone: "", salary: "" });

	const myChats = [
		{
			_id: 1,
			title: "1. Random thoughts about cosmic microwaves",
			chats: ["Yo", "What's up?", "Got any memes?", "Nah but I've got chaotic energy.", "kol", "kolakdn", "verify"],
		},
		{
			_id: 2,
			title: "2. Why is my cereal judging me?",
			chats: ["Sup", "Need something?", "Explain recursion?", "It's functions eating themselves. Happy now?"],
		},
		{
			_id: 3,
			title: "3. The existential crisis of a left shoe",
			chats: ["Hey", "What now?", "How do I get smarter?", "Read stuff. Shocking, I know."],
		},
		{
			_id: 4,
			title: "4. My WiFi has emotional damage",
			chats: ["Hi", "Yeah?", "Tell me something random", "Bananas are berries. You're welcome."],
		},
		{
			_id: 5,
			title: "5. A dissertation on why pens disappear",
			chats: ["Hello", "What's good?", "Got advice?", "Don't run your code at 3 AM."],
		},
		{
			_id: 6,
			title: "6. Time is fake and so is my motivation",
			chats: ["Yo", "Need help?", "Explain arrays", "They hold stuff. Boom."],
		},
		{
			_id: 7,
			title: "7. The tragedy of a lukewarm pizza slice",
			chats: ["Hey", "Speak", "Tell me a fact", "Octopuses have three hearts."],
		},
		{
			_id: 8,
			title: "8. Why does my brain buffer like a bad video?",
			chats: ["Hi", "Listening", "Give me wisdom", "Touch grass occasionally."],
		},
		{
			_id: 9,
			title: "9. A philosophical rant about socks",
			chats: ["Yo", "Go ahead", "Is AI scary?", "Only when you write spaghetti code."],
		},
		{
			_id: 10,
			title: "10. A saga about losing my charger again",
			chats: ["Sup", "Mm?", "Make me laugh", "Your compiler errors did that."],
		},
		{
			_id: 11,
			title: "11. The lore behind my unfinished assignments",
			chats: ["Hello", "Huh?", "Teach me JS", "Start by not crying over it."],
		},
		{
			_id: 12,
			title: "12. Things I say to avoid real responsibilities",
			chats: ["Hey", "Yes?", "Why am I like this?", "Honestly? Same."],
		},
	];

	// Validate phone number (basic validation for 10 digits)
	const validatePhone = (phoneNumber) => {
		const phoneRegex = /^[0-9]{10}$/;
		return phoneRegex.test(phoneNumber.replace(/[^0-9]/g, ''));
	};

	// Validate salary (must be a positive number)
	const validateSalary = (salaryValue) => {
		const num = parseFloat(salaryValue);
		return !isNaN(num) && num > 0;
	};

	const handleUpdate = () => {
		let valid = true;
		const newErrors = { phone: "", salary: "" };

		// Validate phone
		if (!phone.trim()) {
			newErrors.phone = "Phone number is required";
			valid = false;
		} else if (!validatePhone(phone)) {
			newErrors.phone = "Please enter a valid 10-digit phone number";
			valid = false;
		}

		// Validate salary
		if (!salary) {
			newErrors.salary = "Salary is required";
			valid = false;
		} else if (!validateSalary(salary)) {
			newErrors.salary = "Please enter a valid salary amount";
			valid = false;
		}

		setErrors(newErrors);

		if (valid) {
			salaryUpdate();
			setDetailsSubmitted(true);
			setOpen(false);
		}
	};

	const salaryUpdate = async () => {
		try {
			const res = await fetch("http://localhost:8000/upload-salary-slip", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					phone: `+91${phone}`,
					monthly_salary: Number(salary),
				}),
			});

			const text = await res.text();
			console.log("Status:", res.status);
			console.log("Body:", text);
		} catch (e) {
			console.error("Network error:", e);
		}
	};

	const UpdateCard = ({
		cardRef,
		phone,
		setPhone,
		salary,
		setSalary,
		errors,
		setErrors,
		handleUpdate,
	}) => {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
				<div
					ref={cardRef}
					className="w-96 p-6 rounded-2xl bg-[#1e293b] text-slate-200 shadow-2xl border border-slate-700"
				>
					<h2 className="text-2xl font-semibold mb-2">Update Details</h2>
					<p className="text-slate-400 text-sm mb-4">
						Please complete your profile to start chatting
					</p>

					{/* Phone */}
					<div className="mb-4">
						<label className="block text-sm mb-2">Phone Number</label>
						<input
							type="tel"
							value={phone}
							onChange={(e) => {
								setPhone(e.target.value);
								if (errors.phone) setErrors({ ...errors, phone: "" });
							}}
							className={`w-full p-3 rounded-xl bg-slate-900/70 border ${errors.phone ? "border-red-500" : "border-slate-700"
								} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
						/>
						{errors.phone && (
							<p className="text-red-400 text-xs mt-1">{errors.phone}</p>
						)}
					</div>

					{/* Salary */}
					<div className="mb-6">
						<label className="block text-sm mb-2">Salary</label>
						<input
							type="number"
							value={salary}
							onChange={(e) => {
								setSalary(e.target.value);
								if (errors.salary) setErrors({ ...errors, salary: "" });
							}}
							className={`w-full p-3 rounded-xl bg-slate-900/70 border ${errors.salary ? "border-red-500" : "border-slate-700"
								} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
						/>
						{errors.salary && (
							<p className="text-red-400 text-xs mt-1">{errors.salary}</p>
						)}
					</div>

					<button
						onClick={handleUpdate}
						className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-400 text-black font-semibold rounded-xl cursor-pointer"
					>
						Continue to Chat
					</button>
				</div>
			</div>
		);
	};


	// Load current chat messages if chatId exists
	const currChat = myChats.find((chat) => chat._id.toString() === chatId)?.["chats"] || [];
	const [messages, setMessages] = useState([]);

	// Load logged-in user and protect route
	useEffect(() => {
		if (isLoaded && !isSignedIn) {
			router.replace("/sign-in");
		}
	}, [isLoaded, isSignedIn]);

	useEffect(() => {
		const chat = myChats.find(
			(chat) => chat._id.toString() === chatId
		)?.chats || [];

		setMessages(chat);
	}, [chatId]);

	// Handle sending + receiving messages
	const handlePrompt = async () => {
		if (!prompt || !detailsSubmitted) return;

		// show user message immediately
		setMessages(prev => [...prev, prompt]);
		setPrompt("");

		const response = await fetch("http://localhost:8000/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ "phone": `+91${phone}`, "message": prompt }),
		});

		const data = await response.json();

		console.log(data);

		// show backend reply
		if (data?.response) {
			setMessages(prev => [...prev, data.response]);
		}
	};

	return (
		<div className="h-screen w-screen flex flex-col bg-linear-to-br from-[#020617] via-[#020617] to-[#020617]">
			{open && (
				<UpdateCard
					cardRef={cardRef}
					phone={phone}
					setPhone={setPhone}
					salary={salary}
					setSalary={setSalary}
					errors={errors}
					setErrors={setErrors}
					handleUpdate={handleUpdate}
				/>
			)}

			<SideBar
				sideBar={sideBar}
				setSideBar={setSideBar}
				showSettings={showSettings}
				setShowSettings={setShowSettings}
				setOpenUpdateBtn={setOpen}
			/>

			{sideBar && (
				<div
					className="h-full w-full absolute z-5 top-0 bg-[#a5a5a514]"
					onClick={() => setSideBar(false)}
				></div>
			)}

			{showSettings && (
				<div>
					<div className="w-70 bg-[#444444f3] rounded-2xl p-2 bottom-18 left-2.5 z-30 absolute flex flex-col gap-2">
						<p className="p-2 cursor-pointer hover:bg-[#81818146] rounded-xl z-40">Documents</p>
						<p className="p-2 cursor-pointer hover:bg-[#81818146] rounded-xl z-40">Settings</p>

						<div className="p-2 hover:bg-[#81818146] rounded-xl z-40 flex items-center">
							<UserButton afterSignOutUrl="/sign-in" />
							<p className="ml-2">Log Out</p>
						</div>
					</div>

					<div
						className="h-full w-full absolute z-10 top-0"
						onClick={() => setShowSettings(false)}
					></div>
				</div>
			)}

			<div className="flex fixed top-0 w-full items-center gap-4 p-2 bg-[#272A34]">
				<img
					src="menu.svg"
					alt="menu"
					className="w-7 invert cursor-pointer box-content p-1 hover:bg-[#81818146] rounded-xl"
					onClick={() => {
						setSideBar(!sideBar);
					}}
				/>
				<span className="font-bold text-2xl">Cred Saathi</span>
			</div>

			<main
				className={`mt-14 mb-24 h-full w-full flex flex-col items-center overflow-x-hidden ${messages.length > 0 ? "justify-between" : "justify-center"
					}`}
			>
				<div
					className={`flex w-full flex-col items-center justify-center gap-4 ${messages.length > 0 ? "p-16" : "mb-5"
						}`}
				>
					{!detailsSubmitted ? (
						<div className="text-center">
							<h1 className="text-4xl p-7 mb-4">Welcome!</h1>
							<p className="text-slate-400 text-lg">Please complete your profile details to start chatting</p>
						</div>
					) : messages.length > 0 ? (
						messages.map((msg, i) =>
							i % 2 ? (
								<div
									key={i}
									className="mb-4 p-4 bg-[#1e293b] rounded-2xl w-2/3 shadow-lg self-start"
								>
									{msg}
								</div>
							) : (
								<div
									key={i}
									className="mb-4 p-4 bg-linear-to-r from-emerald-500 to-green-400 rounded-2xl text-black w-1/3 shadow-lg self-end"
								>
									{msg}
								</div>
							)
						)
					) : (
						<h1 className="text-4xl p-7">Hello Jee!</h1>
					)}
				</div>

				<div className="absolute bottom-0 h-26 w-full rounded-t-4xl bg-[#272A34]"></div>
				<div
					className={`w-2/3 fixed bottom-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 flex items-center rounded-full shadow-2xl ${!detailsSubmitted ? "opacity-50 pointer-events-none" : ""
						}`}
				>
					<img
						src="plus.svg"
						alt="add"
						className="size-10 p-2 bg-green-500 rounded-full ml-3 cursor-pointer"
					/>

					<input
						type="text"
						placeholder={detailsSubmitted ? "Ask anything" : "Complete your profile to start chatting"}
						value={prompt}
						onChange={(e) => setPrompt(e.target.value)}
						disabled={!detailsSubmitted}
						className="flex-1 bg-transparent p-4 text-slate-100 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed"
						onKeyDown={(e) => {
							if (prompt && e.key === "Enter" && detailsSubmitted) handlePrompt();
						}}
					/>

					<img
						src="send.svg"
						onClick={handlePrompt}
						className={`size-10 p-2 bg-green-500 rounded-full mr-3 ${detailsSubmitted ? "cursor-pointer" : "cursor-not-allowed opacity-50"
							}`}
					/>
				</div>
			</main>
		</div>
	);
};

export default Home;