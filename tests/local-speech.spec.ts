import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

async function setup(page: Page, options: { audio?: string; deny?: boolean; pending?: boolean; silence?: boolean } = {}) {
  await page.addInitScript(({ audio, deny, pending, silence }) => {
    class Speech {
      onerror?: (event: { error: string }) => void;
      start() { this.onerror?.({ error: "network" }); }
      abort() {}
    }
    Object.defineProperty(window, "SpeechRecognition", { value: Speech });
    Object.defineProperty(navigator, "mediaDevices", { value: { getUserMedia: async () => {
      if (deny) throw new DOMException("Permission denied", "NotAllowedError");
      document.body.dataset.micActive = "true";
      if (audio) {
        // Exercise the real MediaRecorder/codec with synthetic speech, never the user's mic.
        const context = new AudioContext();
        const source = context.createBufferSource();
        const bytes = Uint8Array.from(atob(audio), char => char.charCodeAt(0));
        source.buffer = await context.decodeAudioData(bytes.buffer);
        const destination = context.createMediaStreamDestination();
        source.connect(destination); await context.resume();
        source.onended = () => { document.body.dataset.syntheticAudioEnded = "true"; };
        source.start();
        const track = destination.stream.getAudioTracks()[0];
        const originalStop = track.stop.bind(track);
        let released = false;
        track.stop = () => { if (released) return; released = true; originalStop(); void context.close(); document.body.dataset.micActive = "false"; };
        return destination.stream;
      }
      return { getTracks: () => [{ stop() { document.body.dataset.micActive = "false"; } }] };
    } } });
    class Recorder {
      state = "inactive"; mimeType = "audio/wav";
      ondataavailable?: (event: { data: Blob }) => void; onstop?: () => void;
      start() { this.state = "recording"; }
      stop() {
        this.state = "inactive";
        queueMicrotask(() => {
          let bytes: Uint8Array;
          if (audio) bytes = Uint8Array.from(atob(audio), char => char.charCodeAt(0));
          else {
            const buffer = new ArrayBuffer(44 + 32000); const view = new DataView(buffer);
            const label = (offset: number, text: string) => [...text].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
            label(0,"RIFF"); view.setUint32(4,buffer.byteLength-8,true); label(8,"WAVEfmt "); view.setUint32(16,16,true);
            view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,16000,true); view.setUint32(28,32000,true);
            view.setUint16(32,2,true); view.setUint16(34,16,true); label(36,"data"); view.setUint32(40,32000,true);
            for(let i=0;i<16000;i++) view.setInt16(44+i*2,silence ? 0 : Math.sin(i/20)*3000,true);
            bytes = new Uint8Array(buffer);
          }
          this.ondataavailable?.({ data: new Blob([bytes as BlobPart], { type:this.mimeType }) }); this.onstop?.();
        });
      }
    }
    if (!audio) {
      Object.defineProperty(window, "MediaRecorder", { value: Recorder });
      class SpeechWorker {
        onmessage?: (event: { data: unknown }) => void;
        postMessage() {
          document.body.dataset.workerStarted = "true";
          if (!pending) setTimeout(() => this.onmessage?.({ data:{ status:"complete", text:"기기 안에서 받아쓴 테스트 문장입니다." } }), 100);
        }
        terminate() { document.body.dataset.workerStopped = "true"; }
      }
      Object.defineProperty(window, "Worker", { value:SpeechWorker });
    }
  }, options);
  await page.goto("/create/");
  await page.getByRole("button", { name:"진료한장 만들기", exact:true }).click();
  await page.getByRole("button", { name:"녹음 시작", exact:true }).click();
}

test("native network error switches to local recording, stops the mic, and completes a report", async ({ page }) => {
  await setup(page);
  await expect(page.getByText("기기 내 녹음으로 시작했어요.", { exact:false })).toBeVisible();
  await expect(page.locator("body")).toHaveAttribute("data-mic-active", "true");
  await page.getByRole("button", { name:"녹음 마치기" }).click();
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "review");
  await expect(page.locator("body")).toHaveAttribute("data-mic-active", "false");
  await expect(page.locator("body")).toHaveAttribute("data-worker-stopped", "true");
  await expect(page.getByLabel("가장 전하고 싶은 내용", { exact:true })).toHaveValue("기기 안에서 받아쓴 테스트 문장입니다.");
  await page.getByRole("button", { name:"확인하고 완료" }).click();
  await expect(page.locator(".bf-main .bf-report")).toContainText("기기 안에서 받아쓴 테스트 문장입니다.");
});

test("local microphone permission denial still opens permission help", async ({ page }) => {
  await setup(page, { deny:true });
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "speech-error");
  await expect(page.getByText("마이크 권한이 허용되지 않았어요.", { exact:false })).toBeVisible();
  await page.getByRole("button", { name:"권한 설정 확인하기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("cancelling local transcription terminates the worker and allows manual editing", async ({ page }) => {
  await setup(page, { pending:true });
  await page.getByRole("button", { name:"녹음 마치기" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-worker-started", "true");
  await page.getByRole("button", { name:"기다리지 않고 직접 작성하기" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-worker-stopped", "true");
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "manual");
});

test("silent recordings do not create invented text", async ({ page }) => {
  await setup(page, { silence:true });
  await page.getByRole("button", { name:"녹음 마치기" }).click();
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "speech-error");
  await expect(page.getByText("녹음에서 인식할 말을 찾지 못했어요.", { exact:false })).toBeVisible();
  await expect(page.locator("body")).not.toHaveAttribute("data-worker-started", "true");
});

test("real Korean audio is transcribed by the actual browser WASM worker", async ({ page }) => {
  test.skip(!process.env.LOCAL_ASR_FIXTURE, "Requires a synthetic Korean WAV fixture and model download.");
  test.setTimeout(240_000);
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  const uploads: string[] = []; page.on("request", request => { if (request.method() === "POST") uploads.push(request.url()); });
  await setup(page, { audio:readFileSync(process.env.LOCAL_ASR_FIXTURE!).toString("base64") });
  await expect(page.locator("body")).toHaveAttribute("data-synthetic-audio-ended", "true", { timeout:20_000 });
  await page.getByRole("button", { name:"녹음 마치기" }).click();
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", /review|speech-error/, { timeout:190_000 });
  await expect(page.locator(".bf-app")).toHaveAttribute("data-screen", "review");
  await page.getByText("받아쓴 글 보기").click();
  await expect(page.locator(".bf-transcript p")).toContainText("테스트");
  await expect(page.locator("body")).toHaveAttribute("data-mic-active", "false");
  await page.locator(".bf-app").screenshot({ path:"test-results/real-local-speech.png" });
  expect(errors).toEqual([]); expect(uploads).toEqual([]);
});
