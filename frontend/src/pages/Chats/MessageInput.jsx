import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { toast } from "react-toastify";

import { conversationsAtom, selectedConversationAtom } from "../../utils/messages.js";
import { useRecoilValue, useSetRecoilState } from "recoil";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const setConversations = useSetRecoilState(conversationsAtom);
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
      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
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
      className="flex items-center w-full mt-4 relative"
      onSubmit={handleSendMsg}
    >
      <div className="relative w-full">
        <input
          type="text"
          className="w-full p-4 pl-10 pr-12 border text-xl 
            rounded-lg border-gray-300 bg-gray-700 text-white
            focus:outline-none focus:ring-2 focus:ring-green-500 
            placeholder:text-gray-400"
          placeholder="Type a message..."
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
