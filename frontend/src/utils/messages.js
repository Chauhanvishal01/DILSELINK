import { atom } from "recoil";

export const conversationsAtom = atom({
	key: "conversationsAtom",
	default: [],
});

export const selectedConversationAtom = atom({
	key: "selectedConversationAtom",
	default: {
		_id: "",
		userId: "",
		username: "",
		userProfilePic: "",
	},
});



export const fetchConversations = async () => {
  const res = await fetch("/api/v1/messages/conversation");
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error fetching conversations");
  }
  return res.json();
};

