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
        console.log(data);
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
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
        {/* Header */}
        <div className="flex w-full border-b border-gray-700">
          <div
            className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
              feedType === "followers" ? "bg-secondary" : ""
            }`}
            onClick={() => setFeedType("followers")}
          >
            Followers
            {feedType === "followers" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
          <div
            className={`flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative ${
              feedType === "following" ? "bg-secondary" : ""
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
            {feedType === "following" && (
              <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary"></div>
            )}
          </div>
        </div>
        <div>
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
            <div className="space-y-4 hover:cursor-pointer">
              {users.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  className="bg-gray-900  w-full hover:bg-gray-800 shadow-lg rounded-lg p-4 transition duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-16 h-16 border-2 border-green-400 rounded-full overflow-hidden">
                        <img
                          src={user.profileImg || '/man1.jpg'}
                          alt={`${user.name}'s profile`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-lg">
                        {user.fullName}
                      </div>
                      <div className="text-gray-400 text-sm">
                        @{user.username}
                      </div>
                      <div className="text-gray-300 text-sm mt-1">
                        {user.bio}
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
