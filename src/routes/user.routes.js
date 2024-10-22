import { Router } from "express";
import {registerUser} from  '../controllers/user.controller.js';
import {upload} from  '../middlewares/multer.middleware.js';


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


export default router;