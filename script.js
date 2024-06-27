const player = document.querySelector(".player");
const video = document.querySelector("video");
const progressRange = document.querySelector(".progress-range");
const progressBar = document.querySelector(".progress-bar");
const PlayBtn = document.querySelector("#play-btn");
const volumeIcon = document.querySelector("#volume-icon");
const volumeRange = document.querySelector(".volume-range");
const volumeBar = document.querySelector(".volume-bar");
const playerSpeed = document.querySelector(".player-speed");
const currentTime = document.querySelector(".time-elapsed");
const duration = document.querySelector(".time-duration");
const fullScreen = document.querySelector(".fullscreen");

// Play & Pause ----------------------------------- //

function togglePlay() {
  if (video.paused) {
    video.play();
    PlayBtn.classList.replace("fa-play", "fa-pause");
    PlayBtn.setAttribute("title", "pause");
  } else {
    video.pause();
    PlayBtn.classList.replace("fa-pause", "fa-play");
    PlayBtn.setAttribute("title", "play");
  }
}

// Progress Bar ---------------------------------- //

// Calculate display time Formate
function displayTime(t) {
  const minutes = Math.round(t / 60);
  let seconds = Math.round(t % 60);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgressBar(e) {
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  currentTime.textContent = displayTime(video.currentTime) + " / ";
  duration.textContent = displayTime(video.duration);
}

// click to seek withing the video
function setProgress(e) {
  // mannualy setting width so chage little fast.
  progressBar.style.width = (e.offsetX / this.offsetWidth) * 100 + "%";
  //setting time
  video.currentTime = (e.offsetX / this.offsetWidth) * video.duration;
}

// Volume Controls --------------------------- //
let lastVolume = video.volume;

function setVolumeIcon(volume) {
  // Adding volume icons
  if (volume > 0.5) volumeIcon.className = "fas fa-volume-up";
  if (volume > 0.1 && volume < 0.5) volumeIcon.className = "fas fa-volume-down";
  if (volume === 0) volumeIcon.className = "fas fa-volume-off";
}

function controlVolume(e) {
  let volumeLevel = e.offsetX / this.offsetWidth;
  if (volumeLevel < 0.1) {
    volumeLevel = 0;
  }

  if (volumeLevel > 0.9) {
    volumeLevel = 1;
  }
  volumeBar.style.width = volumeLevel * 100 + "%";
  video.volume = volumeLevel;
  setVolumeIcon(volumeLevel);

  lastVolume = volumeLevel;
}

// Mute/Unmute
function toggleMute() {
  video.muted = !video.muted;
  if (video.muted) {
    volumeBar.style.width = 0;
    volumeIcon.className = "fas fa-volume-mute";
    volumeIcon.setAttribute("title", "Unmute");
  } else {
    volumeBar.style.width = lastVolume * 100 + "%";
    setVolumeIcon(lastVolume);
    volumeIcon.setAttribute("title", "mute");
  }
}

// Change Playback Speed -------------------- //

function playbackSpeed(e) {
  video.playbackRate = e.target.value;
}

// Fullscreen ------------------------------- //

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }

  video.classList.add("video-fullscreen");
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }

  video.classList.remove("video-fullscreen");
}

let isFullScreen = false;

// Toggle Fullscreen
function toggleFullScreen() {
  if (!isFullScreen) {
    openFullscreen(player);
  } else {
    closeFullscreen();
  }

  isFullScreen = !isFullScreen;
}

// Event Listeners
PlayBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("ended", () => {
  PlayBtn.classList.replace("fa-pause", "fa-play");
  PlayBtn.setAttribute("title", "play");
});

video.addEventListener("timeupdate", updateProgressBar);
video.addEventListener("canplay", updateProgressBar);

progressRange.addEventListener("click", setProgress);

volumeRange.addEventListener("click", controlVolume);
volumeIcon.addEventListener("click", toggleMute);

playerSpeed.addEventListener("change", playbackSpeed);

fullScreen.addEventListener("click", toggleFullScreen);
