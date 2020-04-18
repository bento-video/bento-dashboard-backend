import { Router } from "express";
import asyncRoute from "../helpers";
import deleteVersion from "../aws/deleteVersion";
import getVersion from "../aws/getVersion";

const router = Router();

const deleteVersionRoute = async (req, res, next) => {
  const versionId = req.params.id;
  await deleteVersion(versionId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

const getVersionRoute = async (req, res, next) => {
  const versionId = req.params.id;
  await getVersion(versionId)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

router.get("/:id", asyncRoute(getVersionRoute));
router.delete("/:id", asyncRoute(deleteVersionRoute));

export default router;
