import {Router} from 'express';
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from '../controllers/playlist.controller.js';
import {verifyJWT} from '../middleware/auth.middleware.js';

const router=Router();

router.use(verifyJWT);

router.route('/').post(createPlaylist);
router.route('/user/:userId').get(getUserPlaylists);
router.route('/:playlistId').get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist);
router.route('/:playlistId/videos').post(addVideoToPlaylist);
router.route('/:playlistId/videos/:videoId').delete(removeVideoFromPlaylist);

export default router;