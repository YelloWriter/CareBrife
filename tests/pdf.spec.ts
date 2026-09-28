import { test, expect } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { renderReportPdf } from "../src/lib/report-pdf";

test("Korean PDF uses A4 pages and continues long content without truncating the final section", async ({}, testInfo) => {
  const bytes = await renderReportPdf({
    main: Array.from({ length:70 }, (_, i) => `${i + 1}번 기록: 한글 줄바꿈과 긴 내용을 확인하는 가상 테스트입니다. 약 2.5mg, 혈압 120/80, A&B <확인>.`).join("\n"),
    changes: "변화 항목의 마지막 문장입니다.",
    questions: "질문 항목의 마지막 문장입니다. 끝까지 보존되어야 해요.",
  }, "2026. 9. 28.", {
    font: readFileSync("public/fonts/NotoSansKR-Regular.ttf"), logo: readFileSync("public/figma/logo.png"),
  });
  const document = await PDFDocument.load(bytes);
  expect(document.getPageCount()).toBeGreaterThan(2);
  for (const page of document.getPages()) {
    expect(page.getWidth()).toBeCloseTo(595.28); expect(page.getHeight()).toBeCloseTo(841.89);
  }
  writeFileSync(testInfo.outputPath("long-report.pdf"), bytes);
});

test("PDF can be retried after asset failure, opened, and downloaded from the exit dialog", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto("/create/");
  await page.getByRole("button", { name:"진료한장 만들기", exact:true }).click();
  await page.getByRole("button", { name:"글로 입력", exact:true }).click();
  await page.getByLabel("전하고 싶은 이야기").fill("파일 다운로드를 확인하는 테스트 문장입니다.");
  await page.getByRole("button", { name:"자동 정리 없이 직접 작성하기" }).click();
  await page.getByRole("button", { name:"확인하고 완료" }).click();
  await page.route("**/fonts/NotoSansKR-Regular.ttf", route => route.fulfill({ status:503, body:"Unavailable" }));
  await page.getByRole("button", { name:"PDF 저장하기", exact:true }).click();
  await expect(page.getByRole("heading", { name:"PDF를 저장하지 못했어요" })).toBeVisible();
  await page.unroute("**/fonts/NotoSansKR-Regular.ttf");
  const first = page.waitForEvent("download");
  await page.getByRole("button", { name:"PDF 다시 저장" }).click();
  const file = await first; expect(await file.failure()).toBeNull();
  const data = readFileSync((await file.path())!);
  expect(data.subarray(0,5).toString()).toBe("%PDF-");
  expect((await PDFDocument.load(data)).getPageCount()).toBe(1);
  await file.saveAs("test-results/pdf-retry.pdf");
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "complete");
  await expect(page.getByRole("link", { name:"PDF 열기", exact:true })).toHaveAttribute("href", /^blob:/);
  const second = page.waitForEvent("download");
  await page.getByRole("link", { name:"PDF 파일 다시 받기" }).click();
  expect(await (await second).failure()).toBeNull();
  await page.getByRole("button", { name:"내용 수정하기" }).click();
  await page.getByLabel("가장 전하고 싶은 내용", { exact:true }).fill("수정한 내용도 PDF에 반영합니다.");
  await page.getByRole("button", { name:"확인하고 완료" }).click();
  await expect(page.getByRole("link", { name:"PDF 파일 다시 받기" })).toHaveCount(0);
  await page.getByRole("button", { name:"나가기", exact:true }).click();
  const final = page.waitForEvent("download");
  await page.getByRole("dialog").getByRole("button", { name:"PDF 저장하기", exact:true }).click();
  await (await final).saveAs("test-results/pdf-after-edit.pdf");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("link", { name:"PDF 파일 다시 받기" })).toBeVisible();
  await page.locator(".bf-app").screenshot({ path:"test-results/pdf-download-mobile.png" });
  for (const width of [320,1440]) {
    await page.setViewportSize({ width, height:900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test("discarding during PDF preparation cancels download and releases the pending report", async ({ page }) => {
  await page.goto("/create/");
  await page.getByRole("button", { name:"진료한장 만들기", exact:true }).click();
  await page.getByRole("button", { name:"글로 입력", exact:true }).click();
  await page.getByLabel("전하고 싶은 이야기").fill("취소 동작을 확인합니다.");
  await page.getByRole("button", { name:"자동 정리 없이 직접 작성하기" }).click();
  await page.getByRole("button", { name:"확인하고 완료" }).click();
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/fonts/NotoSansKR-Regular.ttf", async route => { await pending; await route.continue().catch(() => {}); });
  const downloads: unknown[] = []; page.on("download", value => downloads.push(value));
  await page.getByRole("button", { name:"PDF 저장하기", exact:true }).click();
  await expect(page.getByRole("button", { name:"PDF 만드는 중…", exact:true }).first()).toBeDisabled();
  await page.getByRole("button", { name:"나가기", exact:true }).click();
  await page.getByRole("button", { name:"저장하지 않고 나가기" }).click();
  release();
  await expect(page).toHaveURL(/\/$/);
  expect(downloads).toEqual([]);
});
