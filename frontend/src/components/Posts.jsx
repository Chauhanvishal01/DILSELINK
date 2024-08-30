import { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "./subComponents/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
const Posts = ({ feedType, username, userId }) => {
  const getPostEndPoint = (feedType) => {
    switch (feedType) {
      case "forYou":
        return "/api/v1/posts/getall";

      case "following":
        return "/api/v1/posts/following";
      case "posts":
        return `/api/v1/posts/user/${username}`;
      case "likes":
        return `/api/v1/posts/getlikedpost/${userId}`;

      default:
        return "/api/v1/posts/getall";
    }
  };

  const Post_EndPoint = getPostEndPoint(feedType);

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await fetch(Post_EndPoint);
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
  }, [feedType, refetch, username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
