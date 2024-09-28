import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const queryClient = useQueryClient();

  const { mutate: setSelectedConversation } = useMutation({
    mutationFn: (selectedConversation) => {
      queryClient.setQueryData("selectedConversation", selectedConversation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("selectedConversation");
    },
  });

  return (
    <div
      className="flex items-center p-2 gap-4 rounded-md hover:cursor-pointer hover:bg-gray-600 text-white"
      onClick={() => {
        const selected = {
          _id: conversation._id,
          userId: user._id,
          userProfileImg: user.profileImg,
          username: user.username,
          mock: conversation.mock || [],
        };
        setSelectedConversation(selected);
      }}
    >
      <div className="relative">
        <img
          src={user.profileImg || "/man1.jpg"}
          alt="User"
          className="w-12 h-12 rounded-full object-cover"
        />
        {isOnline ? (
          <div className="h-2 w-2 rounded-full bg-green-600"></div>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-col text-sm">
        <div className="flex items-center font-bold">
          <span>{user.username}</span>
        </div>
        <span className="text-xs flex items-center gap-1">
          {lastMessage.sender === user._id && (
            <BsCheck2All
              size={16}
              className={lastMessage.seen ? "text-blue-400" : ""}
            />
          )}
          {lastMessage.text.length > 12
            ? lastMessage.text.substring(0, 12) + "..."
            : lastMessage.text || <BsFillImageFill size={16} />}
        </span>
      </div>
    </div>
  );
};

export default Conversation;
