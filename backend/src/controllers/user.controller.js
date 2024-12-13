import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return next(errorHandler(404, "Users not found!"));
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return next(errorHandler(404, "Users not found!"));
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { phoneNo, email,username } = req.body;
    const id = new mongoose.Types.ObjectId(req.params.id);
    if (phoneNo) {
      const existingUser = await User.findOne({ phoneNo });
      if (existingUser && !existingUser._id.equals(id)) {
        return res.json({
          statusCode: 400,
          success: false,
          message: "User with same Phone already  exists",
        });
      }
    }

    const existingUser = await User.findOne({ email });
 

    if (existingUser && !existingUser._id.equals(id)) {
      return res.json({
        statusCode: 400,
        success: false,
        message: "User with same email already exists",
      });
    }

    const existingUserByUsername=await User.findOne({ username });

    if (existingUserByUsername && !existingUserByUsername._id.equals(id) ) {
      return res.json({
        statusCode: 400,
        success: false,
        message: "Try different username",
      });
    }

    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          resume: req.body.resume,
          userRole: req.body.userRole,
          Interests: req.body.Interests,
          phoneNo: req.body.phoneNo,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const uploadFile = async (req, res) => {
  try {
    // Convert buffer to data URI
    const dataUri = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "EventManager",
      resource_type: "auto", // Specify resource type as auto to allow all file formats
    });

    const fileUrl = result.url;

    res.send(fileUrl);
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    res.status(500).send("Error uploading file");
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    // Extract the public ID from the file URL
    const parts = fileUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    const publicIdParts = parts.slice(uploadIndex + 1);
    let publicId = publicIdParts
      .slice(publicIdParts.indexOf("EventManager"))
      .join("/");

    // Remove file extension from publicId
    const fileName = path.basename(publicId);
    const fileNameWithoutExtension = path.parse(fileName).name;
    publicId = publicId.replace(fileName, fileNameWithoutExtension);

    // Delete the file from Cloudinary
    const result = await cloudinary.uploader
      .destroy(publicId)
      .catch((error) => {
        console.error(
          "Error deleting file asynchronously from Cloudinary:",
          error
        );
        throw error; // Rethrow the error to be caught by the outer catch block
      });

    if (result.result === "ok") {
      res.json({ success: true, message: "File deleted successfully" });
    } else {
      console.error("Error deleting file from Cloudinary:", result);
      res.status(500).json({ success: false, error: "Unable to delete file" });
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    res.status(500).json({ success: false, error: "Unable to delete file" });
  }
};

export const addToWishList = async (req, res, next) => {
  try {
    const { eventId } = req.body; // Extract eventId from request body
    const userId = req.params.id; // Extract userId from request parameters

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the eventId is already in the wishlist
    if (user.wishList.includes(eventId)) {
      return res.status(400).json({ message: "Event already in wishlist" });
    }

    // Add the eventId to the wishlist
    user.wishList.push(eventId);

    // Save the updated user
    await user.save();
    const { password, ...rest } = user._doc;

    return res
      .status(200)
      .json({ message: "Event added to wishlist successfully", rest });
  } catch (error) {
    next(error);
  }
};

export const deleteFromWishList = async (req, res, next) => {
  try {
    const { eventId } = req.body; // Extract eventId from request body
    const userId = req.params.id; // Extract userId from request parameters

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the eventId is in the wishlist
    const eventIndex = user.wishList.indexOf(eventId);
    if (eventIndex === -1) {
      return res.status(400).json({ message: "Event not found in wishlist" });
    }

    // Remove the eventId from the wishlist
    user.wishList.splice(eventIndex, 1);

    // Save the updated user
    await user.save();
    const { password, ...rest } = user._doc;

    return res
      .status(200)
      .json({ message: "Event removed from wishlist successfully", rest });
  } catch (error) {
    next(error);
  }
};

export const clearWishList = async (req, res, next) => {
  try {
    const userId = req.params.id; // Extract userId from request parameters

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear the user's wishlist
    user.wishList = [];

    // Save the updated user
    await user.save();
    const { password, ...rest } = user._doc;

    return res
      .status(200)
      .json({ message: "Wishlist cleared successfully", rest });
  } catch (error) {
    next(error);
  }
};
