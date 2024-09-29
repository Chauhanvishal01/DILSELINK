import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import Spinner from "../../components/subComponents/Spinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notification"],
    queryFn: async () => {
      try {
        const res = await fetch("api/v1/notifications/");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/v1/notifications/delete", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "deleted");
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
    onError: (error) => {
      toast.error(error.message || "something wrong");
    },
  });

  return (
    <>
      <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen bg-gray-950">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-gray-900">
          <p className="font-bold text-white">Notifications</p>
          <div className="dropdown relative">
            <div tabIndex={0} role="button" className="m-1 cursor-pointer">
              <IoSettingsOutline className="w-5 h-5 text-gray-400 hover:text-gray-200 transition duration-300" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content absolute right-0 mt-2 z-10 menu p-2 shadow-lg bg-gray-800 rounded-lg w-52"
            >
              <li>
                <a
                  onClick={deleteNotifications}
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-700 rounded transition duration-200"
                >
                  Clear all notifications
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center h-full items-center">
            <Spinner />
          </div>
        )}

        {/* No Notifications */}
        {!isLoading && notifications?.length === 0 && (
          <div className="text-center p-4 font-bold text-gray-400">
            No notifications 🤔
          </div>
        )}

        {/* Notifications List */}
        {!isLoading &&
          notifications?.map((notification) => (
            <div
              className="border-b border-gray-700 hover:bg-gray-800 transition duration-200"
              key={notification._id}
            >
              <div className="flex gap-4 items-center p-4">
                {/* Notification Icon */}
                {notification.type === "follow" && (
                  <FaUser className="w-7 h-7 text-primary" />
                )}
                {notification.type === "like" && (
                  <FaHeart className="w-7 h-7 text-red-500" />
                )}

                {/* Notification Content */}
                <Link
                  to={`/profile/${notification.from.username}`}
                  className="flex items-center gap-2"
                >
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700">
                      <img
                        src={notification.from.profileImg || "/one.jpeg"}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="text-white">
                    <span className="font-bold">
                      @{notification.from.username}
                    </span>{" "}
                    {notification.type === "follow"
                      ? "followed you"
                      : "liked your post"}
                  </div>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
export default NotificationPage;
