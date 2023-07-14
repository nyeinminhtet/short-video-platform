import { config } from "@/config/config";
import axios from "axios";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/router";
import NoResult from "@/components/NoResult";
import { IUser, Video } from "@/types";
import { VscVerifiedFilled } from "react-icons/vsc";
import VideoCard from "@/components/VideoCard";
import Layout from "@/components/Layout";
import { FaUserAltSlash } from "react-icons/fa";
import { MdOutlineVideocamOff } from "react-icons/md";

const Search = ({ videos }: { videos: Video[] }) => {
  const [isAccount, setIsAccount] = useState(false);
  const router = useRouter();
  const { searchTerm }: any = router.query;
  const { allUsers } = useAuthStore();

  const account = isAccount ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccount ? "border-b-2 border-black" : "text-gray-400";

  const searchUsers = allUsers.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="m-auto mt-0 w-screen md:w-[200vh] ml-10 mr-10">
        <div className="  mt-0 mr-10">
          <div className=" flex gap-10 mb-5 mt-10 border-b-2 border-gray-200 bg-white w-full">
            <p
              className={`text-xl font-semibold cursor-pointer mt-2 ${account}`}
              onClick={() => setIsAccount(true)}
            >
              Accounts
            </p>
            <p
              className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
              onClick={() => setIsAccount(false)}
            >
              Videos
            </p>
          </div>

          {isAccount ? (
            <div className=" md:mt-10 mt-5">
              {searchUsers.length ? (
                searchUsers.map((user: IUser, i: number) => (
                  <Link href={`/profile/${user._id}`} key={i}>
                    <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
                      <div>
                        <Image
                          width={50}
                          height={50}
                          src={user.image}
                          alt="user profile"
                          className=" rounded-full"
                        />
                      </div>

                      <div className="">
                        <p className=" flex gap-1 items-center text-md font-bold text-primary lowercase">
                          {user.userName.replaceAll(" ", "")}{" "}
                          <VscVerifiedFilled className=" text-blue-400" />
                        </p>
                        <p className=" text-gray-400 text-md capitalize">
                          {user.userName}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <NoResult
                  text={`No users for ${searchTerm}`}
                  icon={<FaUserAltSlash />}
                />
              )}
            </div>
          ) : (
            <div className=" md:mt-1 flex flex-wrap gap-6 md:justify-start">
              {videos.length ? (
                videos.map((video: Video, index: number) => (
                  <VideoCard post={video} key={index} />
                ))
              ) : (
                <NoResult
                  text={`No videos result for ${searchTerm}`}
                  icon={<MdOutlineVideocamOff />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const res = await axios.get(`${config.baseUrl}/api/search/${searchTerm}`);

  return {
    props: {
      videos: res.data,
    },
  };
};

export default Search;
