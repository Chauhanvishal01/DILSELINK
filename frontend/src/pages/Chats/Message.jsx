import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import notificationSound from "../../assets/sounds/notification.mp3";
const Message = ({ ownMessage, message }) => {
  const queryClient = useQueryClient();
  const selectedConversation = queryClient.getQueryData("selectedConversation");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // State to manage the shake animation
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!ownMessage && message?.text) {
      setShake(true);

      const sound = new Audio(notificationSound);
      sound.play();

      const timer = setTimeout(() => setShake(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [message, ownMessage]);

  return (
    <>
      {ownMessage ? (
        <div className="flex items-end justify-end gap-2 mb-4">
          {/* Message text */}
          <div
            className={`max-w-[350px] bg-blue-500 text-white rounded-lg p-3 shadow-md`}
          >
            {message.text}
          </div>
          {/* User image */}
          <img
            src={authUser?.profileImg}
            alt="User"
            className="h-8 w-8 rounded-full border-2 border-blue-400 object-cover"
          />
        </div>
      ) : (
        <div className="flex items-start justify-start gap-2 mb-4">
          {/* Other user image */}
          <img
            src={selectedConversation?.userProfileImg}
            alt="User"
            className="h-8 w-8 rounded-full border-2 border-green-400 object-cover"
          />
          {/* Message text with shake animation */}
          <div
            className={`max-w-[350px] bg-green-500 text-white rounded-lg p-3 shadow-md ${
              shake ? "shake" : ""
            }`}
          >
            {message.text}
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
