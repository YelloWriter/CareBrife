export type AudioCapture = { stop(): void };

// Audio stays in memory and is released on stop/cancel; nothing is uploaded.
export async function recordLocally(signal: AbortSignal, complete: (audio: Blob) => void, failed: () => void): Promise<AudioCapture> {
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") throw new Error("unsupported");
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
  const release = () => stream.getTracks().forEach(track => track.stop());
  if (signal.aborted) { release(); signal.throwIfAborted(); }
  let recorder: MediaRecorder;
  try { recorder = new MediaRecorder(stream); } catch (error) { release(); throw error; }
  let chunks: Blob[] = [];
  let finished = false;
  const cancel = () => {
    recorder.ondataavailable = null; recorder.onstop = null; recorder.onerror = null;
    if (recorder.state !== "inactive") recorder.stop();
    chunks = []; release(); signal.removeEventListener("abort", cancel);
  };
  const stop = () => {
    if (finished) return;
    finished = true;
    if (recorder.state !== "inactive") recorder.stop();
    release();
  };
  recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
  recorder.onstop = () => {
    signal.removeEventListener("abort", cancel); release();
    if (!signal.aborted) complete(new Blob(chunks, { type: recorder.mimeType }));
    chunks = [];
  };
  recorder.onerror = () => { cancel(); if (!signal.aborted) failed(); };
  signal.addEventListener("abort", cancel, { once: true });
  try { recorder.start(1000); } catch (error) { cancel(); throw error; }
  return { stop };
}

export async function transcribeLocally(blob: Blob, progress: (status: string) => void, signal: AbortSignal): Promise<string> {
  signal.throwIfAborted();
  progress("녹음한 말을 기기 안에서 준비하고 있어요.");
  const decoder = new OfflineAudioContext(1, 1, 16000);
  const decoded = await decoder.decodeAudioData(await blob.arrayBuffer());
  signal.throwIfAborted();
  const audio = new Float32Array(decoded.length);
  for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
    const samples = decoded.getChannelData(channel);
    for (let i = 0; i < audio.length; i++) audio[i] += samples[i] / decoded.numberOfChannels;
  }
  // Avoid hallucinated text for empty/silent recordings.
  const energy = audio.reduce((sum, sample) => sum + sample * sample, 0) / Math.max(audio.length, 1);
  if (audio.length < 1600 || energy < 0.000001) throw new Error("no-speech");
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("../workers/speech.worker.ts", import.meta.url));
    const clean = () => { clearTimeout(timeout); signal.removeEventListener("abort", abort); worker.terminate(); };
    const abort = () => { clean(); reject(signal.reason); };
    const timeout = setTimeout(() => { clean(); reject(new Error("timeout")); }, 180_000);
    signal.addEventListener("abort", abort, { once: true });
    worker.onmessage = ({ data }: MessageEvent<{ status: string; text?: string; message?: string }>) => {
      if (data.status === "progress") progress(data.message || "녹음한 말을 글로 바꾸고 있어요.");
      else if (data.status === "complete") { clean(); resolve(data.text?.trim() || ""); }
      else if (data.status === "error") { clean(); reject(new Error("transcription-failed")); }
    };
    worker.onerror = event => { event.preventDefault(); clean(); reject(new Error("transcription-failed")); };
    worker.postMessage({ audio }, [audio.buffer]);
  });
}
