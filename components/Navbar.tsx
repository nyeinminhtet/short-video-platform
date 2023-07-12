import React, { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { useRouter } from "next/router";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { IoMdAdd } from "react-icons/io";
import { createOrGetUser } from "@/utils";
import useAuthStore from "@/store/authStore";
import { IoSearchOutline } from "react-icons/io5";
import LogoLight from "@/utils/LogoLight";

const Navbar = () => {
  const { userProfile, addUser, removeUser } = useAuthStore();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: FormEvent) {
    e.preventDefault();

    const searchTerm = searchInputRef.current?.value!.trim();

    if (!searchTerm) return;

    router.push(`/search/${searchTerm}`);
  }

  return (
    <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
      <Link href="/">
        <div className="w-[90px]  sm:w-[130px]">
          <LogoLight />
        </div>
      </Link>

      <div className=" relative hidden md:block">
        <form
          onSubmit={handleSearch}
          className="hidden md:flex justify-between items-center dark:text-white bg-gray-100 dark:bg-darkSecondary rounded-full overflow-hidden border dark:border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-500 focus-within:bg-gray-200 dark:focus-within:bg-darkSecondary"
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search accounts and videos"
            className="peer flex-1 w-full p-2 pl-4 border-none outline-none bg-transparent dark:placeholder-gray-500"
          />

          <button
            type="submit"
            className="w-11 h-10 flex items-center justify-center border-l text-gray-400 border-l-gray-200 dark:border-l-gray-500 peer-focus:border-l-gray-300 dark:peer-focus:border-l-gray-500 cursor-pointer"
          >
            <IoSearchOutline size={23} />
          </button>
        </form>
      </div>

      <div className=" flex justify-center">
        {userProfile ? (
          <div className="flex gap-5 md:gap-10">
            <Link href="/upload">
              <button className="border-2 px-2 md:px-4 text-md font-semibold mt-1 flex items-center gap-2">
                <IoMdAdd className="text-xl" /> {` `}
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>
            {userProfile.image && (
              <>
                <Image
                  width={30}
                  height={30}
                  alt="profile"
                  src={userProfile.image}
                  className=" rounded-full cursor-pointer"
                />
              </>
            )}

            <button
              type="button"
              className="px-2"
              onClick={() => {
                googleLogout();
                removeUser();
              }}
            >
              <AiOutlineLogout color="red" fontSize={21} />
            </button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(response) => createOrGetUser(response, addUser)}
            text="signin"
            size="medium"
            shape="pill"
            onError={() => console.log("Login Failed!")}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
