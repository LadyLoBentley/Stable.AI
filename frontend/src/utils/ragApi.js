export async function askRag(question) {
    const response = await fetch("http://127.0.0.1:8000/api/rag/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to get RAG response");
    }
  
    return await response.json();
  }