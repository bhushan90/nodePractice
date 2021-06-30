const express = require('express');
const {
  getAllSongs,
  createSong,
  getSongById,
  deleteSong,
  stat,
} = require('../controllers/songController');

const { protectRoute } = require('../utils/services/authService');
const router = express.Router();  

router.route('/stat').get(stat);
router.route('/').get(protectRoute, getAllSongs).post(createSong);
router.route('/:id').get(getSongById).delete(deleteSong);

module.exports = router;
