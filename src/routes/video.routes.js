import {verifyJWT} from "../middleware/auth.middleware.js";
import {upload} from "..middleware/multer.middleware.js";
import Router from "express";
import {
    getAllVideos,
    getVideoById,
    publishAVideo,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "..controllers/video.constroller.js";

const router = Router();

router.use(verifyJWT); //use authorization for all routes in this router

router.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },{
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishAVideo
)
router.route("/:videoId").get(getVideoById).delete(deleteVideo).patch(upload.single("thumbnail"), updateVideo);
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;