import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      default: null,
      index: false 
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://cdn.shopify.com/s/files/1/0870/1689/8874/files/reshot-icon-user-profile-68ZR2F7VPJ.svg?v=1721495086",
    },
    userRole: {
      type: String,
      default: "normalUser",
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    Interests: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
