import { Router } from "express";
// import awsActions from "../aws";
import asyncRoute from "../helpers";
import deleteVersion from "../aws/deleteVersion";

const router = Router();
// const { deleteVersion } = awsActions;

const deleteVersionRoute = async (req, res, next) => {
  const versionId = req.params.id;
  await deleteVersion(versionId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

router.delete("/:id", asyncRoute(deleteVersionRoute));

export default router;
