export const fetchConversations = async () => {
    const res = await fetch("/api/v1/messages/conversation");
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error fetching conversations");
    }
    return res.json();
  };
  
