import { IUser, Video } from "@/types";
import { Dispatch, SetStateAction } from "react";
import { NextPage } from "next";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useRouter } from "next/router";

interface Props {
  post: Video;

  isShowingOnHome?: boolean;
}

const VideoCard: NextPage<Props> = ({
  post: { caption, postedBy, video, _id, likes },

  isShowingOnHome,
}) => {
  //state
  const [playing, setPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  //hooks
  const router = useRouter();

  //video ref
  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoPres = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const videoElement = videoRef.current!;

    if (playing) {
      videoElement.pause();
      setPlaying(false);
    } else {
      videoElement.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Adjust this threshold as per your requirement
    };

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.play();
          setPlaying(true);
        } else {
          entry.target.pause();
          setPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

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

      <div className="flex w-full xs:ml-[60px] h-[470px] xs:h-[480px] ">
        <div className=" rounded-3xl">
          <Link
            href={`/detail/${_id}`}
            className="group relative rounded-lg h-full w-full max-w-[270px] bg-black flex items-center overflow-hidden cursor-pointer"
          >
            <video
              ref={videoRef}
              loop
              muted
              playsInline
              src={video.asset.url}
              className="video w-full object-cover object-center"
            />

            <div className=" absolute flex md:hidden group-hover:flex justify-between items-center left-0 right-0 bottom-5 xs:bottom-7 px-4 text-white">
              {playing ? (
                <button onClick={onVideoPres}>
                  <BsFillPauseFill className="text-3xl text-white lg:text-[3rem]" />
                </button>
              ) : (
                <button onClick={onVideoPres}>
                  <BsFillPlayFill className=" text-3xl text-white lg:text-[3rem]" />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-2xl text-white lg:text-3xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-2xl text-white lg:text-3xl" />
                </button>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
