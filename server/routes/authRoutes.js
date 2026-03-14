const express = require('express');
const {
  signup,
  login,
  adminLogin,
  changePassword,
} = require('../controllers/authController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/password', protect, requireAdmin, changePassword);
module.exports = router;
