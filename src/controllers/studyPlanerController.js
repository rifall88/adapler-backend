import {
  createStudyPlanner,
  findStudyPlanner,
  deleteStudyPlanner,
} from "../models/studyPlanerModel.js";
import { findUserProfile } from "../models/profileModel.js";
import { findTaskNotFinishByUser } from "../models/taskModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateJadwalWithAI } from "../services/aiService.js";

export const generateStudyPlanner = async (req, res) => {
  try {
    const { startTime } = req.body;
    const userId = req.user.id;

    const profile = await findUserProfile(userId);
    const isProfileComplete =
      profile &&
      profile.jenjang_pendidikan &&
      profile.jurusan &&
      profile.target_akademik &&
      profile.jam_belajar_harian;

    if (!isProfileComplete) {
      return res.status(403).json({
        status: "failed",
        message: "Please complete your profile first",
      });
    }

    const tasks = await findTaskNotFinishByUser(userId);

    if (tasks.length === 0) {
      return res.status(400).json({
        status: "failed",
        message: "Must have at least one unfinished task",
      });
    }

    const aiJadwal = await generateJadwalWithAI(tasks, profile, startTime);

    const plannerData = await createStudyPlanner({
      id: uuidv4(),
      user_id: userId,
      tanggal: new Date(),
      detail_jadwal: aiJadwal,
    });

    res.status(201).json({
      status: "success",
      message: "Schedule successfully created by AI",
      plannerData,
    });
  } catch (error) {
    console.error("Generate Planner Error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const getStudyPlannerByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const studyPlanner = await findStudyPlanner(userId);
    return res.status(200).json({
      status: "success",
      data: {
        studyPlanner: studyPlanner || [],
      },
    });
  } catch (error) {
    console.error("Getting study planner error: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const deleteStudyPlannerById = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const deletedStudyPlanner = await deleteStudyPlanner(id, userId);

    if (!deletedStudyPlanner) {
      return res
        .status(404)
        .json({ status: "failed", message: "Study Planner not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Study Planner deletion successful",
    });
  } catch (error) {
    console.error("Error while deleting study planner: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
