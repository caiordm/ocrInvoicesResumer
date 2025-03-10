"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      router.push("/login"); // Redireciona para login após cadastro
    } else {
      const data = await res.json();
      setError(data.message || "Erro ao registrar.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <input type="text" name="name" placeholder="Nome" onChange={handleChange} required className="p-2 border border-gray-300 rounded-lg"/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="p-2 border border-gray-300 rounded-lg"/>
        <input type="password" name="password" placeholder="Senha" onChange={handleChange} required className="p-2 border border-gray-300 rounded-lg"/>
        <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 rounded-lg">
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}
