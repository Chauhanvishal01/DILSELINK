
import { useRecoilState, useRecoilValue } from "recoil";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../utils/messages.js";
import { useQuery } from "@tanstack/react-query";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation?.participants[0];
  const { data: currentUser } = useQuery({ queryKey: ["authUser"] });

  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );


  
  return (
    <div
      className={`flex items-center gap-4 p-1 rounded-md cursor-pointer ${
        selectedConversation?._id === conversation?._id ? "bg-gray-400" : ""
      } hover:bg-gray-600 hover:text-white`}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profileImg,
          username: user.username,
          mock: conversation.mock,
        })
      }
    >
      <div className="relative">
        <img
          src={user?.profileImg || "/one.jpeg"}
          alt={user?.username}
          className="w-10 h-10 rounded-full"
        />
        {isOnline && (
          <span className="absolute bg-green-500 w-3 h-3 rounded-full top-0 right-0 border border-white" />
        )}
      </div>

      <div className="flex flex-col text-sm">
        <span className="font-bold flex items-center">
          {user?.username}{" "}
          {/* <img src="/verified.png" alt="verified" className="w-4 h-4 ml-1" /> */}
        </span>
        <span className="text-xs flex items-center gap-1">
          {currentUser?._id === lastMessage?.sender && (
            <span className={lastMessage ? "text-blue-100" : ""}>
              <BsCheck2All size={16} />
            </span>
          )}
          {lastMessage?.text?.length > 18
            ? `${lastMessage.text.substring(0, 18)}...`
            : lastMessage.text }
        </span>
      </div>
    </div>
  );
};

export default Conversation;
