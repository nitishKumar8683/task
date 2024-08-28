import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./redux/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Task Management System",
  description: "Admin CI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}> <StoreProvider>{children}</StoreProvider></body>
    </html>
  );
}
