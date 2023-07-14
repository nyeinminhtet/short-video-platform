import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { MdFavorite } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";

interface Props {
  handleDislike: () => void;
  handleLike: () => void;
  likes: any[];
}

const LikeButton = ({ handleDislike, handleLike, likes }: Props) => {
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const { userProfile }: any = useAuthStore();
  const filterLike = likes?.filter((item) => item._ref === userProfile?._id);

  useEffect(() => {
    if (filterLike?.length > 0) {
      setAlreadyLiked(true);
    } else {
      setAlreadyLiked(false);
    }
  }, [filterLike]);

  return (
    <div className=" flex gap-6">
      <div className=" mt-2 flex flex-col justify-center items-center cursor-pointer">
        {alreadyLiked ? (
          <div className=" p-2 bg-gray-300 rounded-full w-full mb-2 h-full md:p-3 text-red-500">
            <MdFavorite
              //className=" text-3xl md:text-4xl"
              onClick={handleDislike}
              size={25}
            />
          </div>
        ) : (
          <div className=" text-red-500 p-2 md:p-3 bg-gray-300 rounded-full w-full h-full mb-2">
            <AiOutlineHeart
              //  className=" text-3xl md:text-4xl"
              onClick={handleLike}
              size={25}
            />
          </div>
        )}

        <p className=" text-lg -mt-3 font-semibold text-red-500">
          {likes?.length || 0}
        </p>
      </div>
    </div>
  );
};

export default LikeButton;
