"use client";
import { useRouter } from "next/navigation";
import Prism from "./components/Prism";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white">
      {/* Prism Background */}
      <div className="absolute inset-0 -z-10">
        <Prism
          animationType="rotate"
          timeScale={0.4}
          height={3.5}
          baseWidth={5.5}
          scale={3.2}
          hueShift={0}
          colorFrequency={1}
          noise={0}
          glow={1.1}
        />
      </div>

      {/* NAVBAR */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 backdrop-blur-xl bg-white/10 border border-white/20 px-8 py-4 rounded-3xl flex items-center justify-between w-[380px] z-20">

        <h1 className="text-lg font-semibold">CredSaathi</h1>

        <div className="flex gap-6">
          <button onClick={() => router.push("/sign-in")}>Login</button>
          <button onClick={() => router.push("/sign-up")}>Signup</button>

        </div>
      </div>




      {/* CENTER CONTENT */}
      <div className="h-full w-full flex flex-col justify-center items-center text-center gap-6 px-4">
        

        {/* Header */}
        <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-xl leading-tight">
          Smarter loans start<br />with smarter conversations
        </h1>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            className="bg-white text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition"
            onClick={() => router.push("/home")}
          >
            Get Started
          </button>

          <button className="backdrop-blur-md bg-white/10 text-white px-8 py-3 rounded-full border border-white/20 hover:opacity-80 transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
