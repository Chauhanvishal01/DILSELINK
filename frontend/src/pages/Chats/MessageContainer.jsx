import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../utils/messages.js";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useSocket } from "../../context/SocketContext";
import messageSound from "../../assets/sounds/notification.mp3";
import { toast } from "react-toastify";

import { useQuery } from "@tanstack/react-query";

const MessageContainer = () => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const { data: currentUser } = useQuery({ queryKey: ["authUser"] });

  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // make a sound if the window is not focused
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(
          `/api/v1/messages/get/${selectedConversation.userId}`
        );
        const data = await res.json();
        if (data.error) {
          toast.error("Error", data.error, "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        toast.error("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [toast, selectedConversation.userId, selectedConversation.mock]);

  return (
    <div className="flex flex-col flex-1 bg-gray-800 dark:bg-gray-dark rounded-md p-2">
    {/* Message header */}
    <div className="flex items-center gap-2 w-full h-12 p-2 bg-gray-700 rounded-t-md">
      <img
        src={selectedConversation?.userProfilePic || "/one.jpeg"}
        alt="U"
        className="w-8 h-8 rounded-full"
      />
      <span className="flex items-center text-white">
        {selectedConversation.username}
      </span>
    </div>

    <hr className="my-2 border-gray-600" />

    <div className="flex flex-col flex-grow p-2 h-[400px] overflow-y-auto">
      {loadingMessages ? (
        // Skeleton loading state
        <>
          <div className="flex items-start gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="flex flex-col w-full">
              <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-3/4 mb-1"></div>
            </div>
          </div>
          <div className="flex justify-end animate-pulse">
            <div className="flex flex-col w-3/4 items-end">
              <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-3/4 mb-1"></div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          {messages.length > 0 ? (
            messages.map((message) => (
              <Message
                key={message?.id}
                message={message}
                ownMessage={currentUser?._id === message.sender}
              />
            ))
          ) : (
            <p className="text-center text-gray-400">No messages yet.</p>
          )}
          {/* Reference for auto-scrolling */}
          <div ref={messageEndRef} />
        </div>
      )}
    </div>
    
    <MessageInput setMessages={setMessages} />
  </div>
  );
};

export default MessageContainer;
