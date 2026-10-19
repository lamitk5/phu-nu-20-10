/**
 * Entry: icons, petals, music unlock
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  if (typeof window.initPetalEngine === 'function') {
    window.initPetalEngine();
  }

  const musicToggleBtn = document.getElementById('musicToggleBtn');
  musicToggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    window.audioManager?.toggle();
  });

  const unlockAudio = () => {
    window.audioManager?.initAudioContext();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });

  setTimeout(() => {
    if (window.lucide) lucide.createIcons();
  }, 300);
});
