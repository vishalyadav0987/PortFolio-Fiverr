const express = require('express');
const { registerUser, verifyEmail, loginUser, logoutUser, forgetPassword, authorizedUser, fetchingToken, getAllUser, resetPassword } = require('../controllers/authUserController');
const { authUser } = require('../middleware/authMiddleware');
const router = express.Router();


router.route('/sign-up').post(registerUser);
router.route('/verify-email').post(verifyEmail);
router.route('/sign-in').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/forget-password').post(forgetPassword);
router.route('/reset-password/:resetToken').post(resetPassword);
router.route('/check-auth-user').get(authUser,authorizedUser);
router.get("/check-token", authUser,fetchingToken);
router.get('/get-all-user',getAllUser)

module.exports = router;

