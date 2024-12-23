import {verifyJWT} from "../middlewares/auth.middleware.js";
import {Router} from "express";
import {getVideoComments,addComment,updateComment,deleteComment} from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT); // middleware to verify JWT token for all routes
router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;