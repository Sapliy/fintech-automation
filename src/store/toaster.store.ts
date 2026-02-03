import { create } from "zustand";
import { Toaster, ToasterStore } from "./type";

const useToaster = create<ToasterStore>((set: any) => ({
  toasters: [],
  addToast: (toasters: Omit<Toaster, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state: ToasterStore) => ({
      toasters: [...state.toasters, { ...toasters, id }],
    }));
  },
  removeToast: (id: string) => {
    set((state: ToasterStore) => ({
      toasters: state.toasters.filter((n: Toaster) => n.id !== id),
    }));
  },
}));

export default useToaster;
