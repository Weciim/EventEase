"use client";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { StateContext } from "@/components/context/CartContext";
import "@/app/(root)/styles.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StateContext>
      <div className="flex h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </StateContext>
  );
}
