import express from "express";
import {
  addToWishList,
  clearWishList,
  deleteFromWishList,
  deleteImage,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  uploadFile,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { upload } from "../middleware/multerConfig.js";

const router = express.Router();

router.get("/get-users", getUsers);
router.get("/get-user/:email", getUser);
router.post("/update/:id", updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.post("/upload", upload.single("file"), uploadFile);
router.delete("/deleteFile", deleteImage);
router.post("/add-wishlist/:id", addToWishList);
router.delete("/delete-wishlist/:id", deleteFromWishList);
router.delete("/empty-wishlist/:id", clearWishList);



export default router;
