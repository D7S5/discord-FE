import { useEffect, useRef, useState } from "react";

/**
 * @param {MediaStream} stream - getUserMedia 로 얻은 stream
 * @param {Object} options
 * @param {number} options.threshold - 음성 감지 임계값
 * @param {number} options.interval - 체크 주기(ms)
 */
export function useSpeakingDetector(
  stream,
  { threshold = 0.05, interval = 100 } = {}
) {
  const [speaking, setSpeaking] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    let lastSpeaking = false;

    const detect = () => {
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) / 128;
        sum += v * v;
      }

      const volume = Math.sqrt(sum / bufferLength);

      const isSpeaking = volume > threshold;

      if (isSpeaking !== lastSpeaking) {
        setSpeaking(isSpeaking);
        lastSpeaking = isSpeaking;
      }

      rafRef.current = setTimeout(detect, interval);
    };

    detect();

    return () => {
      clearTimeout(rafRef.current);
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [stream, threshold, interval]);

  return speaking;
}
