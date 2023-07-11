import { MouseEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { config } from "@/config/config";
import { Video } from "@/types";
import VideoCard from "@/components/VideoCard";
import NoResult from "@/components/NoResult";

interface Props {
  videos: Video[];
}

let initialRender = true;

export default function Home({ videos }: Props) {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos?.map((video: Video, i) => (
          <VideoCard post={video} isShowingOnHome key={i} />
        ))
      ) : (
        <NoResult text="NO Videos" />
      )}
    </div>
  );
}

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = await axios.get(`${config.apiUrl}/api/post`);

  if (topic) {
    response = await axios.get(`${config.apiUrl}/api/discover/${topic}`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};
