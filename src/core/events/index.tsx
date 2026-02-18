import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useMainStore } from "@/lib/zustand/store";
import { useLogoutService } from "@/hooks/auth/logout";
import { UserType } from "@/types";
import { useSettingsServices } from "@/modules/settings/services";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export function SocketEvents() {
  const { user } = useMainStore();
  const { logout } = useLogoutService();
  const socketRef = useRef<Socket | null>(null);
  const { getMyProfile } = useSettingsServices();
  // API/store typically use _id; support both for compatibility
  const userId = user?._id ?? user?.id;

  useEffect(() => {
    if (!userId) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!SOCKET_URL) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        userId,
        username: user?.firstName ?? "",
      },
    });

    socketRef.current = socket;

    socket.emit("join", `user:${userId}`);
    console.log("joined room", `user:${userId}`);

    const onUserBlocked = () => {
      toast.error("Your account has been blocked");
      logout();
    };

    const onNotifyCourseCreated = () => {
      toast.success("New notification");
    };

    const onJobSearchStarted = () => {
      toast.success("Job search started");
      window.location.reload();
      getMyProfile();
    };

    const onJobSearchCompleted = (payload: { data?: { user?: { _doc: UserType } } }) => {
      toast.success("Job search completed");
      console.log({payload})
      window.location.reload();
      getMyProfile();
    };

    socket.on("userBlocked", onUserBlocked);
    socket.on("notifyCourseCreated", onNotifyCourseCreated);
    socket.on("jobSearchStarted", onJobSearchStarted);
    socket.on("jobSearchCompleted", onJobSearchCompleted);

    return () => {
      socket.off("userBlocked", onUserBlocked);
      socket.off("notifyCourseCreated", onNotifyCourseCreated);
      socket.off("jobSearchStarted", onJobSearchStarted);
      socket.off("jobSearchCompleted", onJobSearchCompleted);
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- reconnect only when user id changes
  }, [userId, logout]);

  return null;
}
