import { test, expect, type Page } from "@playwright/test";
import { arrangeSentences, validateGrouping } from "../src/lib/brief";
const story = "계단을 내려갈 때 왼쪽 무릎이 불편해요. 지난주부터 시작됐고 어제는 더 뻐근했어요. 어떤 움직임을 피하면 좋을까요?";
async function textInput(page: Page) {
  await page.goto("/create/");
  await page.getByRole("button", { name:"진료한장 만들기", exact:true }).click();
  await page.getByRole("button", { name:"글로 입력", exact:true }).click();
}
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { delete (Navigator.prototype as { gpu?: unknown }).gpu; });
});
test("original sentences are preserved and invalid AI output rejected", () => {
  const result = arrangeSentences(story);
  expect(result.main).toContain("왼쪽 무릎"); expect(result.changes).toContain("지난주"); expect(result.questions).toContain("피하면");
  expect(() => validateGrouping(["A", "B"], { main:[0], changes:[], questions:[] })).toThrow();
  expect(() => validateGrouping(["A"], { main:[0], changes:[0], questions:[] })).toThrow();
  expect(() => validateGrouping(["A"], { main:[5], changes:[], questions:[] })).toThrow();
});
test("landing CTA, input, edits, read mode, PDF and exit retain the user's data", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("link", { name:"진료한장 만들어보기" }).click();
  await expect(page).toHaveURL(/\/create\//);
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "start");
  await expect(page.locator(".bf-header .bf-logo")).toHaveJSProperty("naturalWidth", 340);
  await page.screenshot({ path:"test-results/start.png", fullPage:true });
  await page.getByRole("button", { name:"진료한장 만들기", exact:true }).click();
  const mic = page.locator(".bf-mic img");
  await expect(mic).toHaveJSProperty("naturalWidth", 58);
  expect(await mic.boundingBox()).toMatchObject({ width:58, height:58 });
  await page.screenshot({ path:"test-results/voice.png", fullPage:true });
  await page.getByRole("button", { name:"글로 입력", exact:true }).click();
  await expect(page.getByRole("button", { name:"내용 정리하기" })).toBeDisabled();
  await page.getByLabel("전하고 싶은 이야기").fill(story);
  await page.screenshot({ path:"test-results/text.png", fullPage:true });
  await page.getByRole("button", { name:"내용 정리하기" }).click();
  await expect(page.getByRole("heading", { name:"정리된 내용을 확인해 주세요" })).toBeVisible();
  await page.getByLabel("가장 전하고 싶은 내용", { exact:true }).fill("오른쪽 무릎이 불편해요. 약은 아침에 먹어요.");
  await page.getByText("받아쓴 글 보기").click();
  await expect(page.locator(".bf-transcript p")).toHaveText(story);
  await page.getByText("받아쓴 글 보기").click();
  await page.screenshot({ path:"test-results/review.png", fullPage:true });
  await page.getByRole("button", { name:"확인하고 완료" }).click();
  await expect(page.locator("main .bf-report")).toContainText("오른쪽 무릎");
  await expect(page.locator("main .bf-report")).not.toContainText("가상 예시");
  await page.screenshot({ path:"test-results/complete.png", fullPage:true });
  await page.getByRole("button", { name:"의료진에게 크게 보여주기" }).click();
  await page.screenshot({ path:"test-results/read.png", fullPage:true });
  await page.emulateMedia({ media:"print" });
  await expect(page.locator(".bf-print")).toBeVisible();
  await expect(page.locator(".bf-print")).toContainText("오른쪽 무릎");
  await page.pdf({ path:"test-results/report.pdf", preferCSSPageSize:true, printBackground:true });
  await page.emulateMedia({ media:"screen" });
  await page.evaluate(() => { window.print = () => { throw new Error("test print unavailable"); }; });
  await page.getByRole("button", { name:"PDF 저장하기", exact:true }).click();
  await expect(page.getByRole("heading", { name:"PDF를 저장하지 못했어요" })).toBeVisible();
  await page.screenshot({ path:"test-results/pdf-error.png", fullPage:true });
  await page.getByRole("button", { name:"크게 보기", exact:true }).click();
  await page.getByRole("button", { name:"완료 화면으로 돌아가기" }).click();
  await page.getByRole("button", { name:"나가기", exact:true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path:"test-results/exit.png", fullPage:true });
  await page.keyboard.press("Escape"); await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByRole("button", { name:"나가기", exact:true }).click();
  await page.getByRole("button", { name:"저장하지 않고 나가기" }).click();
  await expect(page).toHaveURL("http://127.0.0.1:3000/");
  expect(errors).toEqual([]);
});
test("unsupported microphone recovers to manual writing without losing input", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, "SpeechRecognition", { value:undefined }); Object.defineProperty(window, "webkitSpeechRecognition", { value:undefined }); });
  await page.goto("/create/"); await page.getByRole("button", { name:"진료한장 만들기", exact:true }).click();
  await page.getByRole("button", { name:"녹음 시작" }).click();
  await expect(page.getByRole("heading", { name:"말을 글로 바꾸지 못했어요" })).toBeVisible();
  await page.screenshot({ path:"test-results/speech-error.png", fullPage:true });
  await page.getByRole("button", { name:"글로 입력하기", exact:true }).click();
  await page.getByLabel("전하고 싶은 이야기").fill(story);
  await page.getByRole("button", { name:"자동 정리 없이 직접 작성하기" }).click();
  await expect(page.getByLabel("가장 전하고 싶은 내용", { exact:true })).toContainText("왼쪽 무릎");
  await page.screenshot({ path:"test-results/manual.png", fullPage:true });
  await page.getByRole("button", { name:"확인하고 완료" }).click();
  await expect(page.locator("main .bf-report")).toContainText("어제");
});
test("recording uses actual recognition events and finishes after five minutes", async ({ page }) => {
  await page.addInitScript(() => {
    class Speech {
      onstart?: () => void; onresult?: (e: unknown) => void; onend?: () => void;
      start() { this.onstart?.(); this.onresult?.({ results:[{ isFinal:true, 0:{ transcript:"무릎이 불편해요." } }] }); }
      stop() { this.onend?.(); } abort() {}
    }
    Object.defineProperty(window, "SpeechRecognition", { value:Speech });
  });
  await page.goto("/create/"); await page.getByRole("button", { name:"진료한장 만들기", exact:true }).click();
  await page.clock.install();
  await page.getByRole("button", { name:"녹음 시작" }).click();
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "recording");
  await page.clock.fastForward(42_000);
  await expect(page.getByLabel("녹음 시간")).toHaveText("00:42");
  await page.screenshot({ path:"test-results/recording.png", fullPage:true });
  await page.getByRole("button", { name:"진료한장 홈으로 나가기" }).click();
  await page.getByRole("button", { name:"계속 작성하기" }).click();
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "recording");
  await page.clock.fastForward(259_000);
  await expect(page.getByRole("heading", { name:"정리된 내용을 확인해 주세요" })).toBeVisible();
  await expect(page.getByLabel("가장 전하고 싶은 내용", { exact:true })).toHaveValue("무릎이 불편해요.");
});
test("processing timeout preserves source for retry or manual recovery", async ({ page }) => {
  // Hold the model import request to simulate an unavailable download.
  await textInput(page);
  await page.route("**/_next/static/chunks/**", async route => {
    if (route.request().resourceType() === "script") await new Promise(r => setTimeout(r, 15000));
    await route.continue();
  });
  await page.evaluate(() => Object.defineProperty(navigator, "gpu", { value:{}, configurable:true }));
  await page.getByLabel("전하고 싶은 이야기").fill(story);
  await page.clock.install();
  await page.getByRole("button", { name:"내용 정리하기" }).click();
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "processing");
  await page.screenshot({ path:"test-results/processing.png", fullPage:true });
  await page.clock.fastForward(91_000);
  await expect(page.getByRole("heading", { name:"내용을 정리하지 못했어요" })).toBeVisible();
  await page.screenshot({ path:"test-results/organize-error.png", fullPage:true });
  await page.getByRole("button", { name:"직접 작성하기", exact:true }).click();
  await expect(page.getByLabel("가장 전하고 싶은 내용", { exact:true })).toHaveValue(/왼쪽 무릎/);
});
test("mobile, desktop, English landing and back navigation render without overflow", async ({ page }) => {
  await textInput(page); await page.getByLabel("전하고 싶은 이야기").fill("증상을 적었어요.");
  await page.goBack(); await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "voice");
  await page.getByRole("button", { name:"글로 입력", exact:true }).click();
  await expect(page.getByLabel("전하고 싶은 이야기")).toHaveValue("증상을 적었어요.");
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({ width, height:900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.screenshot({ path:"test-results/desktop.png", fullPage:true });
  page.on("dialog", d => d.accept());
  await page.goto("/en/"); await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("leaving a pending organization does not overwrite manual edits later", async ({ page }) => {
  await textInput(page);
  await page.route("**/_next/static/chunks/**", async route => {
    if (route.request().resourceType() === "script") await new Promise(r => setTimeout(r, 15000));
    await route.continue();
  });
  await page.evaluate(() => Object.defineProperty(navigator, "gpu", { value:{}, configurable:true }));
  await page.getByLabel("전하고 싶은 이야기").fill(story);
  await page.clock.install();
  await page.getByRole("button", { name:"내용 정리하기" }).click();
  await page.getByRole("button", { name:"기다리지 않고 직접 작성하기" }).click();
  await page.getByLabel("가장 전하고 싶은 내용", { exact:true }).fill("직접 고친 내용입니다.");
  await page.clock.fastForward(91_000);
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "manual");
  await expect(page.getByLabel("가장 전하고 싶은 내용", { exact:true })).toHaveValue("직접 고친 내용입니다.");
});
