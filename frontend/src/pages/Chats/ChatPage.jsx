import Conversation from "./Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "./MessageContainer";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../utils/messages.js";
import { useSocket } from "../../context/SocketContext.jsx";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const { data: currentUser } = useQuery({ queryKey: ["authUser"] });
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        return prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
      });
    });
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/v1/messages/conversation");
        const data = await res.json();
        console.log("Fetched Conversations: ", data); 
        if (data.error) {
          toast.error("Error: " + data.error);
          return;
        }
        setConversations(data);
      } catch (error) {
        toast.error("Error: " + error.message);
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/v1/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        toast.error("Error: " + searchedUser.error);
        return;
      }

      if (searchedUser?._id === currentUser?._id) {
        toast.error("Error: You cannot message yourself");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]?._id === searchedUser?._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
      console.log("Updated Conversations: ", updatedConvs);
      
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center w-full max-w-6xl mx-auto p-4 space-y-4 md:space-y-0">
    {/* Conversation List */}
    <div className="w-full md:w-1/3 bg-gray-800 rounded-md shadow-lg p-4 overflow-hidden">
      <h2 className="font-bold text-gray-300 mb-4">Your Conversations</h2>
      <form onSubmit={handleConversationSearch} className="mb-4">
        <input
          type="text"
          placeholder="Search for a user"
          className="border rounded-lg p-2 w-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </form>
  
      {loadingConversations ? (
        <div>Loading...</div>
      ) : (
        conversations.map((conversation) => (
          <Conversation
            key={conversation._id}
            isOnline={onlineUsers.includes(conversation.participants[0]?._id)}
            conversation={conversation}
          />
        ))
      )}
    </div>
  
    {/* Message Container */}
    <div className="w-full md:w-2/3 flex flex-col bg-gray-200 rounded-md shadow-lg overflow-hidden">
      {!selectedConversation || !selectedConversation._id ? (
        <div className="flex-grow flex flex-col items-center justify-center p-4 text-gray-500">
          <GiConversation size="100" />
          <p className="text-lg">Select a conversation to start messaging</p>
        </div>
      ) : (
        <MessageContainer />
      )}
    </div>
  </div>
  
  );
};

export default ChatPage;
