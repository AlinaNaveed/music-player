console.log("Welcome to Spotify");

let songIndex = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songs = [];

// Fetch songs from backend
document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/api/songs')
    .then(res => res.json())
    .then(data => {
      songs = data;
      audioElement.src = `http://localhost:5000/${songs[songIndex].filePath}`;
masterSongName.innerText = songs[songIndex].songName;

      populateUI();
    });
});

function populateUI() {
  const container = document.querySelector('.songItemContainer');
  container.innerHTML = ''; // Clear old content

  songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('songItem');
    songItem.innerHTML = `
      <img src="${song.coverPath}" alt="cover">
      <span class="songName">${song.songName}</span>
      <span class="songListPlay">
        <span class="timestamp">5:34 
          <i id="${index}" class="fa-solid songItemPlay fa-play-circle"></i>
        </span>
      </span>
    `;
    container.appendChild(songItem);
  });

  attachPlayHandlers();
}

function attachPlayHandlers() {
  const playButtons = document.querySelectorAll('.songItemPlay');

  playButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      songIndex = parseInt(e.target.id);
      makeAllPlays();
      e.target.classList.remove('fa-play-circle');
      e.target.classList.add('fa-pause-circle');

      const fullPath = `http://localhost:5000/${songs[songIndex].filePath}`;
      console.log("Playing:", fullPath);
      audioElement.src = fullPath;
      masterSongName.innerText = songs[songIndex].songName;
      audioElement.currentTime = 0;
      audioElement.play();
      gif.style.opacity = 1;
      masterPlay.classList.remove('fa-play-circle');
      masterPlay.classList.add('fa-pause-circle');
    });
  });
}


function makeAllPlays() {
  document.querySelectorAll('.songItemPlay').forEach(element => {
    element.classList.remove('fa-pause-circle');
    element.classList.add('fa-play-circle');
  });
}

// Play/pause from master button
masterPlay.addEventListener('click', () => {
  if (audioElement.paused || audioElement.currentTime <= 0) {
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    gif.style.opacity = 1;
  } else {
    audioElement.pause();
    masterPlay.classList.remove('fa-pause-circle');
    masterPlay.classList.add('fa-play-circle');
    gif.style.opacity = 0;
  }
});


// Update progress bar
audioElement.addEventListener('timeupdate', () => {
  let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
  myProgressBar.value = progress;
});

// Seek from progress bar
myProgressBar.addEventListener('change', () => {
  audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// Next song
document.getElementById('next').addEventListener('click', () => {
  songIndex = (songIndex + 1) % songs.length;
  playSong();
});


// Previous song
document.getElementById('previous').addEventListener('click', () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  playSong();
});


function playSong() {
  makeAllPlays();
  audioElement.src = `http://localhost:5000/${songs[songIndex].filePath}`;
  masterSongName.innerText = songs[songIndex].songName;
  audioElement.currentTime = 0;
  audioElement.play();
  gif.style.opacity = 1;
  masterPlay.classList.remove('fa-play-circle');
  masterPlay.classList.add('fa-pause-circle');

  const currentButton = document.getElementById(`${songIndex}`);
  if (currentButton) {
    currentButton.classList.remove('fa-play-circle');
    currentButton.classList.add('fa-pause-circle');
  }
}
