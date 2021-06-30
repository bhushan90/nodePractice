const express = require('express');
const {
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/userController');

const {
  signUp,
  login,
  forgotPassword,
  setPassword,
} = require('../controllers/authController');
const { protectRoute, restrictTo } = require('../utils/services/authService');

const router = express.Router();
router.post('/login', login);
router.post('/signup', signUp);
router.post('/forgot-password', forgotPassword);
router.post('/set-password/:token', setPassword);
router.patch('/updateMe', protectRoute, updateMe);
router.delete('/deleteMe', protectRoute, deleteMe);

router
  .route('/')
  .get(protectRoute, restrictTo('admin'), getAllUsers)
  .post(createUser);
router.route('/:id').get(protectRoute, getUserById).delete(deleteUser);

module.exports = router;
