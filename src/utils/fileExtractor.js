import fs from "fs";
import path from "path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { parseOffice } from "officeparser";
import mammoth from "mammoth";
import * as xlsx from "xlsx";

export const extractDataFromFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = file.path;

  if (ext === ".pdf") {
    const data = new Uint8Array(fs.readFileSync(filePath));

    const pdf = await getDocument({ data }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      text += content.items.map((item) => item.str).join(" ") + "\n";
    }

    return {
      type: "text",
      content: text,
    };
  }

  if (ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });

    return {
      type: "text",
      content: result.value,
    };
  }

  if (ext === ".pptx") {
    const result = await parseOffice(filePath);
    console.log(result);

    return {
      type: "text",
      content: result.toText(),
    };
  }

  if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    const text = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName]);

    return {
      type: "text",
      content: text,
    };
  }

  if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".webp") {
    const base64Data = fs.readFileSync(filePath).toString("base64");

    return {
      type: "image",
      mimeType: file.mimetype,
      content: base64Data,
    };
  }

  throw new Error("Format file tidak didukung!");
};
