import axios from "axios";
import { config } from "@/config/config";
import { Video } from "@/types";
import VideoCard from "@/components/VideoCard";
import NoResult from "@/components/NoResult";

interface Props {
  videos: Video[];
}

const Home = ({ videos }: Props) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video, i) => <VideoCard post={video} key={i} />)
      ) : (
        <NoResult text="NO Videos" />
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = null;
  if (topic) {
    response = await axios.get(`${config.apiUrl}/api/discover/${topic}`);
  } else {
    response = await axios.get(`${config.apiUrl}/api/post`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Home;
