export const formatJudulMateri = (rawString) => {
  let bersih = rawString.replace(/^uploads\/\d+-/, "");
  bersih = bersih.replace(/\.[^/.]+$/, "");
  return bersih;
};
