import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import Image from "next/image";
import { VscVerified, VscVerifiedFilled } from "react-icons/vsc";
import useAuthStore from "@/store/authStore";
import NoResult from "./NoResult";
import { IUser } from "@/types";

interface Comment {
  comment: string;
  length?: number;
  _key: string;
  postedBy: { _ref: string; _id: string };
}

interface Props {
  isPostingComment: boolean;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  addComment: (e: React.FormEvent) => void;
  comments: Comment[];
}

const CommentButton = ({
  comment,
  setComment,
  addComment,
  comments,
  isPostingComment,
}: Props) => {
  const { userProfile, allUsers } = useAuthStore();

  return (
    <div className=" border-t-2 border-gray-200 pt-4 px-10 bg-[#F8F8F8] border-b-2 lg:pb:-0 pb-[100px]">
      <div className=" overflow-scroll lg:h-[220px] w-[70vh]">
        {comments?.length ? (
          comments.map((comment, index) => (
            <>
              {allUsers.map(
                (user: IUser) =>
                  user._id ===
                    (comment.postedBy._id || comment.postedBy._ref) && (
                    <div key={index} className=" p-2 items-center">
                      <Link href={`/profile/${user._id}`}>
                        <div className="flex gap-3 items-start">
                          <div className=" w-8 h-8">
                            <Image
                              width={34}
                              height={34}
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
                          </div>
                        </div>
                      </Link>

                      <div className=" mt-2 bg-primary w-fit py-3 px-3 rounded-md">
                        <p>{comment.comment}</p>
                      </div>
                    </div>
                  )
              )}
            </>
          ))
        ) : (
          <NoResult text="No comments yet" />
        )}

        {userProfile && (
          <div className=" absolute right-0 bottom-0 left-0 pb-6 px-2 md:px-10">
            <form className="flex gap-4" onSubmit={addComment}>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Add comment as ${userProfile.userName}`}
                className=" bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg"
              />
              <button
                className=" text-md text-gray-400 bg-gray-200 px-4 py-0 hover:bg-white hover:font-bold hover:text-black rounded-md"
                onClick={addComment}
              >
                {isPostingComment ? "Commenting..." : "Comment"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentButton;
