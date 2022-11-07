import { Admin, User } from "pocketbase";
import toast from "react-hot-toast";
import create from "zustand";
import { pocketBaseClient } from "./pocketbase";

export type UserStoreType = {
  user: User | Admin | null;
  setUser: (user: User | Admin | null) => void;
  logout: () => void;
};

export const useUserStore = create<UserStoreType>((set) => {
  toast("store has been just created!");

  pocketBaseClient.authStore.onChange((token, model) => {
    set((state) => ({ ...state, user: model }));
  }, true);

  return {
    user: pocketBaseClient.authStore.model,
    setUser: (user) => {
      toast("user updated!");
      set((state) => {
        return {
          ...state,
          user,
        };
      });
    },
    logout: () => pocketBaseClient.authStore.clear(),
  };
});
