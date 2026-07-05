import {
  createMaterial,
  findMaterial,
  findMaterialById,
  deleteMaterial,
} from "../models/materialModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateMaterialSummaryWithAI } from "../services/aiService.js";
import { extractDataFromFile } from "../utils/fileExtractor.js";
import { formatJudulMateri } from "../utils/fileNameFormat.js";
import { formatDateForFE } from "../utils/dateFormatter.js";
import fs from "fs";
import path from "path";

export const processNewMaterial = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ status: "failed", message: "File is required" });
    }

    const filePath = file.path;

    let fileData;
    try {
      fileData = await extractDataFromFile(file);
    } catch (err) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ status: "failed", message: err.message });
    }

    if (
      fileData.type === "text" &&
      (!fileData.content || fileData.content.trim() === "")
    ) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        status: "failed",
        message: "Document is blank or unreadable",
      });
    }

    const aiSummary = await generateMaterialSummaryWithAI(fileData);

    const materialData = await createMaterial({
      id: uuidv4(),
      user_id: userId,
      nama_file: `uploads/${file.filename}`,
      ringkasan: aiSummary.ringkasan,
      poin_penting: aiSummary.poin_penting,
      kata_kunci: aiSummary.kata_kunci,
    });

    fs.unlinkSync(filePath);

    res.status(201).json({
      status: "success",
      message: "Material processed successfully",
      data: {
        id: materialData.id,
        user_id: userId,
        nama_file: materialData.nama_file,
        ringkasan: materialData.ringkasan,
        poin_penting: materialData.poin_penting,
        kata_kunci: materialData.kata_kunci,
      },
    });
  } catch (error) {
    console.error("Process Material Error:", error.message);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const getMaterialUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const materials = await findMaterial(userId);

    const formattedData = (materials || []).map((materialItem) => {
      const { nama_file, created_at, ...sisaData } = materialItem;
      return {
        ...sisaData,
        judul: formatJudulMateri(nama_file),
        uploaded: formatDateForFE(created_at),
      };
    });

    return res.status(200).json({
      status: "success",
      data: {
        materials: formattedData || [],
      },
    });
  } catch (error) {
    console.error("Getting material error: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const getDetailMaterial = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const material = await findMaterialById(id, userId);

    if (!material) {
      return res
        .status(404)
        .json({ status: "failed", message: "Material not found" });
    }

    return res.status(200).json({
      status: "success",
      data: {
        id,
        user_id: userId,
        judul: formatJudulMateri(material.nama_file),
        uploaded: formatDateForFE(material.created_at),
        ringkasan: material.ringkasan,
        poin_penting: material.poin_penting,
        kata_kunci: material.kata_kunci,
      },
    });
  } catch (error) {
    console.error("Getting material error: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};

export const deleteMaterialById = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const deletedMaterial = await deleteMaterial(id, userId);

    if (!deletedMaterial) {
      return res
        .status(404)
        .json({ status: "failed", message: "Material not found" });
    }

    return res.status(200).json({
      status: "success",
      message: "Material deletion successful",
    });
  } catch (error) {
    console.error("Error while deleting material: ", error.message);
    res.status(500).json({
      status: "failed",
      message: "Internal server error",
    });
  }
};
