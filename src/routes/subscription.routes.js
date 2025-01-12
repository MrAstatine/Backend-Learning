import {Router} from 'express';
import {
    toggleSubscription,
    getSubscribedChannel,
    getUserChannelSubscribers
} from "../controllers/subscription.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route('/c/:channelId').post(toggleSubscription);
router.route('/c/:channelId/subscribers').get(getUserChannelSubscribers);
router.route('/c/:channelId/subscribed-channels').get(getSubscribedChannel);

export default router;