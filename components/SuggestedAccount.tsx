import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { VscVerifiedFilled } from "react-icons/vsc";
import useAuthStore from "@/store/authStore";
import { IUser } from "@/types";

const SuggestedAccount = () => {
  const { fetchAllUsers, allUsers } = useAuthStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div className=" xl:border-b-2 border-gray-300 pb-4">
      <p className=" font-semibold text-gray-500 m-3 mt-2 hidden xl:block">
        Suggested Accounts
      </p>

      <div>
        {allUsers.slice(0, 6).map((user: IUser, index) => (
          <Link key={index} href={`/profile/${user._id}`}>
            <div className="flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded">
              <div className=" w-8 h-8">
                <Image
                  width={34}
                  height={34}
                  src={user.image}
                  alt="user profile"
                  className=" rounded-full"
                />
              </div>

              <div className=" hidden xl:block">
                <p className=" flex gap-1 items-center text-md font-bold text-primary lowercase">
                  {user.userName.replaceAll(" ", "")}{" "}
                  <VscVerifiedFilled className=" text-blue-400" />
                </p>
                <p className=" capitalize text-gray-400 text-sm">
                  {user.userName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedAccount;
