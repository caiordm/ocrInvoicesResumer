import React, { useState } from "react";

type UploadModalProps = {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
};

const UploadModal = ({ userId, isOpen, onClose, onUploadSuccess }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"idle" | "uploading" | "generating">("idle");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setError(""); // Limpar erro ao selecionar um novo arquivo
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Por favor, selecione um arquivo.");
      return;
    }

    setUploading(true);
    setUploadStep("uploading");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);

    try {
      const response = await fetch("http://localhost:3001/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro no upload");

      setTimeout(() => {
        setUploadStep("generating");
      }, 1000);


      onUploadSuccess(); // Atualiza a lista de documentos após o upload
      onClose(); // Fecha o modal
    } catch (err) {
      setError("Erro ao fazer upload. Tente novamente.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed w-full inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-full h-auto border-2 border-gray-200 p-6 rounded-lg max-w-lg shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]">
        <h2 className="text-xl font-bold mb-4">Upload de Imagem</h2>
        <h2 className="mb-4">Formatos aceitos: .jpeg, .jpg, .png, .webp(não é aceito .svg) </h2>
        <input type="file" onChange={handleFileChange} className="mb-4 border border-gray-200 w-full p-2 rounded-xl cursor-pointer" />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {uploadStep === "uploading"
              ? "Enviando..."
              : uploadStep === "generating"
              ? "Gerando resumo..."
              : "Enviar"} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
