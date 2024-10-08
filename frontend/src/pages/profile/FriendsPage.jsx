// src/FriendsPage.js
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import RightPanelSkeleton from "../../components/subComponents/RightPanelSkeleton";
import { Link } from "react-router-dom";

const FriendsPage = () => {
  const [feedType, setFeedType] = useState("followers");

  const getUsersEndPoint = (feedType) => {
    switch (feedType) {
      case "following":
        return "/api/v1/users/following";
      case "followers":
        return `/api/v1/users/followers`;

      default:
        return;
    }
  };

  const User_EndPoint = getUsersEndPoint(feedType);

  const {
    data: users,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      try {
        const res = await fetch(User_EndPoint);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen bg-gray-950">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700 bg-gray-900">
          <div
            className={`flex justify-center flex-1 p-3 hover:bg-gray-800 transition duration-300 cursor-pointer relative ${
              feedType === "followers"
                ? "bg-gray-800 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setFeedType("followers")}
          >
            Followers
            {feedType === "followers" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className={`flex justify-center flex-1 p-3 hover:bg-gray-800 transition duration-300 cursor-pointer relative ${
              feedType === "following"
                ? "bg-gray-800 text-white"
                : "text-gray-400"
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col gap-4 space-y-4">
            {(isLoading || isRefetching) && (
              <>
                <RightPanelSkeleton />
                <RightPanelSkeleton />
                <RightPanelSkeleton />
              </>
            )}
          </div>

          {!isLoading && !isRefetching && users?.length === 0 && (
            <p className="text-center my-4 text-gray-400">
              Users Not found. Switch 👻
            </p>
          )}

          {!isLoading && !isRefetching && users && (
            <div className="space-y-6">
              {users.map((user, index) => (
                <Link
                  key={index}
                  to={`/profile/${user.username}`}
                  className="block"
                >
                  <div className="bg-gray-800 hover:bg-gray-700 shadow-lg rounded-lg p-4 transition duration-300 transform hover:scale-105">
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="w-16 h-16 border-2 border-primary rounded-full overflow-hidden shadow-lg">
                          <img
                            src={user.profileImg || "/one.jpeg"}
                            alt={`${user.name}'s profile`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-bold text-lg">
                          {user.fullName}
                        </div>
                        <div className="text-gray-400 text-sm">
                          @{user.username}
                        </div>
                        <div className="text-gray-300 text-sm mt-1 italic">
                          {user.bio}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FriendsPage;
