import Router from 'express';
import {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
} from '../controllers/tweet.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/').post(createTweet);
router.route('/:userId').get(getUserTweet);
router.route('/:tweetId/update').patch(updateTweet);
router.route('/:tweetId/delete').delete(deleteTweet);

export default router;