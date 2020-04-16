import { Router } from "express";
// import awsActions from "../aws";
import asyncRoute from "../helpers";
import getAllVideos from "../aws/getAllVideos";
import getVideoVersions from "../aws/getVideoVersions";
import generateUploadParams from "../aws/generateUploadParams";
import addVideoToTable from "../aws/addVideoToTable";
import startVersionJob from "../aws/startVersionJob";
import deleteVideo from "../aws/deleteVideo";

const router = Router();
// const {
//   getAllVideos,
//   getVideoVersions,
//   generateUploadParams,
//   addVideoToTable,
//   startVersionJob,
//   deleteVideo,
// } = awsActions;

const getVideosRoute = async (req, res) => {
  console.log("In getVideosRoute GET /videos");

  const videos = await getAllVideos();

  if (videos) {
    res.send(videos);
  } else {
    res.status(500);
    res.send("The server encountered an error.");
  }
};

const getVideoVersionsRoute = async (req, res) => {
  console.log("In getVideoVersionRoute GET /videos/" + req.params.id);
  const video = await getVideoVersions(req.params.id);
  if (video) {
    res.send(video);
  } else {
    res.status(500);
    res.send("The server encountered an error.");
  }
};

const startUploadRoute = (req, res) => {
  console.log("In startUploadRoute POST /videos/new");
  const uploadParams = generateUploadParams(req.body.filename);

  if (uploadParams.error) {
    res.status(500).json(uploadParams);
  } else {
    res.status(200).json(uploadParams);
  }
};

const addToVideosTableRoute = async (req, res) => {
  console.log("In addToVideosTableRoute POST /videos/");
  const { id, filename } = req.body;
  const videoData = await addVideoToTable(id, filename);
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

const createVersionRoute = async (req, res, next) => {
  console.log("In createVersionRoute POST /videos/:id/new");
  const { id, filename, resolution } = req.body;
  console.log("received", id, filename, resolution);
  await startVersionJob(id, filename, resolution)
    .then((data) => {
      console.log("Lambda invoked");
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
};

const deleteVideoRoute = async (req, res, next) => {
  console.log("In deleteVideoRoute POST /videos/:id/new");
  const videoId = req.params.id;
  await deleteVideo(videoId)
    .then((_) => {
      console.log("Video delete completed");
      res.status(200).send();
    })
    .catch((err) => next(err));
};

router.get("/", asyncRoute(getVideosRoute));
router.get("/:id", asyncRoute(getVideoVersionsRoute));
router.post("/new", startUploadRoute);
router.post("/", asyncRoute(addToVideosTableRoute));
router.post("/:id/new", asyncRoute(createVersionRoute));
router.delete("/:id", asyncRoute(deleteVideoRoute));
export default router;
