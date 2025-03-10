import React, { useState } from "react";
import { jsPDF } from "jspdf";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  document: {
    id: string;
    filename: string;
    createdAt: string;
    summary: string;
  } | null;
};

type Message = {
  sender: "user" | "ia"; // Identifica se a mensagem é do usuário ou da IA
  text: string;
};

const Modal = ({ isOpen, onClose, onDeleteSuccess, document }: ModalProps) => {
  const [question, setQuestion] = useState(""); // Estado para a pergunta
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false); // Para mostrar o estado de carregamento
  const [error, setError] = useState<string | null>(null); // Para mostrar erros

  if (!isOpen || !document) return null;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10); // Define o tamanho da fonte

    // Adicionar nome do arquivo (document.filename)
    doc.setFont("helvetica", "normal"); // Define a fonte e o peso normal
    doc.setTextColor(0, 0, 0); // Cor do texto (preto)
    doc.text(`Nome do Arquivo: ${document.filename}`, 10, 10);

    // Adicionar resumo (document.summary)
    doc.setFont("helvetica", "italic"); // Define a fonte como itálico
    doc.setTextColor(0, 0, 255); // Cor do texto (azul)
    // Usar splitTextToSize para quebrar as linhas no resumo
    const summaryText = document.summary;
    const maxWidth = 180; // Largura máxima onde o texto será quebrado (ajuste conforme necessário)
    const lines = doc.splitTextToSize(summaryText, maxWidth);

    // Adiciona o texto quebrado com múltiplas linhas
    doc.text(lines, 10, 20);

    // Adicionar título de histórico de chat
    doc.setFont("helvetica", "bold"); // Fonte em negrito
    doc.setTextColor(255, 0, 0); // Cor do texto (vermelho)
    doc.text("Histórico do Chat:", 10, 50);

    // Adicionar as mensagens do chat
    let yPosition = 60;
    doc.setFont("helvetica", "normal"); // Volta para a fonte normal
    doc.setTextColor(0, 0, 0); // Cor do texto (preto)

    messages.forEach((message) => {
      doc.text(
        `${message.sender === "user" ? "Eu" : "IA"}: ${message.text}`,
        10,
        yPosition,
      );
      yPosition += 10; // Ajusta a posição para a próxima mensagem
    });

    // Salvar o PDF
    doc.save(`${document.filename}-chat.pdf`);
  };

  const deleteImage = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/documents/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao deletar documento.");

      onClose();
      onDeleteSuccess();
    } catch (err) {
      console.log("Erro ao deletar. Tente novamente.");
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return; // Não faz nada se a pergunta estiver vazia
    setLoading(true);
    setError(null); // Reseta o erro

    // Adiciona a mensagem do usuário ao histórico
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: question },
    ]);
    setQuestion(""); // Limpa o campo da pergunta

    try {
      const response = await fetch(
        `http://localhost:3001/documents/${document.id}/question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao obter a resposta.");
      }

      const data = await response.json();
      // Adiciona a resposta da IA ao histórico
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "ia", text: data.answer },
      ]);
    } catch (err) {
      setError("Erro ao perguntar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessages([]); // Limpa o histórico de mensagens
    onClose();
  };

  return (
    <div className="fixed w-full inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-4/5 h-4/5 border-2 border-gray-200 p-6 rounded-lg shadow-[rgba(0,_0,_0,_0.25)_0px_25px_50px_-12px]">
        <div className="flex w-full justify-between items-baseline">
          <h2 className="text-lg font-semibold mb-4">
            Arquivo: {document.filename}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="mt-4 p-2 bg-green-600 text-white text-sm rounded-lg cursor-pointer"
              onClick={generatePDF}
            >
              Gerar PDF
            </button>
            <button
              onClick={() => deleteImage(document.id)}
              className="mt-4 p-2 bg-red-600 text-white text-sm rounded-lg cursor-pointer"
            >
              Deletar
            </button>
          </div>
        </div>
        <p className="text-[11pt]">
          <strong>Resumo:</strong> {document.summary}
        </p>

        {/* Chat para perguntas sobre a imagem */}
        <div className="mt-4 h-auto max-h-48 overflow-y-scroll border bg-gray-50 border-gray-200 rounded-lg p-4">
          <div className="space-y-4 text-sm">
            {messages.length === 0 ? (
              <span className="text-gray-600">
                Chat para perguntas sobre o assunto da imagem
              </span>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 max-w-xs rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input que faz a pergunta */}
        <div className="mt-4 flex gap-1 items-center justify-between">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Faça uma pergunta sobre o assunto da imagem"
            className="border border-gray-200 p-2 rounded-xl w-full text-sm outline-none"
          />
          <button
            onClick={askQuestion}
            className="p-2 bg-blue-600 text-sm text-white rounded-lg cursor-pointer"
            disabled={loading}
          >
            {loading ? "Carregando..." : "Perguntar"}
          </button>
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {/* Fechar */}
        <div className="flex w-full justify-between items-center">
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={handleClose}
          >
            Fechar
          </button>
          <p className="text-sm text-gray-400">
            {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
