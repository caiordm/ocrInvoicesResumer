"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2 w-80">
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)}  className="p-2 border border-gray-300 rounded-lg" />
        <input placeholder="Senha" onChange={(e) => setPassword(e.target.value)} className="p-2 border border-gray-300 rounded-lg" type="password" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg" >Entrar</button>
      </form>
    </div>
  );
}
