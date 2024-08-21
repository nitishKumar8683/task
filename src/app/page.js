import Image from "next/image";
import Login from "@/components/Login/Login";



export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Login />
      </div>
    </>
  );
}
