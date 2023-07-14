import { useState } from "react";
import { IUser } from "../types";
import axios from "axios";
import { config } from "@/config/config";

export interface ObjProps {
  userId: string;
  creatorId: string;
  follow: boolean;
}

export default function useFollow() {
  const [loadingFollow, setLoadingFollow] = useState(false);

  async function handleFollow(obj: ObjProps) {
    setLoadingFollow(true);

    const { data: updatedUsers }: { data: IUser[] } = await axios.put(
      `${config.baseUrl}/api/users`,
      obj
    );

    setLoadingFollow(false);

    return updatedUsers;
  }

  return { loadingFollow, handleFollow };
}
