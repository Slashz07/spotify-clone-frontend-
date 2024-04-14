
async function getSongInfo() {
  let songPage = await fetch("http://127.0.0.1:5500/songs/")
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

let currentSong = new Audio()

const myMusic = (song, pauseSong = false) => {

  let displayName = document.querySelector(".songStats")
  displayName.innerHTML = `<p>${song}</p>`

  currentSong.src = "./songs/" + song + ".mp3"
  if (!pauseSong) {
    let playbtnSymbol = document.querySelector(".songPlayBtn img")
    playbtnSymbol.src = "./assets/playBtnSymbol-play.svg"

    currentSong.play()
  }

}
let runTime = (time) => {
  const min = Math.floor(time / 60)
  const sec = Math.floor(time % 60)

  let formattedMin = String(min).padStart(2, "0")
  let formattedSec = String(sec).padStart(2, "0")
  return `${formattedMin}:${formattedSec}`
}
async function main() {
  let allSongs = await getSongInfo()
  myMusic(allSongs.songNames[0], true)

  let songList = document.querySelector(".songList ul")
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

    //  <div class="song-info">
    //   <div class="name"><a href="${songUrl}">${songName}</a></div>
    //   <div class="artist">artist</div>
    // </div>
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


  // timeUpdate-->

  let songBar = document.querySelector(".seekBar")
  songBar.addEventListener('click', e => {
    let barLen = e.target.getBoundingClientRect().width
    let markerPos = e.offsetX
    // console.log(barLen,markerPos)
    let songPos = (markerPos / barLen) 
    currentSong.currentTime=songPos*currentSong.duration
    
  })

  let songDuration = document.querySelector(".time")
  let songBarMarker = document.querySelector(".progressMarker")

  currentSong.addEventListener("timeupdate", () => {
    songDuration.innerHTML = `<p>${runTime(currentSong.currentTime)}/${runTime(currentSong.duration)}</p>`
    if (runTime(currentSong.currentTime) == runTime(currentSong.duration)) {
      playbtnSymbol.src = "./assets/play-button-pause.svg"
    }
    songBarMarker.style.left = (currentSong.currentTime / currentSong.duration) * 100+'%'
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
    currentSong.volume = parseInt(currentVol)/100
  })
}


main()
