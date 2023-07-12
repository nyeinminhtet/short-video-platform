import { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { pathname } = useRouter();

  const homeRoute = pathname === "/";
  const profileRoute = pathname === "/profile/[id]";
  const searchRoute = pathname === "/search";

  const showSideBar = homeRoute || profileRoute || searchRoute;

  return (
    <div>
      <Navbar />

      <main className="flex gap-6 md:gap-20">
        <div className="h-[92vh] overflow-hidden xl:overflow-auto">
          {showSideBar && <Sidebar />}
        </div>

        <div className="mt-4 -ml-10 sm:ml-auto flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
