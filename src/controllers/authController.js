import {
  findEmailOrUsername,
  findUserByEmail,
  createOauthUser,
} from "../models/userModel.js";
import { createProfile } from "../models/profileModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { OAuth2Client } from "google-auth-library";
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await findEmailOrUsername(identifier);
    if (!user) {
      return res
        .status(401)
        .json({ status: "failed", message: "Wrong email or username" });
    }

    if (!user.password) {
      return res
        .status(500)
        .json({ status: "failed", message: "User does not have a password" });
    }

    if (!user.is_verified) {
      return res.status(403).json({
        status: "failed",
        message:
          "Your account has not been verified, please verify the OTP first",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        status: "failed",
        message:
          "Your account has been suspended by the Admin. Please contact support.",
      });
    }

    const pwIsTrue = await bcrypt.compare(password, user.password);
    if (!pwIsTrue) {
      return res
        .status(401)
        .json({ status: "failed", message: "Wrong password" });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "3h" },
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Login error: ", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await findUserByEmail(email);

    if (!user) {
      const userUuid = uuidv4();
      const generatedUsername =
        email.split("@")[0] + Math.floor(100 + Math.random() * 900);

      user = await createOauthUser({
        id: userUuid,
        username: generatedUsername,
        email: email,
        provider: "google",
        provider_id: payload.sub,
      });

      await createProfile({
        id: uuidv4(),
        user_id: userUuid,
        full_name: name,
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        status: "failed",
        message:
          "Your account has been suspended by the Admin. Please contact support.",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "3h" },
    );

    res.status(200).json({
      status: "success",
      message: "Login success",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Google OAuth error: ", error);
    res
      .status(401)
      .json({ status: "failed", message: "Google authentication failed" });
  }
};
