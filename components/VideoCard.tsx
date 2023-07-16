import { IUser, Video } from "@/types";
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsPlay, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useRouter } from "next/router";
import LikeButton from "./LikeButton";
import useAuthStore from "@/store/authStore";
import { config } from "@/config/config";
import axios from "axios";
import { BiCommentDots } from "react-icons/bi";
import NotLoginModal from "./modal/NotLoginModal";
import ShowFollowOrDelete from "./ShowFollowOrDelete";
import { ObjProps } from "@/hooks/useFollow";

interface Props {
  post: Video;
  postedBy: IUser;
  loadingFollow: boolean;
  setAllPostedBy: Dispatch<SetStateAction<any>>;
  handleFollow: (obj: ObjProps) => Promise<IUser[]>;
  setCurrentUserId: Dispatch<SetStateAction<string>>;
}

const VideoCard = ({
  post,
  loadingFollow,
  handleFollow,
  setCurrentUserId,
  setAllPostedBy,
  postedBy,
}: Props) => {
  //state
  const { caption, video, _id, likes } = post;

  const [playing, setPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [postDetail, setPostDetail] = useState(post);
  const [showLogin, setShowLogin] = useState(false);
  const { userProfile }: any = useAuthStore();

  // already follow
  const isAlreadyFollow = postedBy.follower?.some(
    (user) => user._ref === userProfile?._id
  )!;

  // checkIsMe
  const isMe = postedBy._id === userProfile?._id;

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

  const handleLike = async (like: boolean) => {
    if (!userProfile) {
      return setShowLogin(true);
    }
    if (userProfile) {
      const { data } = await axios.put(`${config.baseUrl}/api/like`, {
        userId: userProfile._id,
        postId: postDetail._id,
        like,
      });

      setPostDetail({ ...postDetail, likes: data.likes });
    }
  };

  const followHandler = async () => {
    if (!userProfile) {
      setShowLogin(true);
      return;
    }

    setCurrentUserId(postedBy?._id);

    const obj = {
      userId: userProfile._id,
      creatorId: postedBy?._id,
      follow: isAlreadyFollow ? false : true,
    };

    const updatedUsers = await handleFollow(obj);

    const creator = updatedUsers.find((u) => u._id === postedBy?._id)!;

    setAllPostedBy((prev: IUser[]) => [
      ...prev.map((user: IUser) =>
        user._id === postedBy?._id
          ? { ...user, follower: creator.follower }
          : user
      ),
    ]);
  };
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  useEffect(() => {
    if (userProfile) {
      setShowLogin(false);
    }
  }, [userProfile]);

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      {showLogin && <NotLoginModal onClose={() => setShowLogin(false)} />}
      <header className=" flex items-center">
        <div className="flex gap-1 p-2 cursor-pointer font-semibold rounded mr-10">
          <div className="md:w-13 md:h-13 w-10 h-10">
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
                <p className="flex items-center gap-0 md:text-md font-bold text-primary">
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

        {/* follow button */}
        {!isMe && (
          <div className=" -mt-3">
            <ShowFollowOrDelete
              isCreator={postedBy?._id === userProfile?._id}
              isAlreadyFollow={isAlreadyFollow}
              followHandler={followHandler}
              loadingFollow={loadingFollow}
              userId={postedBy?._id}
            />
          </div>
        )}
      </header>

      <div className=" font-semibold text-md mb-3 ml-5">{caption}</div>

      <div className="flex w-full xs:ml-[60px] h-[470px] xs:h-[480px] ">
        <div className=" group relative rounded-3xl">
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
          </Link>
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
          <div className=" absolute right-0 flex flex-col justify-between items-center bottom-[20%] ">
            <LikeButton
              likes={postDetail.likes}
              handleLike={() => handleLike(true)}
              handleDislike={() => handleLike(false)}
            />

            <Link
              href={`/detail/${_id}`}
              className=" mt-5 bg-gray-300  p-2 rounded-full text-gray-800"
            >
              <BiCommentDots size={30} />
            </Link>
            <p className=" text-white font-semibold text-sm">
              {post.comments?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
