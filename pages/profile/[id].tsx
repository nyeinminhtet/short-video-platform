import { useState, useEffect } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import Image from "next/image";
import axios from "axios";
import VideoCard from "@/components/videos/VideoCard";
import NoResult from "@/components/NoResult";
import { IUser, Video } from "@/types";
import { config } from "@/config/config";

interface Props {
  data: {
    user: IUser;
    userVideos: Video[];
    userLikedVideos: Video[];
  };
}

const Profile = ({ data }: Props) => {
  const { user, userVideos, userLikedVideos } = data;
  const [showUserVideos, setShowUserVideos] = useState(true);
  const [videoList, setVideoList] = useState<Video[]>([]);

  const videos = showUserVideos ? "border-b-2 border-black" : "text-gray-400";
  const liked = !showUserVideos ? "border-b-2 border-black" : "text-gray-400";

  useEffect(() => {
    if (showUserVideos) {
      setVideoList(userVideos);
    } else {
      setVideoList(userLikedVideos);
    }
  }, [showUserVideos, userVideos, userLikedVideos]);

  return (
    <div className=" w-full">
      <div className=" flex gap-6 md:gap-10 mb-4 bg-white w-full">
        <div className=" w-16 md:w-32 h-16 md:h-32">
          <Image
            width={100}
            height={100}
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
        </div>
      </div>

      <div>
        <div className=" flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
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
              <VideoCard post={video} key={index} />
            ))
          ) : (
            <NoResult
              text={`NO ${showUserVideos ? "" : "Liked"} Videos yet!`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const res = await axios.get(`${config.apiUrl}/api/profile/${id}`);

  return {
    props: {
      data: res.data,
    },
  };
};

export default Profile;
