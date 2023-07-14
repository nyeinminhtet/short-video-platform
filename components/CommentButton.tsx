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
  const { allUsers } = useAuthStore();

  return (
    <div
      id="comment"
      className=" flex flex-col w-full max-w-3xl mx-auto pt-2 lg:pt-0 lg:w-[500px] h-auto lg:h-screen border-t lg:border-l  lg:border-l-gray-300"
    >
      <div>
        <div className=" flex-1 max-h-[300px] lg:max-h-[400px] p-4 lg:p-6 overflow-hidden overflow-y-auto">
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
        </div>

        <div className="w-full  p-4 lg:px-6 py-10 border-t ">
          <form
            className="w-full -mt-5 flex items-center"
            onSubmit={addComment}
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Add comment`}
              className=" flex-1 min-w-0 bg-gray-200 dark:bg-darkSecondary border-none outline-none p-2 pl-4 rounded-lg caret-primary"
            />
            <button
              className=" py-2 pl-3 disabled:text-gray-400 dark:disabled:text-gray-600 text-primary font-semibold disabled:cursor-not-allowed"
              onClick={addComment}
            >
              {isPostingComment ? "Commenting..." : "Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentButton;
