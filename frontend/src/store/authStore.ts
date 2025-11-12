import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

import { UserType } from "@/types";
import { refreshSession } from "@/utils/auth";

interface GoogleIdTokenPayload {
  given_name?: string;
  email?: string;
  picture?: string;
  name?: string;
  family_name?: string;
  sub?: string;
}

type AuthState = {
  idToken: string | undefined;
  user: UserType | undefined;
  login: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  idToken: undefined,
  user: undefined,
  login: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      // # List of endpoints that doesnt need auth
      if (!["/login", "/callback"].includes(window.location.pathname)) {
        window.location.pathname = "/login";
      }

      set({ idToken: "NO TOKEN" });

      return;
    }

    const idToken = await refreshSession(refreshToken);

    if (idToken) {
      set({ idToken });
      const decoded = jwtDecode<GoogleIdTokenPayload>(idToken);
      console.log(decoded.sub);

      set({
        user: {
          name: decoded?.given_name ?? "",
          email: decoded?.email ?? "",
          avatar: decoded?.picture ?? "",
          fullname: decoded?.name ?? "",
          surname: decoded?.family_name ?? "",
          sub: decoded?.sub ?? "",
        },
      });
    } else {
      localStorage.removeItem("refreshToken");
      window.location.pathname = "/login";
    }
  },

  refresh: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) return;

    const idToken = await refreshSession(refreshToken);

    if (idToken) {
      set({ idToken });
    }
  },
}));
