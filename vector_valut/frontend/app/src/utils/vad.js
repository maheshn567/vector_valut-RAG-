/**
 * VoiceActivityDetector: Client-side decibel-based Voice Activity Detection.
 * Automatically runs start/stop triggers by analyzing AudioNode buffers.
 */
export class VoiceActivityDetector {
  constructor(stream, { onSpeechStart, onSpeechEnd, silenceTimeout = 1000, threshold = -50 }) {
    this.stream = stream;
    this.onSpeechStart = onSpeechStart;
    this.onSpeechEnd = onSpeechEnd;
    this.silenceTimeout = silenceTimeout;
    this.threshold = threshold; // in decibels (dB)

    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.isSpeaking = false;
    this.silenceTimer = null;
    this.running = false;
  }

  start() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Float32Array(bufferLength);
      this.running = true;

      const checkVolume = () => {
        if (!this.running) return;

        this.analyser.getFloatTimeDomainData(dataArray);
        
        // Root Mean Square (RMS) calculation
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        const db = 20 * Math.log10(rms || 1e-5);

        if (db > this.threshold) {
          // Speech detected
          if (!this.isSpeaking) {
            this.isSpeaking = true;
            if (this.onSpeechStart) this.onSpeechStart();
          }
          if (this.silenceTimer) {
            clearTimeout(this.silenceTimer);
            this.silenceTimer = null;
          }
        } else {
          // Silence detected
          if (this.isSpeaking && !this.silenceTimer) {
            this.silenceTimer = setTimeout(() => {
              this.isSpeaking = false;
              this.silenceTimer = null;
              if (this.onSpeechEnd) this.onSpeechEnd();
            }, this.silenceTimeout);
          }
        }

        if (this.running) {
          requestAnimationFrame(checkVolume);
        }
      };

      checkVolume();
    } catch (err) {
      console.error("VAD initialization failed:", err);
    }
  }

  stop() {
    this.running = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.source) {
      this.source.disconnect();
    }
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}
