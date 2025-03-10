import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // Importando Prisma Client

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email já cadastrado!" }, { status: 400 });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "Usuário registrado com sucesso!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao registrar usuário!" }, { status: 500 });
  }
}
