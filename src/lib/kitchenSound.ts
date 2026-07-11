/** Soft kitchen chime — Web Audio, no asset file needed */
export function playNewOrderChime(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return

    const ctx = new AudioCtx()
    const now = ctx.currentTime

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + duration + 0.02)
    }

    playTone(880, now, 0.12)
    playTone(1174.66, now + 0.14, 0.16)

    window.setTimeout(() => {
      void ctx.close()
    }, 500)
  } catch {
    // Audio blocked or unsupported — silent fail for demo
  }
}
