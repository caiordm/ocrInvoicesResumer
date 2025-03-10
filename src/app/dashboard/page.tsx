"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import DocumentCard from "@/lib/DocumentCard";
import Modal from "@/lib/Modal";
import UploadModal from "@/lib/UploadModal";

type CustomUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type Document = {
  id: string;
  filename: string;
  createdAt: string;
  summary: string;
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  const user = session?.user as CustomUser | undefined;

  const fetchDocuments = async () => {
    if (!user?.id) return; // Evita erro caso `user` não tenha `id`
    try {
      const res = await fetch(
        `http://localhost:3001/documents/user/${user.id}`,
      );
      const data: Document[] = await res.json();
      setDocuments(data);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDocuments();
    }
  }, [user]);

  const handleDeleteSuccess = () => {
    fetchDocuments();
  };

  if (status === "loading") return <p>Carregando...</p>;

  const handleCardClick = (document: Document) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  return (
    <div>
      <header className="w-full h-20 border-b-2 border-gray-200 flex px-8 py-1 justify-between items-center">
        <h1 className="text-2xl">Olá, {session?.user?.name ?? "Usuário"}</h1>
        <button
          onClick={() => signOut()}
          className="py-2 px-8 text-lg flex items-center border-none text-white rounded-lg bg-red-800 cursor-pointer"
        >
          Sair
        </button>
      </header>
      <div className="w-full flex flex-col p-8 gap-8">
        <div className="w-full flex justify-between">
          <h2 className="text-2xl">Suas imagens</h2>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="py-2 px-4 flex items-center border-none text-white rounded-lg bg-green-800 cursor-pointer"
          >
            Upload de Imagem
          </button>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                id={doc.id} // 🔹 Adicionando o id corretamente
                name={doc.filename}
                createdAt={doc.createdAt}
                summary={doc.summary}
                onClick={() => handleCardClick(doc)}
              />
            ))
          ) : (
            <p>Nenhum documento encontrado.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeleteSuccess={handleDeleteSuccess}
        document={selectedDocument}
      />

      <UploadModal
        userId={user?.id ?? ""}
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={fetchDocuments}
      />
    </div>
  );
}
