"use client";
import "./quiz-styles.css";
import "react-quill/dist/quill.snow.css";

export default function QuizzesLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}