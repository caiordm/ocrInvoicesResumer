"use client"
import React from "react";

// Definindo as propriedades esperadas para o DocumentCard
type DocumentCardProps = {
  id: string;  
  name: string;
  createdAt: string;
  summary: string;
  onClick: () => void; // Adicionando o onClick
};

const DocumentCard = ({ name, createdAt, summary, onClick }: DocumentCardProps) => {
    return (
    <div onClick={onClick} className="cursor-pointer flex flex-col justify-between w-auto p-4 gap-4 items-start border border-gray-200 rounded-xl bg-gray-50">
        <div className="w-full flex justify-between items-top gap-6">
            <h1>{name}</h1>
            {summary ? <span className="text-green-600 text-sm font-bold">Resumo Disponível</span> : "Sem resumo"}
        </div>
        <div className="w-full flex justify-between items-top gap-6">
        <span className="text-sm text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
    </div>
    );
  };
  
  export default DocumentCard;