import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { Brief } from "./brief";

export class UnsupportedPdfTextError extends Error {
  name = "UnsupportedPdfTextError";
}

export async function renderReportPdf(brief: Brief, writtenDate: string, assets: { font: Uint8Array; logo: Uint8Array }): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  // Embed the complete static font: fontkit subsetting drops composite Korean
  // glyphs in this font even when text extraction appears correct.
  const font = await document.embedFont(assets.font, { subset: false });
  const logo = await document.embedPng(assets.logo);
  const supported = new Set(font.getCharacterSet());
  // Fail explicitly instead of silently dropping a character from a medical account.
  if ([...Object.values(brief).join("")].some(char => !/\s/.test(char) && !supported.has(char.codePointAt(0)!))) {
    throw new UnsupportedPdfTextError("Unsupported characters");
  }
  document.setTitle("진료한장 - 진료 전 준비한 이야기");
  document.setAuthor("진료한장");
  document.setSubject("사용자가 확인한 진료 준비 내용");
  document.setLanguage("ko-KR");
  const width = 595.28, height = 841.89, margin = 44;
  const body = rgb(0.2, 0.267, 0.369), blue = rgb(0.325, 0.427, 0.714);
  const muted = rgb(0.4, 0.45, 0.52), pale = rgb(0.94, 0.955, 0.982);
  let page = document.addPage([width, height]);
  let y = 0;
  function header() {
    page.drawImage(logo, { x: margin, y: height - 83, width: 140, height: 41.18 });
    const date = `작성일: ${writtenDate}`;
    page.drawText(date, { x: width - margin - font.widthOfTextAtSize(date, 9), y: height - 62, size: 9, font, color: muted });
    page.drawLine({ start: { x: margin, y: height - 98 }, end: { x: width - margin, y: height - 98 }, thickness: 0.7, color: rgb(0.82, 0.86, 0.93) });
    page.drawText("진료 전 준비한 이야기", { x: margin, y: height - 131, size: 20, font, color: body });
    page.drawText("입력하고 확인한 내용을 의료진과 함께 살펴보세요.", { x: margin, y: height - 152, size: 10, font, color: muted });
    y = height - 178;
  }
  function sectionTitle(title: string) {
    page.drawRectangle({ x: margin, y: y - 25, width: width - margin * 2, height: 28, color: pale });
    page.drawText(title, { x: margin + 12, y: y - 16, size: 12, font, color: blue });
    y -= 48;
  }
  function lines(text: string) {
    const result: string[] = [];
    for (const paragraph of text.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").normalize("NFC").split("\n")) {
      let current = "";
      for (const char of paragraph) {
        if (current && font.widthOfTextAtSize(current + char, 12) > width - margin * 2 - 24) {
          result.push(current); current = "";
        }
        current += char;
      }
      result.push(current);
    }
    return result;
  }
  header();
  const sections: [keyof Brief, string][] = [["main", "오늘 가장 이야기하고 싶은 내용"], ["changes", "그동안의 변화"], ["questions", "진료 중 물어볼 질문"]];
  for (const [key, title] of sections) {
    if (y < 140) { page = document.addPage([width, height]); header(); }
    sectionTitle(title);
    for (const line of lines(brief[key].trim() || "입력한 내용이 없어요.")) {
      if (y < 80) { page = document.addPage([width, height]); header(); sectionTitle(`${title} · 계속`); }
      if (line) page.drawText(line, { x: margin + 12, y, size: 12, font, color: brief[key].trim() ? body : muted });
      y -= 21;
    }
    y -= 27;
  }
  document.getPages().forEach((sheet, index, pages) => {
    sheet.drawLine({ start: { x: margin, y: 61 }, end: { x: width - margin, y: 61 }, thickness: 0.5, color: rgb(0.82, 0.86, 0.93) });
    sheet.drawText("진료 전 정보 정리용 · 진단이나 처방이 아닙니다.", { x: margin, y: 42, size: 9, font, color: muted });
    const number = `${index + 1} / ${pages.length}`;
    sheet.drawText(number, { x: width - margin - font.widthOfTextAtSize(number, 9), y: 42, size: 9, font, color: muted });
  });
  return document.save();
}

export async function createReportPdf(brief: Brief, writtenDate: string, signal: AbortSignal): Promise<Blob> {
  const [font, logo] = await Promise.all(["/fonts/NotoSansKR-Regular.ttf", "/figma/logo.png"].map(async path => {
    const response = await fetch(path, { signal });
    if (!response.ok) throw new Error("PDF asset unavailable");
    return new Uint8Array(await response.arrayBuffer());
  }));
  signal.throwIfAborted();
  const bytes = await renderReportPdf(brief, writtenDate, { font, logo });
  signal.throwIfAborted();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
