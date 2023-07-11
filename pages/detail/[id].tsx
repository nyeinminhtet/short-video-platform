import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
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

  useEffect(() => window.scrollTo(0, 0), []);

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

  return (
    <>
      {post && (
        <div className=" lg:min-h-screen w-full flex flex-col lg:flex-row bg-gray-800">
          {/* left */}
          <div className="h-[480px] w-full lg:flex-1 lg:h-screen bg-img-blur bg-no-repeat bg-cover object-cover">
            <div
              onClick={() => router.back()}
              title="back"
              className="absolute z-50 flex items-center justify-center text-white bg-[#7e7b7b5e] w-9 h-9 rounded-full top-2 left-4 cursor-pointer hover:bg-[#5c59595e]"
            >
              <RxCross2 size={23} />
            </div>

            <div className="relative bg-black h-full max-w-[270px] lg:max-w-[390px] flex items- justify-center mx-auto cursor-pointer">
              <video
                autoPlay
                loop
                controls
                src={post?.video?.asset.url}
                className=" w-full h-full"
              />
            </div>
          </div>

          {/* right */}
          <div className="relative bg-white flex flex-col w-full max-w-3xl mx-auto pt-2 lg:pt-0 lg:w-[500px] h-auto lg:h-screen border-t lg:border-l dark:border-t-darkBorder lg:dark:border-l-darkBorder">
            <div className="mt-5">
              <Link href={`/profile/${post.postedBy._id}`}>
                <div className="flex gap-4 mb-4 w-full pl-10 cursor-pointer">
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
                // @ts-ignore
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
