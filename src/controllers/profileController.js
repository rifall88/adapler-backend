import {
  updateProfile,
  findUserProfile,
  findUserAllProfile,
} from "../models/profileModel.js";
import { formatDateForFE } from "../utils/dateFormatter.js";
import path from "path";
import fs from "fs";

export const putProfile = async (req, res) => {
  try {
    const {
      full_name,
      birth_date,
      bio,
      jenjang_pendidikan,
      jurusan,
      target_akademik,
      jam_belajar_harian,
    } = req.body;

    const userId = req.user.id;
    const user = await findUserProfile(userId);

    const data = Object.fromEntries(
      Object.entries({
        full_name,
        birth_date,
        bio,
        jenjang_pendidikan,
        jurusan,
        target_akademik,
        jam_belajar_harian,
      }).filter(([_, value]) => {
        return typeof value === "string"
          ? value.trim() !== ""
          : value !== undefined;
      }),
    );

    if (data.birth_date) {
      const parsedDate = new Date(data.birth_date);

      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid birth_date format",
        });
      }

      const today = new Date();
      let age = today.getFullYear() - parsedDate.getFullYear();
      const monthDiff = today.getMonth() - parsedDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < parsedDate.getDate())
      ) {
        age--;
      }

      if (age < 13) {
        return res.status(400).json({
          status: "failed",
          message: "You must be at least 13 years old to use this application",
        });
      }

      if (age > 80) {
        return res.status(400).json({
          status: "failed",
          message: "Age cannot exceed 80 years. Please check your birth date",
        });
      }

      data.birth_date = parsedDate;
    }

    if (req.file) {
      if (user.profile_image) {
        const oldImagePath = path.join(process.cwd(), user.profile_image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      data.profile_image = `uploads/${req.file.filename}`;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "No valid data to update",
      });
    }

    const updatedProfile = await updateProfile(data, userId);

    if (!updatedProfile) {
      return res.status(404).json({
        status: "failed",
        message: "Profile not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Updating profile error:", error.message);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await findUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        id: user.id,
        fullname: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        birthDate: user.birth_date,
        bio: user.bio,
        profileImage: user.profile_image,
        jenjangPendidikan: user.jenjang_pendidikan,
        jurusan: user.jurusan,
        targetAkademik: user.target_akademik,
        jamBelajarHarian: user.jam_belajar_harian,
      },
    });
  } catch (error) {
    console.error("Getting user error: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const getPhotoProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await findUserProfile(userId);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    const imagePath = user.profile_image;

    if (!imagePath) {
      return res.status(404).json({
        status: "failed",
        message: "User does not have a profile photo",
      });
    }

    const filePath = path.join(process.cwd(), imagePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: "failed",
        message: "Photo file is missing from the server",
      });
    }

    return res.status(200).sendFile(filePath, {
      headers: {
        "Content-Disposition": `inline; filename="${path.basename(filePath)}"`,
      },
    });
  } catch (error) {
    console.error("Getting photo profile error:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const user = await findUserAllProfile();
    const formattedData = (user || []).map((userItem) => {
      const { created_at, ...sisaData } = userItem;
      return {
        ...sisaData,
        joined_date: formatDateForFE(created_at),
      };
    });
    return res.status(200).json({
      status: "success",
      data: {
        users: formattedData || [],
      },
    });
  } catch (error) {
    console.error("Getting application error", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
