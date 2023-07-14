import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";

import useAuthStore from "@/store/authStore";
import { client } from "@/utils/client";
import { SanityAssetDocument } from "@sanity/client";
import { topics } from "@/utils/constants";
import { config } from "@/config/config";
import { ImCancelCircle } from "react-icons/im";
import Layout from "@/components/Layout";
import Head from "next/head";

const Upload = () => {
  const [isloading, setIsLoading] = useState(false);
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >();
  const [wrongFileType, setWrongFileType] = useState(false);
  const [caption, setCaption] = useState("");
  const [topic, setTopic] = useState(topics[0].name);
  const [savingPost, setSavingPost] = useState(false);

  const router = useRouter();

  const { userProfile }: { userProfile: any } = useAuthStore();

  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];
    setIsLoading(true);

    if (fileTypes.includes(selectedFile.type)) {
      setWrongFileType(false);

      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setVideoAsset(data);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setWrongFileType(true);
    }
  };

  const handlePost = async () => {
    if (caption && videoAsset?._id && topic) {
      setSavingPost(true);

      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic,
      };

      await axios.post(`${config.baseUrl}/api/post`, document);

      router.push("/");
    }
  };
  const handleDiscard = () => {
    setSavingPost(false);
    setVideoAsset(undefined);
    setCaption("");
    setTopic("");
  };

  return (
    <Layout>
      <Head>
        <title>Upload | Tik Tok</title>
        <meta
          property="og:url"
          content="https://short-video-platform.vercel.app/upload"
        ></meta>
      </Head>

      {/* <div className="flex w-full border-t-2 h-full absolute left-0 top-0 sm:top-[60px] mb-10 pt-10 lg:pt-20 bg-white justify-center">
        <div
          className=" absolute top-6 left-5 text-2xl"
          onClick={() => router.back()}
        >
          <ImCancelCircle />
        </div>
        <div className=" bg-white rounded-lg xl:h-[80vh] mt-[-5%] justify-center flex gap-6 flex-wrap md:justify-center items-center p-14 pt-6">
          <div className=" text-center">
            <div>
              <p className="text-2xl font-bold">Upload Video</p>
              <p className="text-md text-gray-400 mt-1">
                Post a video to your account
              </p>
            </div>
            <div className=" mt-2 border-dashed rounded-xl border-4 border-gray-200 flex flex-col-reverse justify-center items-center  outline-none w-[260px] h-[458px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
              {isloading ? (
                <p className="text-center text-3xl text-red-400 font-semibold">
                  Uploading...
                </p>
              ) : (
                <div>
                  {!videoAsset ? (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex flex-col justify-center items-center">
                          <p className="font-bold text-xl">
                            <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                          </p>
                          <p className="text-xl font-semibold">
                            Select video to upload
                          </p>
                        </div>

                        <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                          MP4 or WebM or ogg <br />
                          720x1280 resolution or higher <br />
                          Up to 10 minutes <br />
                          Less than 2 GB
                        </p>
                        <p className="bg-[#F51997] text-center mt-8 rounded text-white text-md font-medium p-2 w-52 outline-none">
                          Select file
                        </p>
                      </div>
                      <input
                        type="file"
                        name="upload-video"
                        onChange={(e) => uploadVideo(e)}
                        className="w-0 h-0"
                      />
                    </label>
                  ) : (
                    <div className=" rounded-3xl w-[300px]  p-4 flex flex-col gap-6 justify-center items-center">
                      <video
                        className="rounded-xl h-[462px] mt-16 bg-black"
                        controls
                        loop
                        src={videoAsset.url}
                      />
                      <div className=" flex justify-between gap-20 bg-primary rounded-sm p-1 border-2 border-gray-200">
                        <p className="text-lg">{videoAsset.originalFilename}</p>
                        <button
                          type="button"
                          className=" rounded-full bg-gray-200 text-red-400 p-2 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                          onClick={() => setVideoAsset(undefined)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            {wrongFileType && (
              <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[260px]">
                Please select an video file (mp4 or webm or ogg)
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-[4rem] pb-10">
            <label className="text-md font-medium ">Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2"
            />
            <label className="text-md font-medium ">Choose a topic</label>

            <select
              onChange={(e) => {
                setTopic(e.target.value);
              }}
              className="outline-none lg:w-650 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
            >
              {topics.map((item) => (
                <option
                  key={item.name}
                  className=" outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
            <div className="flex gap-6 mt-10">
              <button
                onClick={handleDiscard}
                type="button"
                className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
              >
                Discard
              </button>
              <button
                disabled={videoAsset?.url ? false : true}
                onClick={handlePost}
                type="button"
                className="bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
              >
                {savingPost ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="w-full h-[calc(100vh-97px) overflow-hidden overflow-y-auto m-auto">
        <div className="border shadow-sm max-w-4xl ml-4 p-4 xs:p-6 rounded-lg mb-10 xs:mb-0 overflow-hidden">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold">Upload video</h2>
            <p className="text-[rgba(22,24,35,0.5)">
              Post a video to your account
            </p>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center">
            {/* left */}
            <label
              htmlFor="video"
              className={`${isloading ? "bg-gray-100" : ""} ${
                videoAsset ? "p-0 bg-black border-none" : "p-4"
              } flex flex-col items-center justify-center w-[260px] h-[458px] rounded-lg border-2 border-dashed border-gray-300 hover:border-primary text-gray-500 cursor-pointer transition-all`}
            >
              {videoAsset ? (
                <video
                  src={videoAsset.url}
                  autoPlay
                  controls
                  loop
                  muted
                  className="video h-full w-full object-center"
                />
              ) : isloading ? (
                <>
                  <div className="border-2 border-l-primary animate-spin w-12 h-12 rounded-full" />
                  <h3 className="mt-4 text-lg animate-pulse tracking-wide">
                    Uploading...
                  </h3>
                </>
              ) : (
                <>
                  <div className="flex justify-center text-gray-300">
                    <FaCloudUploadAlt size={45} />
                  </div>
                  <h3 className="font-semibold text-lg mb-6 text-black ">
                    Select video to upload
                  </h3>
                  <p className="mb-2 text-sm">MP4 or WebM</p>
                  <p className="mb-2 text-sm">720x1280 resolution or higher</p>
                  <p className="mb-2 text-sm">Up to 30 minutes</p>
                  <p className="mb-6 text-sm">Less than 10 MB</p>
                  <p className="btn-primary w-4/5 bg-primary rounded-lg py-2 text-center">
                    Select file
                  </p>
                  <input
                    id="video"
                    type="file"
                    accept="video/mp4, video/webm"
                    className="w-0 h-0"
                    onChange={(e) => uploadVideo(e)}
                  />
                </>
              )}
            </label>

            {/* right */}
            <div className="flex-1 md:pl-8 ml-6 w-full mb-10 md:mb-0">
              <label htmlFor="caption" className="block mb-2 font-semibold">
                Caption
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type="text"
                autoComplete="off"
                id="caption"
                className="block border shadow-md outline-none w-full rounded-lg py-2 px-3 dark:bg-transparent dark:border-darkBorder"
              />

              <p className="mb-2 mt-6 font-semibold">Choose a topic</p>
              <select
                onChange={(e) => {
                  setTopic(e.target.value);
                }}
                className="outline-none shadow-md lg:w-350 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded-lg cursor-pointer"
              >
                {topics.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>

              <div className="mt-12 hidden md:flex items-center justify-center gap-4">
                <button
                  onClick={handleDiscard}
                  disabled={savingPost || (!caption && !videoAsset)}
                  className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none  py-2  disabled:cursor-not-allowed"
                >
                  Discard
                </button>

                <button
                  onClick={handlePost}
                  className="bg-gray-400 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none py-2 disabled:cursor-not-allowed disabled:bg-gray-200  disabled:text-gray-400 "
                  disabled={!caption || !videoAsset || savingPost}
                >
                  {savingPost ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>

          {/* mobile layout */}
          <div className="mt-10 xs:mt-12 flex md:hidden items-center justify-center gap-4">
            <button
              onClick={handleDiscard}
              disabled={savingPost || !caption || !videoAsset}
              className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none py-2 disabled:cursor-not-allowed"
            >
              Discard
            </button>

            <button
              onClick={handlePost}
              className="bg-gray-400 text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none py-2 disabled:cursor-not-allowed disabled:bg-gray-200  disabled:text-gray-400 "
              disabled={!caption || !videoAsset || savingPost}
            >
              {savingPost ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
