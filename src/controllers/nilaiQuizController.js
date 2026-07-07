import { createQuizResult, findQuizResult } from "../models/nilaiQuizModel.js";
import { findQuizByMaterialId } from "../models/quizModel.js";
import { formatJudulMateri } from "../utils/fileNameFormat.js";
import { v4 as uuidv4 } from "uuid";

export const submitKuisDanHitungNilai = async (req, res) => {
  try {
    const userId = req.user.id;
    const { materialId } = req.params;
    const { jawabanUser } = req.body;

    const questions = await findQuizByMaterialId(materialId);

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ status: "failed", message: "Quiz not found" });
    }

    let benar = 0;
    const hasilReview = [];

    questions.forEach((q) => {
      const jawaban = jawabanUser[q.id];
      const isCorrect = jawaban === q.kunci_jawaban;

      if (isCorrect) benar++;

      hasilReview.push({
        id: q.id,
        pertanyaan: q.pertanyaan,
        jawaban_kamu: jawaban,
        kunci_jawaban: q.kunci_jawaban,
        pembahasan: q.pembahasan,
        status: isCorrect ? "Benar" : "Salah",
      });
    });

    const score = (benar / questions.length) * 100;

    const resultData = await createQuizResult({
      id: uuidv4(),
      user_id: userId,
      material_id: materialId,
      score: score,
    });

    return res.status(201).json({
      status: "success",
      message: "Quiz submitted successfully",
      data: {
        score: resultData.score,
        total_benar: benar,
        total_soal: questions.length,
        review: hasilReview,
      },
    });
  } catch (error) {
    console.error("Submit Quiz Error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export const getNilaiKuis = async (req, res) => {
  try {
    const { materialId } = req.params;
    const nilaiQuiz = await findQuizResult(materialId);

    if (!nilaiQuiz) {
      return res.status(404).json({
        status: "failed",
        message: "Quiz score not found for this material",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        id: nilaiQuiz.id,
        materialId,
        judul: formatJudulMateri(nilaiQuiz.nama_file),
        nilai: nilaiQuiz.score,
      },
    });
  } catch (error) {
    console.error("Get quiz score error:", error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
};
