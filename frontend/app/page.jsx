"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen flex justify-center items-center gap-4 bg-linear-to-r from-purple-500 via-pink-500 to-red-500">
      <button className="cursor-pointer p-2 bg-cyan-500 h-fit rounded-xl px-10" onClick={() => router.push('/login')}>Login</button>
      <button className="cursor-pointer p-2 bg-emerald-500 h-fit rounded-xl px-10" onClick={() => router.push('/signup')}>Sign Up</button>
    </div>
  );
}
