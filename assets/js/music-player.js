(function() {
  const playlist = [
    { title: "ADAMAS (OP1)", artist: "LiSA", src: "music/【刀劍神域Alicization OP1】LiSA「ADAMAS」中日歌詞｜Muse木棉花.mp3" },
    { title: "ANIMA (WoU OP2)", artist: "ReoNa", src: "music/【刀劍神域Alicization War of Underworld OP2】ReoNa「ANIMA」中日歌詞｜Muse木棉花.mp3" }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  const audio = new Audio();

  // Elements
  const playerContainer = document.getElementById('custom-music-player');
  const playBtn = document.getElementById('mp-play');
  const prevBtn = document.getElementById('mp-prev');
  const nextBtn = document.getElementById('mp-next');
  const playIcon = playBtn.querySelector('i');
  
  const minTitle = document.getElementById('mp-min-title');
  const expTitle = document.getElementById('mp-title');
  const expArtist = document.getElementById('mp-artist');
  
  const progressBar = document.getElementById('mp-progress-bar-container');
  const progress = document.getElementById('mp-progress');
  const timeCurrent = document.getElementById('mp-time-current');
  const timeTotal = document.getElementById('mp-time-total');
  
  const volumeSlider = document.getElementById('mp-volume');
  const volBtn = document.getElementById('mp-vol-btn');
  const volIcon = volBtn.querySelector('i');
  
  const playlistBtn = document.getElementById('mp-show-playlist-btn');
  const backToPlayerBtn = document.getElementById('mp-back-to-player');
  const closeBtns = document.querySelectorAll('.mp-btn-close');
  
  const playlistItemsContainer = document.getElementById('mp-playlist-items');
  const discs = document.querySelectorAll('.mp-disc');

  // Format Time (MM:SS)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  // Load Track
  function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    minTitle.textContent = track.title;
    expTitle.textContent = track.title;
    expArtist.textContent = track.artist;
    
    // Reset progress
    progress.style.width = '0%';
    timeCurrent.textContent = "00:00";
    
    // Update Playlist UI
    renderPlaylist();
    
    if (isPlaying) {
      audio.play().catch(e => console.log('Wait for user interaction to play audio.'));
    }
  }

  // Play / Pause
  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      playIcon.className = "fas fa-play";
      discs.forEach(d => d.classList.remove('playing'));
    } else {
      audio.play().catch(e => console.log('Wait for user interaction to play audio.'));
      playIcon.className = "fas fa-pause";
      discs.forEach(d => d.classList.add('playing'));
    }
    isPlaying = !isPlaying;
    renderPlaylist();
  }

  // Next / Prev
  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
  }

  function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
  }

  // Event Listeners
  playBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);

  audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    if (duration) {
      const progressPercent = (currentTime / duration) * 100;
      progress.style.width = `${progressPercent}%`;
      timeCurrent.textContent = formatTime(currentTime);
      timeTotal.textContent = formatTime(duration);
    }
  });

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', nextTrack);

  // Progress Bar Seek
  progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  });

  // Volume
  let previousVolume = 1;
  
  volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    if (audio.volume > 0) {
      audio.muted = false;
      previousVolume = audio.volume;
      volIcon.className = "fas fa-volume-up";
    } else {
      volIcon.className = "fas fa-volume-mute";
    }
  });

  volBtn.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
      audio.muted = false;
      audio.volume = previousVolume > 0 ? previousVolume : 1;
      volumeSlider.value = audio.volume;
      volIcon.className = "fas fa-volume-up";
    } else {
      audio.muted = true;
      volumeSlider.value = 0;
      volIcon.className = "fas fa-volume-mute";
    }
  });

  // Views Toggling
  playlistBtn.addEventListener('click', () => {
    playerContainer.classList.add('show-playlist');
  });

  backToPlayerBtn.addEventListener('click', () => {
    playerContainer.classList.remove('show-playlist');
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Hide completely or just reset to minimized?
      // Resetting to minimized by just unfocusing/removing hover class is handled by CSS mostly,
      // but if we clicked playlist we should remove it to go back to minimized.
      playerContainer.classList.remove('show-playlist');
      // For mobile, maybe we need to remove hover states, but on desktop mouseout handles it.
    });
  });

  // Render Playlist
  function renderPlaylist() {
    playlistItemsContainer.innerHTML = '';
    playlist.forEach((track, index) => {
      const isActive = index === currentTrackIndex;
      const equalizerHTML = `<div class="mp-equalizer ${isPlaying ? 'playing' : ''}"><span></span><span></span><span></span></div>`;
      const isPlayingIcon = isActive ? equalizerHTML : '<i class="fas fa-play"></i>';
      
      const itemHTML = `
        <div class="mp-playlist-item ${isActive ? 'active' : ''}" data-index="${index}">
          <div class="mp-playlist-item-num" style="display:flex; align-items:center; justify-content:center;">
            ${isActive ? isPlayingIcon : index + 1}
          </div>
          <div class="mp-playlist-item-info">
            <div class="mp-playlist-item-title">${track.title}</div>
            <div class="mp-playlist-item-desc">${track.artist}</div>
          </div>
          <div class="mp-playlist-item-icon" style="display:flex; align-items:center; justify-content:center;">
             ${isActive ? equalizerHTML : ''}
          </div>
        </div>
      `;
      playlistItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Add click events to playlist items
    const items = document.querySelectorAll('.mp-playlist-item');
    items.forEach(item => {
      item.addEventListener('click', function() {
        const idx = parseInt(this.getAttribute('data-index'));
        if (idx === currentTrackIndex) {
          togglePlay();
        } else {
          currentTrackIndex = idx;
          isPlaying = true;
          loadTrack(currentTrackIndex);
          playIcon.className = "fas fa-pause";
          discs.forEach(d => d.classList.add('playing'));
        }
      });
    });
  }

  // Initialize
  audio.volume = volumeSlider.value;
  loadTrack(currentTrackIndex);

})();
