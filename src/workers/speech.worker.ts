import { env, pipeline } from "@huggingface/transformers";

env.allowLocalModels = false;
// WASM works in embedded browsers and on devices without WebGPU/SAB.
env.backends.onnx.wasm!.numThreads = 1;
env.backends.onnx.wasm!.proxy = false;

self.onmessage = async ({ data }: MessageEvent<{ audio: Float32Array }>) => {
  try {
    self.postMessage({ status: "progress", message: "처음 한 번, 음성 인식 모델을 내려받아요. 이후에는 저장된 모델을 사용해요." });
    const transcriber = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny", {
      device: "wasm", dtype: "q8",
      progress_callback: event => {
        if (event.status === "progress") self.postMessage({ status: "progress", message: `음성 인식 모델을 준비하고 있어요. ${Math.round(event.progress)}%` });
      },
    });
    self.postMessage({ status: "progress", message: "녹음한 말을 기기 안에서 글로 바꾸고 있어요." });
    const result = await transcriber(data.audio, { language: "korean", task: "transcribe", chunk_length_s: 30, stride_length_s: 5, return_timestamps: false });
    self.postMessage({ status: "complete", text: Array.isArray(result) ? result.map(part => part.text).join(" ") : result.text });
    await transcriber.dispose();
  } catch {
    // Never include recordings or transcripts in errors/logs.
    self.postMessage({ status: "error" });
  }
};
