import { useQuery, useQueryClient } from "@tanstack/react-query";
import Conversation from "./Conversation";
import MessageContainer from "./MessageContainer";
import { toast } from "react-toastify";
import { fetchConversations } from "../../utils/messages";
import { GiConversation } from "react-icons/gi";
import { useSocket } from "../../context/SocketContext";

const ChatPage = () => {
  const {  onlineUsers } = useSocket();
  const queryClient = useQueryClient();
  const { data: selectedConversation } = useQuery({
    queryKey: ["selectedConversation"],
    queryFn: () => queryClient.getQueryData("selectedConversation"),
    enabled: true,
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });

  if (error) {
    toast.error(error.message);
  }

  return (
    <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen bg-gray-950 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
        <p className="font-bold text-white">Chat</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:w-full sm:w-[400px] flex-1 overflow-hidden">
        <div className="flex flex-col flex-[35%] gap-2 md:max-w-full overflow-y-auto">
          <p className="font-bold text-gray-600 dark:text-gray-400">
            Your Conversations
          </p>
          {!isLoading &&
            data &&
            data.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
              />
            ))}
        </div>

        {/* MessageContainer */}
        {selectedConversation ? (
          <MessageContainer selectedConversation={selectedConversation} />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 rounded-md h-[400px] w-full">
            <GiConversation className="text-6xl" />
            <p className="text-lg">
              Select a Conversation to start messaging...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
