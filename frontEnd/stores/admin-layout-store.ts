"use client";

import { create } from "zustand";

interface AdminLayoutState {
  sidebarOpen: boolean;
  sidebarPinned: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  setSidebarPinned: (value: boolean) => void;
}

export const useAdminLayoutStore = create<AdminLayoutState>((set) => ({
  sidebarOpen: false,
  sidebarPinned: true,
  toggleSidebar() {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen
    }));
  },
  closeSidebar() {
    set({
      sidebarOpen: false
    });
  },
  setSidebarPinned(value) {
    set({
      sidebarPinned: value
    });
  }
}));
