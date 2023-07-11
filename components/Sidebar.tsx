import React, { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import Discover from "./Discover";
import SuggestedAccount from "./SuggestedAccount";
import Footer from "./Footer";
import MobileSearchBarModal from "./model/MobileSearchBarModal";
import { IoSearchOutline } from "react-icons/io5";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);

  const router = useRouter();

  const userProfile = false;

  const normalLink =
    "flex items-center -ml-1 gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#F51997] rounded";

  return (
    <aside className="lg:flex lg:flex-col min-w-[3.5rem] w-20 lg:w-full lg:max-w-[31rem] border-r lg:border-none border-r-gray-100 dark:border-r-darkBorder lg:pr-4 h-[calc(100vh-97px)] overflow-hidden overflow-y-auto">
      <div>
        {showMobileSearchBar && (
          <MobileSearchBarModal onClose={() => setShowMobileSearchBar(false)} />
        )}
        <div
          className="block xl:hidden m-2 ml-7 mt-3 text-xl"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          {showSidebar ? <ImCancelCircle /> : <AiOutlineMenu />}
        </div>
        {showSidebar && (
          <div className="xl:w-400 w-20 flex flex-col justify-start mb-2 border-r-2 border-gray-100 xl:border-0 p-3">
            <div className="xl:border-b-2 border-gray-200 xl:pb-4">
              <Link href="/">
                <div className={normalLink} onClick={() => router.push("/")}>
                  <p className="text-2xl">
                    <AiFillHome />
                  </p>
                  <span className="text-xl hidden xl:block">For You</span>
                </div>
              </Link>

              <button
                aria-label="search"
                onClick={() => setShowMobileSearchBar(true)}
                className={`${
                  false
                    ? "active-topic"
                    : "border-gray-200 dark:text-white bg-gray-100 dark:bg-darkBtn hover:bg-gray-200 dark:hover:bg-darkBtnHover hover:border-gray-300"
                } mt-2 mb-2 rounded-full flex md:hidden items-center justify-center w-12 h-12 lg:w-auto lg:h-auto lg:px-3 lg:py-2 border dark:border-darkSecondary focus-visible:outline-none
        `}
              >
                <IoSearchOutline size={23} />
              </button>
            </div>
            <Discover />
            <SuggestedAccount />
            <Footer />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
