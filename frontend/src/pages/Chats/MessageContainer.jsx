import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "../../context/SocketContext";

const MessageContainer = ({ selectedConversation }) => {
  // Fetch authenticated user data
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null); // Reference for auto-scrolling

  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setMessages((prevMsg) => [...prevMsg, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        const res = await fetch(
          `/api/v1/messages/get/${selectedConversation.userId}`
        );
        const data = await res.json();

        if (data.error) {
          toast.error(`Error: ${data.error}`);
          return;
        }

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          toast.error("Unexpected data format received");
        }
      } catch (error) {
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoadingMessages(false);
      }
    };

    if (selectedConversation?.userId) {
      getMessages();
    }
  }, [selectedConversation.userId]);

  // Auto-scroll to the last message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md p-4 w-4/5 mx-auto relative">
      <div className="flex w-full h-12 items-center gap-3">
        <img
          src={selectedConversation?.userProfileImg}
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-gray-300"
        />
        <p className="text-lg font-semibold text-gray-100">
          {selectedConversation.username}
        </p>
      </div>
      <hr className="my-2 border-gray-300" />

      <div
        className="flex flex-col gap-4 my-4 h-[600px] overflow-y-auto scrollbar-hidden"
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* Internet Explorer and Edge */,
        }}
      >
        {loadingMessages ? (
          // Skeleton loading state
          <>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
              <div className="flex flex-col w-full">
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4 mb-1"></div>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="flex flex-col w-3/4 items-end">
                <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-3/4 mb-1"></div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            </div>
          </>
        ) : (
          // Actual messages are displayed here
          <div>
            {messages.length > 0 ? (
              messages.map((message) => (
                <Message
                  key={message?.id}
                  message={message}
                  ownMessage={authUser?._id === message.sender}
                />
              ))
            ) : (
              <p className="text-center text-gray-400">No messages yet.</p>
            )}
            {/* Reference for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <MessageInput setMessages={setMessages} />
    </div>
  );
};

export default MessageContainer;
