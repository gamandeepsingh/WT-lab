import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { generateOTPEmail } from "../utils/mailTemplate.js";

const generateOTP = () => {
  return otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};

export const signup = async (req, res, next) => {
  const { username, email, password, name, phoneNo } = req.body;

  

  if (phoneNo) {
    const existingUser = await User.findOne({ phoneNo });
    if (existingUser) {
      return res.json({
        statusCode: 400,
        success: false,
        message: "User with same Phone Number already  exists",
      });
    }
  }

  const existingUser = await User.findOne({ email });

  if (existingUser ) {
    return res.json({
      statusCode: 400,
      success: false,
      message: "User with same Email already exists",
    });
  }

  const existingUserByUsername=await User.findOne({ username });

  if (existingUserByUsername ) {
    return res.json({
      statusCode: 400,
      success: false,
      message: "Try different username",
    });
  }



  const hashedPass = bcryptjs.hashSync(password, 10);

  const newUser = new User({ name, username, email, password: hashedPass });

  if (phoneNo) {
    newUser.phoneNo = phoneNo;
  }

  try {
    await newUser.save();
    res.status(201).json("User created");
  } catch (e) {
    next(e);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.json({
        statusCode: 401,
        success: false,
        message: "User not Found",
      });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.json({
        statusCode: 401,
        success: false,
        message: "Wrong Password",
      });
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_KEY);

    const { password: pass, ...rest } = validUser._doc;

    // expiration time for the cookie to 365 days from now
    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    res
      .cookie("access_token", token, {
        sameSite: "none",
        secure: true,
        expires: expirationDate, // Set expiration time
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (e) {
    next(e);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
      const { password: pass, ...rest } = user._doc;
      // expiration time for the cookie to 365 days from now
      const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      res
        .cookie("access_token", token, {
          sameSite: "none",
          secure: true,
          expires: expirationDate, // Set expiration time
          httpOnly: true,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.email.toLowerCase() +
          Math.random().toString(36).slice(-4),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY);
      const { password: pass, ...rest } = newUser._doc;

      const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      res
        .cookie("access_token", token, {
          sameSite: "none",
          secure: true,
          expires: expirationDate, // Set expiration time
          httpOnly: true,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");

    res.status(200).json("Signed Out");
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      return res.send({ Status: "User not existed" });
    }

    const OTP = generateOTP();

    req.app.locals.OTP = OTP;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${user.email}`,
      subject: "Your OTP Code",
      html: generateOTPEmail(`${req.app.locals.OTP}`),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "Success" });
      }
    });
  });
};

export const verifyOTP = async (req, res) => {
  const { code } = req.query; // Retrieve OTP code from request body
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // Reset the OTP value
    return res.status(201).send({ msg: "Verify Successfully!", status: true });
  }
  return res.status(400).send({ error: "Invalid OTP", status: false });
};

export const updatePassword = async (req, res, next) => {
  try {
    const { email } = req.params;
    req.body.password = bcryptjs.hashSync(req.body.password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email: email }, // Finding the user by email
      { $set: { password: req.body.password } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const verifyResponse = async (req, res) => {
  res.json({
    success: true,
    message: "Token is valid.",
    user: req.user,
  });
};

export const resendOTP = async (req, res, next) => {
  const { email } = req.body; // Assuming email is provided in the request body

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ status: "User not found" });
    }

    const OTP = generateOTP();
    req.app.locals.OTP = OTP;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${user.email}`,
      subject: "Your New OTP Code",
      html: generateOTPEmail(OTP),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return next(error);
      } else {
        return res.status(200).json({ status: "OTP sent successfully" });
      }
    });
  } catch (error) {
    next(error);
  }
};