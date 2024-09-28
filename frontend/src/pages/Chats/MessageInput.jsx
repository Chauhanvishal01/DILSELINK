import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const queryClient = useQueryClient();
  const selectedConversation = queryClient.getQueryData("selectedConversation");

  const handleSendMsg = async (e) => {
    e.preventDefault();

    if (!messageText) return;

    try {
      const res = await fetch(`/api/v1/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(`Error: ${data.error}`);
        return;
      }

      // Update the message list in the state
      setMessages((prevMessages) => [...prevMessages, data]);

      // Update the selected conversation's last message in the query cache
      queryClient.setQueryData("selectedConversation", (prevSelectedConv) => ({
        ...prevSelectedConv,
        lastMessage: {
          text: messageText,
          sender: data.sender,
        },
      }));

      // Clear input after sending the message
      setMessageText("");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <>
      <form
        className="flex items-center w-full mt-4 absolute bottom-5"
        onSubmit={handleSendMsg}
      >
        <div className="relative w-[90%]">
          <input
            type="text"
            className="w-full p-5 pl-10 pr-12 border 
            text-xl
            rounded-lg border-gray-300 focus:outline-none focus:ring-2 
            focus:ring-green-500
            placeholder:text-xl"
            placeholder="Type a message..."
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 cursor-pointer transform -translate-y-1/2"
            onClick={handleSendMsg}
          >
            <IoSendSharp className="text-green-500 text-3xl" />
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageInput;
