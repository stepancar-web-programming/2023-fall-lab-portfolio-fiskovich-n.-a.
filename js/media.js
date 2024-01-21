const player = document.querySelector('.player');
const audio = document.querySelector('.audio');
const progressContainer = document.querySelector('.progress____container');
const progress = document.querySelector('.QWER');
const title = document.querySelector('.song');
const cover = document.querySelector('.cover_img');
const img_src = document.querySelector('.img_src');
const audioVisualizer = document.getElementById('audioVisualizer');
const ctx = audioVisualizer.getContext('2d');
let playyy = false;
let animationFrameId;
let audioContext;
let audioSource;
let analyser;

const songs = ['Котозависимый', 'Когда я стану кошкой', 'Котик', 'Чёрный кот'];
let songIndex = 0;


function loadSong(song) {
  title.innerHTML = song;
  audio.src = `./music/${song}.mp3`;
  cover.src = `./img/cover${songIndex + 1}.png`;
}

loadSong(songs[songIndex]);

function setupAudioVisualizer() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  }

  audioVisualizer.width = 900;
  audioVisualizer.height = 900;
}

function drawVisualizer() {
  const WIDTH = audioVisualizer.width;
  const HEIGHT = audioVisualizer.height;
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;
  const maxRadius = Math.min(centerX, centerY);
  const radiusMultiplier = 0.8;

  animationFrameId = requestAnimationFrame(drawVisualizer);

  const bufferLength = 364;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  for (let i = 0; i < bufferLength; i++) {
    const amplitude = dataArray[i];
    const radius = ((amplitude / 200) * maxRadius) * radiusMultiplier;
    const angle = (i / bufferLength) * Math.PI * 20;

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    const colorValue = distanceFromCenter / maxRadius;

    const red = 255 * (1 - colorValue * 0.7);
    const green = 0;
    const blue = 255 * colorValue;

    gradient.addColorStop(0, `rgb(${red}, ${green}, ${blue})`);
    gradient.addColorStop(1, 'white');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
}

function playSong() {
  player.classList.add('play');
  cover.classList.add('active');
  img_src.src = './img/pause.svg';
  playyy = true;
  audio.play();

  setupAudioVisualizer();
  drawVisualizer();
}

function pauseSong() {
  player.classList.remove('play');
  cover.classList.remove('active');
  img_src.src = './img/play.svg';
  audio.pause();
  cancelAnimationFrame(animationFrameId);
  ctx.clearRect(0, 0, audioVisualizer.width, audioVisualizer.height);
  playyy = false;
}

function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  if (playyy) {
    playSong();
  }
}

function prevSong() {
  songIndex--;
  if (songIndex == -1) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  if (playyy) {
    playSong();
  }
}

function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

audio.addEventListener('timeupdate', updateProgress);

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);

document.addEventListener('DOMContentLoaded', function () {
  var playBtn = document.querySelector('.btn.play');
  var prevBtn = document.querySelector('.btn.prev');
  var nextBtn = document.querySelector('.btn.next');
  var audio = document.querySelector('.audio');

  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', playPrev);
  nextBtn.addEventListener('click', playNext);

  document.addEventListener('keydown', function (event) {
      if (event.code === 'Space') {
          togglePlay();
      } else if (event.code === 'ArrowLeft') {
          playPrev();
      } else if (event.code === 'ArrowRight') {
          playNext();
      }
  });

  function togglePlay() {
      if (audio.paused) {
        playSong();
      } else {
        pauseSong();
      }
  }

  function playPrev() {
    prevSong()
  }

  function playNext() {
    nextSong()
  }
});
