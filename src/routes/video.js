import { Router } from "express";
import awsActions from "../aws";
import asyncRoute from "../helpers";
const router = Router();
const { getAllVideos, getVideo, generateUploadParams, addVideo } = awsActions;

const getVideosRoute = async (req, res) => {
  console.log("Received GET /videos");

  const videos = await getAllVideos();

  if (videos) {
    res.send(videos);
  } else {
    res.status(500);
    res.send("The server encountered an error.");
  }
};

const getVideoRoute = async (req, res) => {
  console.log("Received GET /videos/" + req.params.id);
  const video = await getVideo(req.params.id);
  if (video) {
    res.send(video);
  } else {
    res.status(500);
    res.send("The server encountered an error.");
  }
};

const startUploadRoute = (req, res) => {
  console.log("Received POST /videos/new");
  const uploadParams = generateUploadParams(req.body.filename);

  if (uploadParams.error) {
    res.status(500).json(uploadParams);
  } else {
    res.status(200).json(uploadParams);
  }
};

const addToVideosTableRoute = async (req, res) => {
  console.log("Received POST /videos/");
  const { id, filename } = req.body;
  const videoData = await addVideo(id, filename);
  console.log(videoData);
  if (videoData.error) {
    res
      .status(500)
      .json({ msg: "The server encountered an error!", err: videoData.error });
  } else {
    // const videoData = videoData.data;
    // console.log("parsed videoData data", videoData);

    res.status(200).json(videoData);
  }
};

router.get("/", asyncRoute(getVideosRoute));
router.get("/:id", asyncRoute(getVideoRoute));
router.post("/new", startUploadRoute);
router.post("/", asyncRoute(addToVideosTableRoute));

export default router;
