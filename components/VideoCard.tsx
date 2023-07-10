import { Video } from "@/types";
import { NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { VscVerifiedFilled } from "react-icons/vsc";

interface Props {
  post: Video;
  isShowingOnHome?: boolean;
}

const VideoCard: NextPage<Props> = ({
  post: { caption, postedBy, video, _id, likes },
  isShowingOnHome,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoPres = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  if (!isShowingOnHome) {
    return (
      <div>
        <Link href={`/detail/${_id}`}>
          <video
            loop
            src={video.asset.url}
            className="w-[250px] md:w-full rounded-xl cursor-pointer"
          ></video>
        </Link>
        <div className="flex gap-2 -mt-8 items-center ml-4">
          <p className="text-white text-lg font-medium flex gap-1 items-center">
            <BsPlay className="text-2xl" />
            {likes?.length || 0}
          </p>
        </div>
        <Link href={`/detail/${_id}`}>
          <p className="mt-5 text-md text-gray-800 cursor-pointer w-210">
            {caption}
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      <div>
        <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
          <div className="md:w-16 md:h-16 w-10 h-10">
            <Link href={`/profile/${postedBy._id}`}>
              <>
                <Image
                  width={35}
                  height={35}
                  alt="profile"
                  src={postedBy.image}
                  className=" rounded-full"
                />
              </>
            </Link>
          </div>

          <div>
            <Link href={`/profile/${postedBy._id}`}>
              <div className="flex items-center gap-2">
                <p className="flex items-center gap-2 md:text-md font-bold text-primary">
                  {postedBy.userName}{" "}
                  <VscVerifiedFilled className=" text-blue-500 text-md" />
                </p>
                <p className=" capitalize font-medium text-xs text-gray-500 hidden md:block">
                  {postedBy.userName}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className=" font-semibold text-md mb-3 ml-10">{caption}</div>

      <div className="lg:ml-20 flex gap-4 relative">
        <div
          className=" rounded-3xl"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Link href={`/detail/${_id}`}>
            <video
              ref={videoRef}
              loop
              src={video.asset.url}
              className="lg:w-[700px] h-[300px] md:h-[370px] lg:h-[430px] w-[200px] rounded-2xl cursor-pointer bg-gray-100"
            ></video>
          </Link>

          {isHover && (
            <div className=" absolute bottom-6 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] p-3 cursor-pointer left-8">
              {playing ? (
                <button onClick={onVideoPres}>
                  <BsFillPauseFill className="text-3xl text-black lg:text-[3rem]" />
                </button>
              ) : (
                <button onClick={onVideoPres}>
                  <BsFillPlayFill className=" text-3xl text-black lg:text-[3rem]" />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-2xl text-black lg:text-3xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-2xl text-black lg:text-3xl" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
