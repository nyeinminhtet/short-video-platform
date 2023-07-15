import { useState, useEffect } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import Image from "next/image";
import axios from "axios";
import NoResult from "@/components/NoResult";
import { IUser, Video } from "@/types";
import { config } from "@/config/config";
import VideoCard from "@/components/VideoCard";
import Head from "next/head";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { MdOutlineVideocam } from "react-icons/md";
import useAuthStore from "@/store/authStore";
import useFollow from "@/hooks/useFollow";
import Link from "next/link";
import { BsHeartFill, BsPersonPlus } from "react-icons/bs";
import { RiUserFollowLine } from "react-icons/ri";

interface Props {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

interface VideoItemProps {
  videoURL: string;
  likes: number;
  caption: string;
  videoId: string;
}

function VideoItem({ videoURL, likes, caption, videoId }: VideoItemProps) {
  return (
    <Link
      href={`/video/${videoId}`}
      className="flex flex-col items-center w-52 xs:w-auto"
    >
      <div className="overflow-hidden relative bg-black h-[290px] w-52 xs:w-auto xs:h-[250px] flex items-center justify-center rounded-md">
        <video src={videoURL} className="object-cover" />

        <div className="text-white absolute bottom-0 left-0 text-sm backdrop-blur-sm w-full flex items-center p-2 py-3">
          <BsHeartFill size={18} className="mr-1" /> {likes}
        </div>
      </div>
      <p className="mt-1 self-start text-sm line-clamp-1 text-gray-900 dark:text-gray-300">
        {caption}
      </p>
    </Link>
  );
}

const Profile = ({ data }: Props) => {
  const { user, userVideos, userLikedVideos } = data;
  const [showLogin, setShowLogin] = useState(false);
  const [showUserVideos, setShowUserVideos] = useState(true);
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [userInfo, setUserInfo] = useState(user);
  const { userProfile: currentUser }: any = useAuthStore();

  const videos = showUserVideos ? "border-b-2 border-black" : "text-gray-400";
  const liked = !showUserVideos ? "border-b-2 border-black" : "text-gray-400";
  const router = useRouter();
  const following = user?.following?.length;
  const followers = user?.follower?.length;
  const isAlreadyFollow = userInfo.follower?.some(
    (user) => user._ref === currentUser?._id
  );

  const isMe = user._id === currentUser?._id;

  const { loadingFollow, handleFollow } = useFollow();

  const totalLikes = userVideos?.reduce(
    (like: number, item: Video) => like + (item.likes?.length || 0),
    0
  );
  async function followHandler() {
    if (!currentUser) {
      setShowLogin(true);
      return;
    }

    const obj = {
      userId: currentUser?._id,
      creatorId: user?._id,
      follow: isAlreadyFollow ? false : true,
    };

    const updatedUsers = await handleFollow(obj);

    const creator = updatedUsers.find((u) => u._id === userInfo?._id)!;

    setUserInfo((prev) => ({ ...prev, follower: creator.follower }));
  }

  useEffect(() => {
    if (showUserVideos) {
      setVideoList(userVideos);
    } else {
      setVideoList(userLikedVideos);
    }
  }, [showUserVideos, userVideos, userLikedVideos]);

  const hasNoUser = !user && !userVideos && !userLikedVideos;

  const TITLE = hasNoUser ? "No User Found" : `${user?.userName} | TikTok`;

  return (
    <Layout>
      <Head>
        <title>{TITLE}</title>
        <meta
          property="og:url"
          content={`https://short-video-platform.vercel.app/profile/${router.query.id}`}
        ></meta>
      </Head>

      <div className=" w-full">
        <div className=" flex gap-6 md:gap-10 mb-4 bg-white w-full ml-7 md:ml-0">
          <div className=" w-10 md:w-32 h-16 md:h-32">
            <Image
              width={80}
              height={80}
              src={user.image}
              alt="user profile"
              className=" rounded-full"
            />
          </div>

          <div>
            <p className=" md:text-2xl tracking-wider flex gap-1 items-center text-md font-bold text-primary lowercase">
              {user.userName.replaceAll(" ", "")}{" "}
              <VscVerifiedFilled className=" text-blue-400" />
            </p>
            <p className=" capitalize md:text-xl text-gray-400 text-sm">
              {user.userName}
            </p>
            {!isMe && (
              <div className=" mt-2 md:mt-3">
                {isAlreadyFollow ? (
                  <button
                    onClick={followHandler}
                    disabled={loadingFollow}
                    className=" bg-primary h-10 rounded-md text-sm xs:text-base font-semibold w-28 xs:w-40"
                  >
                    Following
                  </button>
                ) : (
                  <button
                    onClick={followHandler}
                    disabled={loadingFollow}
                    className="text-sm xs:text-base font-semibold w-28 h-10 text-white bg-red-500 hover:bg-red-600 rounded-md xs:w-40"
                  >
                    Follow
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="text-sm mt-5 ml-7 flex flex-wrap gap-4 xs:gap-x-6 text-gray-600 dark:text-gray-300">
          <p>
            <span className="text-black font-bold text-base mr-1">
              {following || 0}
            </span>
            Following
          </p>
          <p>
            <span className="text-black font-bold text-base mr-1">
              {followers || 0}
            </span>
            {followers! > 1 ? "Followers" : "Follower"}
          </p>
          <p>
            <span className="text-black font-bold text-base mr-1">
              {totalLikes || 0}
            </span>
            {totalLikes > 1 ? "Likes" : "Like"}
          </p>
        </div>

        <div className=" ml-6">
          <div className=" flex gap-10 mb-5 mt-4 border-b-2 border-gray-200 bg-white w-full">
            <p
              className={`text-xl font-semibold cursor-pointer mt-2 ${videos}`}
              onClick={() => setShowUserVideos(true)}
            >
              Videos
            </p>
            <p
              className={`text-xl font-semibold cursor-pointer mt-2 ${liked}`}
              onClick={() => setShowUserVideos(false)}
            >
              Liked
            </p>
          </div>

          <div className=" flex gap-6 flex-wrap md:justify-start">
            {videoList.length > 0 ? (
              videoList.map((video: Video, index: number) => (
                <VideoItem
                  videoURL={video.video.asset.url}
                  key={index}
                  likes={video.likes.length}
                  caption={video.caption}
                  videoId={video._id}
                />
              ))
            ) : (
              <NoResult
                text={`NO ${showUserVideos ? "" : "Liked"} Videos yet!`}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const res = await axios.get(`${config.baseUrl}/api/profile/${id}`);

  return {
    props: {
      data: res.data,
    },
  };
};

export default Profile;
