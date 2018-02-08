module.exports = {
  handlePlayPause,
  playVideo,
  playPrev,
  playNext,
  volumeControl,
  volumeMute,
  seekVideo,
  loopVideo,
  toggleShowSubtitle,
  changeSubtitle,
  changeAudioTrack
};

function handlePlayPause(operation) {
  // w3 toggle functions got back display:block
  switch (operation) {
    case "play":
      playbutton.style.display = 'none';
      pausebutton.style.display = 'inline-block';
      videoplayer.play();
      break;
    case "pause":
      playbutton.style.display = 'inline-block';
      pausebutton.style.display = 'none';
      videoplayer.pause();
      setToast(i18n.__('pause'));
      break;

    default:
      playbutton.style.display = 'inline-block';
      pausebutton.style.display = 'none';
      videoplayer.pause();
      setToast(i18n.__('pause'));
      break;
  }
}

function playVideo(videoid) {

  playlistfile.findOne({ _id: parseInt(videoid) }, function(err, d) {

    if (d !== null) {

      w3.hide("#aacconvertspan");
      w3.hide("#aacconvertspanclose");
      w3.removeClass('.vidlink','activated');
      w3.addClass('#vid-' + videoid,'activated');
      windowtitle.innerHTML = d._name;
      playing.setAttribute("data", d._id);
      playing.innerHTML = d._name;
      videoplayer.src = d._path;
  
      // search subtitles and audio tracks..
      getSubtitles(d._name, d._path);
      if (showSubtitle) {
        loadSubtitle();
      }
      getAudiotracks(d._name, d._path);

      // search mkv audio codecs (ac3 audio codec in mkv containers currently not supported in html5 videoplayer)
      if (path.extname(d._name) === '.mkv') {
        getAudioEncoding(d._path);
      }
      
      handlePlayPause("play");
      setToast(d._name);

    }

  });

}

function playPrev() {

  let currPlay = playing.getAttribute("data");
  let prevPlay = parseInt(currPlay) - 1;
  if (prevPlay > 0) {
    playVideo(prevPlay);
  }

}

function playNext() {

  let currPlay = playing.getAttribute("data");
  let nextPlay = parseInt(currPlay) + 1;

  playlistfile.findOne({ _id: nextPlay }, function(err, d) {

    if (d === null) {

      playlistfile.findOne({ _id: 1 }, function(err, d1) {

        if (d1 !== null) {
          playVideo(1);
        }

      });

    } else {
      playVideo(d._id);
    }

  });

}

function volumeControl(setto) {

  let currVolume = videoplayer.volume;

  if (setto === "up") {
    
    if (currVolume < 1) {
      videoplayer.volume = currVolume + 0.1;
    }

  } else if (setto === "down") {
    
    if (currVolume > 0.1) {
      videoplayer.volume = currVolume - 0.1;
    }

  }

  store.set('settings.volume', videoplayer.volume);

  let currVolumePercent = Math.floor(currVolume * 100);
  setToast(i18n.__('volume') + ' ' + currVolumePercent + '%');

}

function volumeMute() {

  let videoHasMuteAttr = videoplayer.getAttribute("muted");

  if (videoHasMuteAttr === null) {

    videoplayer.setAttribute("muted", ""); // video muted attr dont works in chrome..
    videoplayer.volume = 0;
    w3.addClass('#mutebutton','activated');
    setToast(i18n.__('mute') + ' ' + i18n.__('on'));

  } else {

    videoplayer.removeAttribute("muted"); // video muted attr dont works in chrome..
    videoplayer.volume = 1;
    w3.removeClass('#mutebutton','activated');
    setToast(i18n.__('mute') + ' ' + i18n.__('off'));

  }

}

function seekVideo(goto) {

  let mediaDuration = videoplayer.duration;
  let currTime = videoplayer.currentTime;

  switch (goto) {
    case "forward":
      if (currTime < mediaDuration) {
        videoplayer.currentTime = currTime + 5;
      }
      break;
    case "backward":
      if (currTime !== NaN && currTime > 0) {
        videoplayer.currentTime = currTime - 5;
      }
      break;
  }

}

function loopVideo() {

  let videoHasLoopAttr = videoplayer.getAttribute("loop");

  if (videoHasLoopAttr === null) {
    videoplayer.setAttribute("loop", "");
    w3.addClass('#loopbutton','activated');
    setToast(i18n.__('loop') + ' ' + i18n.__('on'));
  } else {
    videoplayer.removeAttribute("loop");
    w3.removeClass('#loopbutton','activated');
    setToast(i18n.__('loop') + ' ' + i18n.__('off'));
  }

}

function toggleShowSubtitle() {

  if (tracks.mode === 'disabled') {
    tracks.mode = 'showing';
    setToast(i18n.__('subtitle') + ' ' + i18n.__('on'));
  } else {
    tracks.mode = 'disabled';
    setToast(i18n.__('subtitle') + ' ' + i18n.__('off'));
  }

}

function getSubtitles(filename, filepath) {

  let videoHasSubtitles = 0;

  let videoNameOnly = filename.slice(0, -4); /* .mp4 | .mkv | webm */ /* I don't care webm.. too rare */
  let videoNameOnlyLength = videoNameOnly.length;

  let videoDir = path.dirname(filepath);
  let folderFiles = fs.readdirSync(videoDir);

  for (let fileInFolder in folderFiles) {

    let fileName = path.basename(folderFiles[fileInFolder]);
    let fileExt = path.extname(fileName);

    if ( fileExt === ".srt" ) {

      let fileNameOnly = fileName.slice(0, -4);
      let fileNameLang = fileNameOnly.slice(videoNameOnlyLength + 1);

      if ( fileNameOnly.indexOf(videoNameOnly) !== -1 ) {
        
        videoHasSubtitles++;
        
      }
      allSubNum.innerHTML = videoHasSubtitles;
    }

  }
  
}

function loadSubtitle() {

  let playedVideoID = playing.getAttribute("data");
  let subtitles = parseInt(allSubNum.innerHTML);
  let subtitleNum = parseInt(currSubNum.innerHTML);

  let targetSubLanguage;

  if (store.has('settings.subtitlelanguage')) {
    targetSubLanguage = store.get('settings.subtitlelanguage');
  } else {
    targetSubLanguage = 'en';
  }

  playlistfile.findOne({ _id: parseInt(playedVideoID) }, function(err, d) {

    let videoNameOnly = d._name.slice(0, -4);
    let videoNameOnlyLength = videoNameOnly.length;
  
    let videoDir = path.dirname(d._path);
    let folderFiles = fs.readdirSync(videoDir);

    let foundedSubIdx = 0;

    for (let fileInFolder in folderFiles) {

      let fileName = path.basename(folderFiles[fileInFolder]);
      let fileExt = path.extname(fileName);
  
      if ( fileExt === ".srt" ) {

        let fileNameOnly = fileName.slice(0, -4);
        let fileNameLang = fileNameOnly.slice(videoNameOnlyLength + 1);
  
        if ( fileNameOnly.indexOf(videoNameOnly) !== -1 ) {
          // found srt for the current video
          foundedSubIdx++;
          
          if (fileNameLang === targetSubLanguage) {
            // found srt to the setted language

            let srtData = fs.readFileSync(videoDir + '/' + fileName);
            // html video player currently not support the .srt files. - so let's convert it to vtt..

            srt2vtt(srtData, function(err, vttData) {
              if (err) throw new Error(err);
              
              subtitleContainer.value = vttData;
  
              let videoTrack = document.createElement("track");
              videoTrack.setAttribute("kind", "subtitles");
              videoTrack.setAttribute("srclang", fileNameLang);
              videoTrack.setAttribute("label", fileNameLang);
    
              let vttText = subtitleContainer.value.trim();
    
              let vttBlob = new Blob([vttText], {
                type: 'text/vtt'
              });

              videoTrack.setAttribute("src", URL.createObjectURL(vttBlob));
              
              videoplayer.appendChild(videoTrack);

              let tracks = videoplayer.textTracks[0];

              currSubNum.innerHTML = foundedSubIdx;
              tracks.mode = 'showing';
  
              setTimeout(function(){ setToast(i18n.__('subtitle') + ': ' + fileNameLang); }, 3000);

            });
            
            break;
          }

        }
        
      }

    }

  });

}

function changeSubtitle() {

  let tracks;

  let playedVideoID = playing.getAttribute("data");
  let subtitles = parseInt(allSubNum.innerHTML);
  let subtitleNum = parseInt(currSubNum.innerHTML);

  videoplayer.innerHTML = '';
  subtitleContainer.value = '';

  if (subtitleNum === subtitles) {

    currSubNum.innerHTML = 0;
    store.set('settings.showsubtitle', false);
    showSubtitle = false;
    setToast(i18n.__('subtitle') + ' ' + i18n.__('off'));

  } else {

    let targetSubIdx = subtitleNum;

    playlistfile.findOne({ _id: parseInt(playedVideoID) }, function(err, d) {

      let videoNameOnly = d._name.slice(0, -4);
      let videoNameOnlyLength = videoNameOnly.length;
    
      let videoDir = path.dirname(d._path);
      let folderFiles = fs.readdirSync(videoDir);

      let foundedSubIdx = 0;

      for (let fileInFolder in folderFiles) {
  
        let fileName = path.basename(folderFiles[fileInFolder]);
        let fileExt = path.extname(fileName);
    
        if ( fileExt === ".srt" ) {

          let fileNameOnly = fileName.slice(0, -4);
          let fileNameLang = fileNameOnly.slice(videoNameOnlyLength + 1);
    
          if ( fileNameOnly.indexOf(videoNameOnly) !== -1 ) {
            // found srt for the current video

            if (foundedSubIdx === targetSubIdx) {
              // found srt to the setted num

              let srtData = fs.readFileSync(videoDir + '/' + fileName);
              // html video player currently not support the .srt files. - so let's convert it to vtt..

              srt2vtt(srtData, function(err, vttData) {
                if (err) throw new Error(err);
                
                subtitleContainer.value = vttData;
    
                let videoTrack = document.createElement("track");
                videoTrack.setAttribute("kind", "subtitles");
                videoTrack.setAttribute("srclang", fileNameLang);
                videoTrack.setAttribute("label", fileNameLang);
      
                let vttText = subtitleContainer.value.trim();
      
                let vttBlob = new Blob([vttText], {
                  type: 'text/vtt'
                });
                videoTrack.setAttribute("src", URL.createObjectURL(vttBlob));
                
                videoplayer.appendChild(videoTrack);
    
                tracks = videoplayer.textTracks[0];

                currSubNum.innerHTML = foundedSubIdx + 1;
                store.set('settings.showsubtitle', true);
                showSubtitle = true;
                tracks.mode = 'showing';
          
                setToast(i18n.__('subtitle') + ': ' + fileNameLang);

              });

              break;
            }

            foundedSubIdx++;
          }
          
        }

      }

    });

  }

}

function getAudiotracks(filename, filepath) {
  console.log('Note: The audioTracks property is not supported in any major browsers. :( Maybe later..')
  console.log('Check support: videoplayer.audioTracks ==> ' + videoplayer.audioTracks)
  /* if (videoplayer.audioTracks.length > 1) {
      for (let i = 0; i < videoplayer.audioTracks.length ; i++) {
          if (videoplayer.audioTracks[i].language == "en-gb") {
            videoplayer.audioTracks[i].enabled = true;
          }
          else {
            videoplayer.audioTracks[i].enabled = false;
          }
      }
  } */

}

function changeAudioTrack() {
  setToast('Not supported yet! :(');
}

function getAudioEncoding(mkvpath) {

  ffmpeg.ffprobe(mkvpath, function(err, metadata) {

    let streams = metadata.streams.length;

    for (let i = 0; i < streams; i++) {

      if (metadata.streams[i].codec_type === 'audio') {

        if (metadata.streams[i].codec_name === 'ac3') {
          console.log('Note: The ac3 codec is not supported in html5 videoplayers. :( Maybe later..')
          document.getElementById("aacconvertspan").setAttribute("data", mkvpath); 
          document.getElementById("aacconvertspan").setAttribute("onclick", "convert2AAC();");
          w3.show("#aacconvertspan");
          w3.show("#aacconvertspanclose");
          break;
        }

      }

    }

  });

}
