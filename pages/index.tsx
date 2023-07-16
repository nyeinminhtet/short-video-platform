import { MouseEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { config } from "@/config/config";
import { Video } from "@/types";
import NoResult from "@/components/NoResult";
import VideoCard from "@/components/VideoCard";
import Layout from "@/components/Layout";
import Head from "next/head";
import useFollow from "@/hooks/useFollow";

interface Props {
  videos: Video[];
}

const metadata = {
  description:
    "TikTok, also known in China as Douyin, is a short-form video hosting service owned by the Chinese company ByteDance. It hosts user-submitted videos, which can range in duration from 3 seconds to 10 minutes.",
  title: "TikTok - Make Your Day",
};

export default function Home({ videos }: Props) {
  const [allPostedBy, setAllPostedBy] = useState(
    videos.map((video) => video.postedBy)
  );

  const [currentUserId, setCurrentUserId] = useState("");
  const { loadingFollow, handleFollow } = useFollow();

  useEffect(() => {
    setAllPostedBy(videos.map((video) => video.postedBy));
  }, [videos]);

  return (
    <Layout>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta
          property="og:url"
          content="https://short-video-platform.vercel.app/"
        ></meta>
      </Head>
      <div className="flex flex-col gap-10 sm:ml-20 ml-8 videos h-full">
        {videos.length ? (
          videos?.map((video: Video, i) => (
            <VideoCard
              post={video}
              key={i}
              handleFollow={handleFollow}
              setAllPostedBy={setAllPostedBy}
              setCurrentUserId={setCurrentUserId}
              postedBy={allPostedBy[i]}
              loadingFollow={
                loadingFollow && allPostedBy[i]._id === currentUserId
              }
            />
          ))
        ) : (
          <NoResult text="NO Videos" />
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = await axios.get(`${config.baseUrl}/api/post`);

  if (topic) {
    response = await axios.get(`${config.baseUrl}/api/discover/${topic}`);
  }
  return {
    props: {
      videos: response.data,
    },
  };
};
