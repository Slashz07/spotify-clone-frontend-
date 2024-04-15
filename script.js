
let currentSong = new Audio()
let currentPLaylist
const myMusic = (song, pauseSong = false) => {

  let displayName = document.querySelector(".songStats")
  displayName.innerHTML = `<p>${song}</p>`

  currentSong.src = `./songs/${currentPLaylist}/` + song + ".mp3"
  if (!pauseSong) {
    let playbtnSymbol = document.querySelector(".songPlayBtn img")
    playbtnSymbol.src = "./assets/playBtnSymbol-play.svg"

    currentSong.play()
  }

}
let runTime = (time) => {

  if (isNaN(time) || time < 0) {
    return "00:00"
  }

  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)

  let formattedMin = String(min).padStart(2, "0")
  let formattedSec = String(sec).padStart(2, "0")
  return `${formattedMin}:${formattedSec}`
}


async function getSongInfo(playList) {
  currentPLaylist = playList
  let songPage = await fetch(`http://127.0.0.1:5500/songs/${playList}/`)
  let songPageText = await songPage.text()
  let songs = document.createElement('div')
  songs.innerHTML = songPageText


  let songElements = songs.querySelectorAll('#files a');

  let songInfo = {
    songNames: []
  }
  songElements.forEach((element, index) => {
    if (index > 0) {

      let songTitle = element.getAttribute("title");
      const lastSpaceIndex = songTitle.lastIndexOf('.');
      if (lastSpaceIndex !== -1) {
        songTitle = songTitle.substring(0, lastSpaceIndex);
      }
      songInfo.songNames.push(songTitle);

    }
  });
  return songInfo
}

async function getPlaylists() {
  let playlistPage = await fetch(`http://127.0.0.1:5500/songs/`)
  let pageText = await playlistPage.text()
  let div = document.createElement('div')
  div.innerHTML = pageText

  let pageElements = songs.querySelectorAll('#files a');

  let allPlaylists=[]
  pageElements.forEach((element) => {
    if (index > 0) {
      let playlistTitle = element.getAttribute("title");
      allPlaylists.push(playlistTitle);
    }
  });

}


async function main(songFolder) {
  let allSongs = await getSongInfo(songFolder)
  myMusic(allSongs.songNames[0], true)
getPlaylists()
  let songList = document.querySelector(".songList ul")
  songList.innerHTML=``
  allSongs.songNames.forEach((songName, index) => {
    songList.innerHTML = songList.innerHTML + ` <li>
              <img class="invert" src="./assets/music-icon.svg" alt="">
              <div class="song-info">
                <div class="name">${songName}</div>
              </div>
              <div class="song-btn">
                <p>Play Now</p>
                <div class="play-now">
                  <img class="invert" src="./assets/play-button-pause.svg" alt="">
                </div>
              </div>
            </li>`


  });

  let nextSongIndex = 1
  let prevSongIndex = null

  // playing song from playlist click-->
  let mySongs = Array.from(document.querySelectorAll(".songList ul li"))
  mySongs.forEach((e, index) => {
    e.addEventListener('click', () => {
      let music = e.querySelector(".name").innerText
      myMusic(music)
      nextSongIndex = index + 1
      prevSongIndex = index - 1
    })
  })


  // playing next song using the arrow-->
  let nextTrack = document.querySelector("#next")
  nextTrack.addEventListener('click', () => {
    if (nextSongIndex < mySongs.length) {
      let nextSong = mySongs[nextSongIndex].querySelector(".name").innerText
      myMusic(nextSong)
    }

    prevSongIndex = nextSongIndex - 1

    if (nextSongIndex < mySongs.length - 1) {
      nextSongIndex += 1
    }

  })

  // playing prev song using the arrow-->
  let prevTrack = document.querySelector("#prev")
  prevTrack.addEventListener('click', () => {
    if (prevSongIndex >= 0) {
      let prevSong = mySongs[prevSongIndex].querySelector(".name").innerText
      myMusic(prevSong)
    }
    nextSongIndex = prevSongIndex + 1
    if (prevSongIndex > 0) {
      prevSongIndex -= 1
    }
  })

  // timeUpdate-->

  let songBar = document.querySelector(".seekBar")
  songBar.addEventListener('click', e => {
    let barLen = e.target.getBoundingClientRect().width
    let markerPos = e.offsetX
    // console.log(barLen,markerPos)
    let songPos = (markerPos / barLen)
    currentSong.currentTime = songPos * currentSong.duration

  })

  let songDuration = document.querySelector(".time")
  let songBarMarker = document.querySelector(".progressMarker")

  currentSong.addEventListener("timeupdate", () => {

    songDuration.innerHTML = `<p>${runTime(currentSong.currentTime)}/${runTime(currentSong.duration)}</p>`
    if (runTime(currentSong.currentTime) == runTime(currentSong.duration)) {
      playbtnSymbol.src = "./assets/play-button-pause.svg"
    }
    songBarMarker.style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
  })

  // add menu-->
  let menuIcon = document.querySelector(".hamBurger")
  menuIcon.addEventListener('click', () => {
    document.querySelector(".left").style.left = 0 + '%'
  })
  // remove menu-->
  let crossIcon = document.querySelector("#cross")
  crossIcon.addEventListener("click", () => {
    document.querySelector(".left").style.left = -120 + '%'
  })

  // setting volumeBar-->
  let volumeBar = document.querySelector(".volumeBar")
  volumeBar.addEventListener('change', e => {
    currentVol = e.target.value
    currentSong.volume = parseInt(currentVol) / 100
  })

}

// Accessing songs from playlists-->
const allPlaylists = document.querySelectorAll(".playlist-container .card")
allPlaylists.forEach(curPlaylist => {
  curPlaylist.addEventListener("click", async folder => {
    console.log(folder.currentTarget.dataset)
    await main(folder.currentTarget.dataset.playlist)
  })
})

// play/pause button-->
let playbtn = document.querySelector(".songPlayBtn")
let playbtnSymbol = document.querySelector(".songPlayBtn img")
playbtn.addEventListener('click', () => {
  if (currentSong.paused && currentSong.src.length != 0) {
    currentSong.play()
    playbtnSymbol.src = "./assets/playBtnSymbol-play.svg"
  } else {
    currentSong.pause()
    playbtnSymbol.src = "./assets/play-button-pause.svg"
  }
})

let firstPlaylist = document.querySelector(".card")
let playlistName = firstPlaylist.dataset.playlist
main(playlistName)
