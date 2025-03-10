import { getSession } from "next-auth/react";

export async function uploadDocument(file: File) {
  const session = await getSession();
  const userId = session?.user?.id;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);

  const response = await fetch("http://localhost:3001/documents", {
    method: "POST",
    body: formData,
  });

  return response.json();
}
