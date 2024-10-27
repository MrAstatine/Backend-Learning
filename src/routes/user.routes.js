import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken
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

export default router;