import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from  '../controllers/user.controller.js';
import {upload} from  '../middlewares/multer.middleware.js';
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router=Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",//name assigned to that file.frontend should also have field name same
            maxCount: 1 //tells how many files to accept
        },{
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);
    router.route("/login").post(loginUser)

    //secured routes
    router.route("/logout").post(verifyJWT, logoutUser);
    router.route("/refresh-token").post(refreshAccessToken);
    router.route("/change-password").post(verifyJWT,changeCurrentPassword);
    router.route("/current-user").get(verifyJWT,getCurrentUser);
    router.route("/update-account").patch(verifyJWT,updateAccountDetail);
    router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar);
    router.route("/cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage);
    router.route("/c/:username").get(verifyJwT,getUserChannelProfile);
    router.route("/history").get(verifyJwT,getWatchHistory); 
export default router;