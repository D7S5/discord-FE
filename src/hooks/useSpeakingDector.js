export function createSpeakingDetector(stream, onChange) {
  const audioCtx = new AudioContext();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();

  analyser.fftSize = 512;
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  let speaking = false;
  const THRESHOLD = 20;

  const loop = () => {
    analyser.getByteFrequencyData(data);
    const volume =
      data.reduce((a, b) => a + b, 0) / data.length;

    if (volume > THRESHOLD && !speaking) {
      speaking = true;
      onChange(true);
    }

    if (volume <= THRESHOLD && speaking) {
      speaking = false;
      onChange(false);
    }

    requestAnimationFrame(loop);
  };

  loop();
}
