import { RiUserFollowLine } from "react-icons/ri";
import { BsPersonPlus } from "react-icons/bs";

interface Props {
  isCreator: boolean;
  isAlreadyFollow: boolean;
  followHandler(): Promise<void>;
  loadingFollow: boolean;
  userId?: string;
}

export default function ShowFollowOrDelete({
  isAlreadyFollow,
  followHandler,
  loadingFollow,
  userId,
}: Props) {
  return (
    <>
      {isAlreadyFollow ? (
        <div>
          <button onClick={followHandler} disabled={loadingFollow}>
            <p className="pt-1 hidden md:block text-sm px-2 h-8 rounded text-red-600 font-semibold border-2 border-red-600">
              Following
            </p>
            <p>
              <RiUserFollowLine size={20} className=" md:hidden block" />
            </p>
          </button>
        </div>
      ) : (
        <div>
          <button disabled={loadingFollow} onClick={followHandler}>
            <p className="px-2 pt-1 hidden md:block h-8 transition-all rounded font-semibold text-sm text-primary border border-primary hover:bg-primary hover:text-black">
              Follow
            </p>
            <p>
              <BsPersonPlus size={20} className=" md:hidden block" />
            </p>
          </button>
        </div>
      )}
    </>
  );
}
