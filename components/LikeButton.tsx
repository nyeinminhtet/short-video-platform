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
          <div className=" p-2 md:p-4 text-red-500">
            <MdFavorite
              className=" text-3xl md:text-4xl"
              onClick={handleDislike}
            />
          </div>
        ) : (
          <div className=" text-white p-2 md:p-4">
            <AiOutlineHeart
              className=" text-3xl md:text-4xl"
              onClick={handleLike}
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
