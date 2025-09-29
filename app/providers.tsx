// app/providers.tsx
"use client";

import { Provider } from "react-redux";
import store from "./store";              // <-- FIXED: was '../store'
import type { ReactNode } from "react";   // to type children cleanly

export default function Providers({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
}
