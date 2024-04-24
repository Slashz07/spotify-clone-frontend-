
let currentSong = new Audio()

let currentPLaylist;

const myMusic = (song, pauseSong = false) => {
  let displayName = document.querySelector(".songStats")
  displayName.innerHTML = `<p>${song != undefined ? song : ""}</p>`

  let playbtnSymbol = document.querySelector(".songPlayBtn img")
  playbtnSymbol.src = "./assets/play-button-pause.svg"

  currentSong.src = `./songs/${currentPLaylist}/` + song + ".mp3"
  if (!pauseSong) {
    currentSong.play()
    playbtnSymbol.src = "./assets/playBtnSymbol-play.svg"

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
    if (index > 0 && element.title.includes(".mp3")) {

      let songTitle = element.title;
      const lastSpaceIndex = songTitle.lastIndexOf('.');
      if (lastSpaceIndex !== -1) {
        songTitle = songTitle.substring(0, lastSpaceIndex);
      }
      songInfo.songNames.push(songTitle);

    }
  });

  let songList = document.querySelector(".songList ul")
  songList.innerHTML = ``

  songInfo.songNames.forEach((songName) => {
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

  myMusic(songInfo.songNames[0], true)
  return songInfo
}

async function getPlaylists() {
  let playlistPage = await fetch(`http://127.0.0.1:5500/songs/`)
  let pageText = await playlistPage.text()
  let div = document.createElement('div')
  div.innerHTML = pageText

  let pageElements = Array.from(div.querySelectorAll('#files a'));

  let playlistContainer = document.querySelector(".playlist-container")
  let playlistNames = []

  for (let index = 1; index < pageElements.length; index++) {
    let element = pageElements[index]
    let playlistTitle = element.getAttribute("title");

    let songPage = await fetch(`http://127.0.0.1:5500/songs/${playlistTitle}/`)
    let songPageText = await songPage.text()
    let songs = document.createElement('div')
    songs.innerHTML = songPageText

    let songElements = Array.from(songs.querySelectorAll('#files a'));
    let jsonObj
    let playlistImg
    songElements.forEach((element, index) => {
      if (index > 0 && element.title.includes(".json")) {
        jsonObj = element.title
      } else if (index > 0 && element.title.includes(".jpeg") || element.title.includes(".jpg") || element.title.includes(".png")) {
        playlistImg = element.title
      }
    })


    let metaPage = await fetch(`http://127.0.0.1:5500/songs/${playlistTitle}/${jsonObj}`)
    let metaContent = await metaPage.json()
    playlistNames.push(metaContent.title)

    playlistContainer.innerHTML = playlistContainer.innerHTML +
      `<div data-playlist=${playlistTitle} class="card">
            <img src="./songs/${playlistTitle}/${playlistImg}" alt="">
            <div class="play-icon">
              <img src="./assets/play-button-pause.svg" alt="">
            </div>
            <h4>${metaContent.title}</h4>
            <p>${metaContent.description}</p>
          </div>`

  }
  // Accessing songs from playlists-->

  const allPlaylists = Array.from(document.querySelectorAll(".playlist-container .card"))
  let playlistNum = 0
  allPlaylists.forEach((curPlaylist, index) => {
    curPlaylist.addEventListener("click", async folder => {
      console.log(folder.currentTarget.dataset.playlist)
      playlistNum = index
      await main(folder.currentTarget.dataset.playlist)
    })
  })

  const prevPlaylist = document.querySelector(".playlist-left")
  const nextPlaylist = document.querySelector(".playlist-right")
  const playlistHeading = document.querySelector(".right-body h2")
  playlistHeading.innerText = `${playlistNames[0]}`

  prevPlaylist.addEventListener('click', async () => {
    if (playlistNum != 0) {
      playlistHeading.innerText = `${playlistNames[--playlistNum]}`
      await main(allPlaylists[playlistNum].dataset.playlist)

    }
  })

  nextPlaylist.addEventListener('click', async () => {
    if (playlistNum < allPlaylists.length - 1) {
      playlistHeading.innerText = `${playlistNames[++playlistNum]}`
      await main(allPlaylists[playlistNum].dataset.playlist)

    }
  })

}


async function main(selectedPlaylist = "Angry_(mood)") {

  await getSongInfo(selectedPlaylist)

  // playing song from playlist click-->
  let mySongs = Array.from(document.querySelectorAll(".songList ul li"))
  console.log(mySongs)

  let nextSongIndex = 1
  let prevSongIndex = null

  mySongs.forEach((e, index) => {
    e.addEventListener('click', () => {
      let music = e.querySelector(".name").innerText
      myMusic(music)
      nextSongIndex = index + 1
      if(index!=0)
      prevSongIndex = index - 1
    })
  })


  // playing prev song using the arrow-->
  let prevTrack = document.querySelector("#prev")
  prevTrack.addEventListener('click', () => {
    console.log(prevSongIndex)

    if (prevSongIndex == null)
      prevSongIndex = 0
    if (prevSongIndex >= 0) {
      console.log(prevSongIndex)
      let prevSong = mySongs[prevSongIndex].querySelector(".name").innerText
      myMusic(prevSong)
    }
    nextSongIndex = prevSongIndex + 1
    if (prevSongIndex > 0) {
      prevSongIndex -= 1
    }


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
  songBarMarker.style.left=0+'%'
  currentSong.addEventListener("timeupdate", () => {

    songDuration.innerHTML = `<p>${runTime(currentSong.currentTime)}/${runTime(currentSong.duration)}</p>`
    if (currentSong.currentTime == currentSong.duration) {
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


}

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

// setting volumeBar-->
let volumeBar = document.querySelector(".volumeBar")
let volumeIcon = document.querySelector(".volume-icon")
let currentVol = 45
currentSong.volume = (currentVol / 100)
volumeBar.value = currentVol

volumeBar.addEventListener('change', e => {
  currentVol = e.target.value
  if (currentVol == 0) {
    volumeIcon.src = "./assets/no-volume.svg"
  }
  else if (currentVol < 35) {
    volumeIcon.src = "./assets/average-volume.svg"
  }
  else {
    volumeIcon.src = "./assets/full-volume.svg"
  }
  currentSong.volume = parseInt(currentVol) / 100
})

volumeIcon.addEventListener('click', () => {
  if (currentSong.volume != 0) {
    volumeIcon.src = "./assets/no-volume.svg"
    volumeBar.value = 0
    currentSong.volume = 0
  } else {

    if (currentVol == 0) {
      volumeIcon.src = "./assets/no-volume.svg"
    }
    else if (currentVol < 35) {
      volumeIcon.src = "./assets/average-volume.svg"
    }
    else {
      volumeIcon.src = "./assets/full-volume.svg"
    }
    volumeBar.value = currentVol
    currentSong.volume = parseInt(currentVol) / 100

  }

})


getPlaylists()
main()



