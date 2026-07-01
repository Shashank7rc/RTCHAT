import {create} from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useAuthStore = create((set,get)=>({ ///? get?
    //initial states 
    authUser : null,
    isCheckingAuth:true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

      checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data }); //changing state
      get().connectSocket();
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

    signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

   login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

 logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },
   connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    // Extract JWT from cookies as fallback for browsers that block third-party cookies
    const getTokenFromCookie = () => {
      const cookieString = document.cookie;
      const jwtCookie = cookieString
        .split("; ")
        .find((row) => row.startsWith("jwt="));
      return jwtCookie ? jwtCookie.split("=")[1] : null;
    };

    const token = getTokenFromCookie();

    const socket = io(SOCKET_URL, {
      withCredentials: true, // this ensures cookies are sent with the connection
      auth: {
        token: token, // fallback: send token explicitly if cookie transmission fails
      },
    });

    socket.connect();

    set({ socket });
    
    // Log connection status for debugging
    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });
    
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}))

