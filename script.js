async function getSongInfo() {
  let songPage = await fetch("http://127.0.0.1:5500/songs/")
  let songPageText = await songPage.text()
  let songs = document.createElement('div')
  songs.innerHTML=songPageText
  
  let songElements = songs.querySelectorAll('#files a');
 
  let songInfo = {
    playSongs: [],
    songNames:[]
  }
  songElements.forEach((element, index) => {
    if (index > 0) {

    songInfo.playSongs.push(element.href);
  
    let songTitle = element.getAttribute("title");
    const lastSpaceIndex = songTitle.lastIndexOf('.');
    if (lastSpaceIndex !== -1) {
      songTitle= songTitle.substring(0, lastSpaceIndex);
    }
    songInfo.songNames.push(songTitle);

  }
});
  return songInfo
}

  // console.log(firstSongTitle)

async function main() {
  let allSongs = await getSongInfo()
  // let audio = new Audio(allSongs[0])
  // audio.play()
  
  let songList = document.querySelector(".songList").getElementsByTagName("ul")[0]
  allSongs.playSongs.forEach((songUrl, index) => {
  const songName = allSongs.songNames[index];
    songList.innerHTML=songList.innerHTML + `<li><a href="${songUrl}">${songName}</a></li>`

  });

  
}

main()
