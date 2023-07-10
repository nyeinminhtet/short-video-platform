import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";
import { BsFillPlayFill } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import axios from "axios";
import { config } from "@/config/config";
import { Video } from "@/types";
import useAuthStore from "@/store/authStore";
import LikeButton from "@/components/LikeButton";
import CommentButton from "@/components/CommentButton";
import { LiaCommentDots } from "react-icons/lia";

interface Props {
  postDetails: Video;
}

const Detail = ({ postDetails }: Props) => {
  const [post, setPost] = useState(postDetails);
  const [playing, setPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const router = useRouter();
  const { userProfile }: any = useAuthStore();
  const [comment, setComment] = useState("");
  const [isPostingcomment, setIsPostingcomment] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const onVideoClick = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (post && videoRef.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted, post]);

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${config.apiUrl}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });

      setPost({ ...post, likes: data.likes });
    }
  };

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userProfile && comment) {
      setIsPostingcomment(true);

      const { data } = await axios.put(
        `${config.apiUrl}/api/post/${post._id}`,
        {
          userId: userProfile._id,
          comment,
        }
      );
      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingcomment(false);
    }
  };

  if (!post) return null;

  // return (
  //   <div className=" flex w-[100vh] sm:w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap ">
  //     <div className=" relative flex-2 w-[1200px] lg:w-9/12 flex justify-center mt-10 sm:mt-0 items-center bg-black">
  //       <div className=" absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
  //         <p onClick={() => router.back()}>
  //           <MdOutlineCancel className=" text-white text-[35px] cursor-pointer" />
  //         </p>
  //       </div>
  //       <div className=" relative">
  //         <div className=" lg:h-[100vh] h-[60vh]">
  //           <video
  //             onClick={onVideoClick}
  //             ref={videoRef}
  //             loop
  //             src={post.video.asset.url}
  //             className=" h-full"
  //           ></video>
  //         </div>

  //         <div className=" absolute top-[45%] left-[45%]">
  //           {!playing && (
  //             <button onClick={onVideoClick}>
  //               <BsFillPlayFill className=" text-white text-6xl lg:text-8xl" />
  //             </button>
  //           )}
  //         </div>
  //       </div>

  //       <div className=" absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
  //         {isVideoMuted ? (
  //           <button onClick={() => setIsVideoMuted(false)}>
  //             <HiVolumeOff className="text-2xl text-white lg:text-3xl" />
  //           </button>
  //         ) : (
  //           <button onClick={() => setIsVideoMuted(true)}>
  //             <HiVolumeUp className="text-2xl text-white lg:text-3xl" />
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //     <div className=" relative w-[1000px] md:w-[900px] lg:w-[700px]">
  //       <div className=" lg:mt-10 mt-5">
  //         <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
  //           <div className="md:w-10 md:h-10 w-12 h-12 ml-4">
  //             <Link href={`/profile/${userProfile._id}`}>
  //               <>
  //                 <Image
  //                   width={35}
  //                   height={35}
  //                   alt="profile"
  //                   src={post.postedBy.image}
  //                   className=" rounded-full"
  //                 />
  //               </>
  //             </Link>
  //           </div>

  //           <div>
  //             <Link href={`/profile/${post.postedBy._id}`}>
  //               <div className="flex flex-col gap-2">
  //                 <p className="flex items-center gap-2 md:text-md font-bold text-primary">
  //                   {post.postedBy.userName}{" "}
  //                   <VscVerifiedFilled className=" text-blue-500 text-md" />
  //                 </p>
  //               </div>
  //             </Link>
  //           </div>
  //         </div>

  //         <p className=" text-lg text-gray-700 px-8">{post.caption}</p>

  //         <div className=" mt-5 px-10">
  //           {userProfile && (
  //             <div className=" flex items-center justify-between">
  //               <LikeButton
  //                 likes={post.likes}
  //                 handleLike={() => handleLike(true)}
  //                 handleDislike={() => handleLike(false)}
  //               />
  //               <LiaCommentDots className=" text-3xl" />
  //             </div>
  //           )}
  //         </div>

  //         <div></div>
  //         <CommentButton
  //           comment={comment}
  //           setComment={setComment}
  //           isPostingComment={isPostingcomment}
  //           addComment={addComment}
  //           comments={post.comments}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <>
      {post && (
        <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
          <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center mt-10 sm:mt-0 items-center bg-blurred-img bg-no-repeat bg-cover bg-center">
            <div className="opacity-90 absolute top-1 left-2 lg:left-6 flex gap-6 z-50">
              <p className="cursor-pointer " onClick={() => router.back()}>
                <MdOutlineCancel className="text-black text-[35px] hover:opacity-90" />
              </p>
            </div>
            <div className="relative">
              <div className="lg:h-[100vh] h-[60vh]">
                <video
                  ref={videoRef}
                  onClick={onVideoClick}
                  loop
                  src={post?.video?.asset.url}
                  className=" h-full cursor-pointer"
                ></video>
              </div>

              <div className="absolute top-[45%] left-[40%]  cursor-pointer">
                {!playing && (
                  <button onClick={onVideoClick}>
                    <BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
                  </button>
                )}
              </div>
            </div>
            <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10  cursor-pointer">
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-white text-3xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-white text-3xl lg:text-4xl" />
                </button>
              )}
            </div>
          </div>
          <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
            <div className="lg:mt-20 mt-10">
              <Link href={`/profile/${post.postedBy._id}`}>
                <div className="flex gap-4 mb-4 bg-white w-full pl-10 cursor-pointer">
                  <Image
                    width={60}
                    height={60}
                    alt="user-profile"
                    className="rounded-full"
                    src={post.postedBy.image}
                  />
                  <div>
                    <div className="text-xl font-bold lowercase tracking-wider flex gap-2 items-center justify-center">
                      {post.postedBy.userName.replace(/\s+/g, "")}{" "}
                      <VscVerifiedFilled className="text-blue-400 text-xl" />
                    </div>
                    <p className="text-md"> {post.postedBy.userName}</p>
                  </div>
                </div>
              </Link>
              <div className="px-10">
                <p className=" text-md text-gray-600">{post.caption}</p>
              </div>
              <div className="mt-10 px-10">
                {userProfile && (
                  <LikeButton
                    likes={post.likes}
                    handleLike={() => handleLike(true)}
                    handleDislike={() => handleLike(false)}
                  />
                )}
              </div>
              <CommentButton
                comment={comment}
                setComment={setComment}
                addComment={addComment}
                comments={post.comments}
                isPostingComment={isPostingcomment}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${config.apiUrl}/api/post/${id}`);

  return {
    props: {
      postDetails: data,
    },
  };
};

export default Detail;
