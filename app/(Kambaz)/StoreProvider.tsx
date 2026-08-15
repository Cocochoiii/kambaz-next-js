"use client";

// The Provider gives the store to every screen under it.
// The layout is a server file. So the Provider needs its own file.
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "./store";

export default function StoreProvider({ children }: Readonly<{ children: ReactNode }>) {
  return <Provider store={store}>{children}</Provider>;
}
