import { create } from "zustand";
import { AppStateDialog, DialogConfig } from "./type";
import { useStoreNode } from "./node.store";
import { useFlowStore } from "./flow.store";

const useStoreDialog = create<AppStateDialog>((set) => ({
  dialog: null,
  setDialog: (dialog: DialogConfig | null) => set({ dialog }),

  clearAutomation: () => {
    const { clearAutomation } = useStoreNode.getState();
    const dialog: DialogConfig = {
      isOpen: true,
      title: "Clear Automation",
      message:
        "Are you sure you want to clear all nodes and edges? This action cannot be undone.",
      type: "danger",
      confirmText: "Clear All",
      cancelText: "Keep",
      onConfirm: () => {
        clearAutomation();
        set({ dialog: null });
      },
      onCancel: () => set({ dialog: null }),
    };
    set({ dialog });
  },

  saveAutomation: async () => {
    const dialog: DialogConfig = {
      isOpen: true,
      title: "Save Automation",
      message: "Do you want to save your current automation?",
      type: "info",
      confirmText: "Save",
      cancelText: "Cancel",
      onConfirm: async () => {
        try {
          await useFlowStore.getState().saveCurrentFlow();

          // Show success dialog
          set({
            dialog: {
              isOpen: true,
              title: "Success",
              message: "Automation has been saved successfully!",
              type: "info",
              confirmText: "OK",
              cancelText: null,
              onConfirm: () => set({ dialog: null }),
              onCancel: () => set({ dialog: null }),
            },
          });
        } catch (error) {
          // Show error dialog
          set({
            dialog: {
              isOpen: true,
              title: "Error",
              message: "Failed to save automation. Please try again.",
              type: "danger",
              confirmText: "Try Again",
              cancelText: "Cancel",
              onConfirm: () => useStoreDialog.getState().saveAutomation(),
              onCancel: () => set({ dialog: null }),
            },
          });
        }
      },
      onCancel: () => set({ dialog: null }),
    };
    set({ dialog });
  },
}));

export { useStoreDialog, type AppStateDialog };
