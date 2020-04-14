import { Router } from "express";
import actions from "../aws";
import asyncRoute from "../helpers";
const router = Router();
const { getAllVideos, getVideo, generateUploadParams } = actions;

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
  console.log("Req body: " + Object.toString(req.body));
  const uploadParams = generateUploadParams(req.body.filename);

  if (uploadParams.error) {
    res.status(500).json(uploadParams);
  } else {
    res.status(200).json(uploadParams);
  }
};

router.get("/", asyncRoute(getVideosRoute));
router.get("/:id", asyncRoute(getVideoRoute));
router.post("/new", startUploadRoute);

export default router;
