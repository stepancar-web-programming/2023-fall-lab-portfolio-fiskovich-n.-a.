const player = document.querySelector('.player');
const playBtn = document.querySelector('.play');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const audio = document.querySelector('.audio');
const progressContainer = document.querySelector('.progress____container');
const progress = document.querySelector('.QWER');
const title = document.querySelector('.song');
const cover = document.querySelector('.cover_img');
const img_src = document.querySelector('.img_src');
const audioVisualizer = document.getElementById('audioVisualizer');
const ctx = audioVisualizer.getContext('2d');
let playyy = false;

const songs = ['Котик', 'Когдя я стану кошкой', 'Котозависимый', 'Чёрный кот'];
let songIndex = 0;

function loadSong(song) {
  title.innerHTML = song;
  audio.src = `./music/${song}.mp3`;
  cover.src = `./img/cover${songIndex + 1}.png`;
}

loadSong(songs[songIndex]);

function playSong() {
  player.classList.add('play');
  cover.classList.add('active');
  img_src.src = './img/pause.svg';
  playyy = true;
  audio.play();

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioSource = audioContext.createMediaElementSource(audio);
  const analyser = audioContext.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);

  const audioVisualizer = document.getElementById('audioVisualizer');
  audioVisualizer.width = 900;
  audioVisualizer.height = 900;
  const ctx = audioVisualizer.getContext('2d');

  const bufferLength = 364;
  const dataArray = new Uint8Array(bufferLength);

  function drawVisualizer() {
    const WIDTH = audioVisualizer.width;
    const HEIGHT = audioVisualizer.height;
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;
    const maxRadius = Math.min(centerX, centerY);
    const radiusMultiplier = 0.8;

    requestAnimationFrame(drawVisualizer);

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

      const red = 255 * (1 - colorValue*0.7);
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
  
  drawVisualizer();
}

function pauseSong() {
  player.classList.remove('play');
  cover.classList.remove('active');
  img_src.src = './img/play.svg';
  playyy = false;
  audio.pause();
}

playBtn.addEventListener('click', () => {
  const isPlaying = player.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

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

nextBtn.addEventListener('click', nextSong);

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

prevBtn.addEventListener('click', prevSong);

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
