import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const [showNavbar, setShowNavbar] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="bg-gray-100 w-screen h-screen flex items-center ">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className=" shadow-lg bg-white p-2 rounded-md "
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen ">
      <div className="lg:hidden flex items-center p-4">
        <button onClick={() => setShowNavbar(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-13 ">
        <div className="  ">
          <Navbar showNavbar={showNavbar} setShowNavbar={setShowNavbar} />
        </div>
        <div className=" p-4 flex-grow ">{children}</div>
      </div>
    </div>
  );
}
