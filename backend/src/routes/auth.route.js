import express from "express";
import { signup, signin,google ,signOut, forgotPassword, verifyOTP, updatePassword, verifyResponse, resendOTP} from "../controllers/auth.controller.js";
import { localVariables } from "../middleware/auth.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get('/signout', signOut);
router.post('/forgot-password', localVariables,forgotPassword);
router.get('/verifyOTP', verifyOTP);
router.post('/updatePassword/:email', updatePassword);
router.get('/check-token', verifyToken,verifyResponse);
router.post('/resend-otp', localVariables, resendOTP);  

export default router;