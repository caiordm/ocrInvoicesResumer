import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-none text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2  text-5xl">Bem vindo ao OCR Resumer.</li>
          <li className=" text-3xl">Faça o seu cadastro ou login!</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-gray-300 transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-white hover:text-black text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/register"
            target="_self"
            rel="noopener noreferrer"
          >
            Cadastro
          </a>
          <a
            className="rounded-full border border-gray-300 transition-colors flex items-center justify-center hover:bg-black hover:text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="/login"
            target="_self"
            rel="noopener noreferrer"
          >
            Login
          </a>
        </div>
      </main>
    </div>
  );
}
