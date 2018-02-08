module.exports = {
  toggleShowPlaylist,
  fillPlaylist,
  addToPlaylist,
  savePlaylist,
  readPlaylistFile
};

function toggleShowPlaylist() {

  let isPlaylistVisible = playlist.style.display;

  if (isPlaylistVisible === "" || isPlaylistVisible === "block") {

    playlist.style.display = 'none';
    videoplayer.style.width = '100%';
    w3.removeClass('#playlistbutton','activated');
    store.set('settings.showplaylist', false);
    setToast(i18n.__('playlist') + ' ' + i18n.__('off'));

  } else {

    playlist.style.display = 'block';
    videoplayer.style.width = '60%';
    w3.addClass('#playlistbutton','activated');
    store.set('settings.showplaylist', true);
    setToast(i18n.__('playlist') + ' ' + i18n.__('on'));

  }

}

function fillPlaylist() {

  playlistfile.find({}, function(err, docs) {
    docs.forEach(function(d) {
  
      let playlistLI = document.createElement("li");
      playlistLI.appendChild(document.createTextNode(d._name));
      playlistLI.setAttribute("id", "vid-" + d._id);
      playlistLI.setAttribute("class", "vidlink");
      playlistLI.setAttribute("onclick", "playerjs.playVideo(" + d._id + ");");
      playlist.appendChild(playlistLI);

    });

    if (store.has('lastplayed.videoid') && store.has('lastplayed.videotime')) {
      
      let lastPlayed = store.get('lastplayed.videoid');
      let lastPlayedTime = store.get('lastplayed.videotime');
      
      playerjs.playVideo(lastPlayed);
      videoplayer.currentTime = lastPlayedTime;

    }

  });

}
fillPlaylist();

function addToPlaylist(newvideos) {

  playlistfile.insert(newvideos, function(err, docs) {
    docs.forEach(function(d) {

      console.log('Added file:', d._name);

      let playlistLI = document.createElement("li");
      playlistLI.appendChild(document.createTextNode(d._name));
      playlistLI.setAttribute("id", "vid-" + d._id);
      playlistLI.setAttribute("class", "vidlink");
      playlistLI.setAttribute("onclick", "playerjs.playVideo(" + d._id + ");");
      playlist.appendChild(playlistLI);

    });
  });

}

function savePlaylist() {

  let playlistString = '';

  playlistfile.find({}, function(err, docs) {
    docs.forEach(function(d) {

      playlistString += d._name + '*' + d._path + '\n';

    });
  });

  dialog.showSaveDialog((fileName) => {
    filters: [{
      name: 'PhreshPlayer playlist file',
      extensions: ['.pppl']
    }]

    if (fileName === undefined){
      alert(i18n.__('file_not_saved') + "!");
      return;
    }

    let isPPPLExt = fileName.slice(-5);
    if (isPPPLExt == '.pppl') {
      // overwrite an existing
      fileName = fileName.slice(0, -5);
    }

    fs.writeFile(fileName + '.pppl', playlistString, (err) => {
      if(err){
        alert(i18n.__('file_save_failed') + err.message)
      }
      /* alert(i18n.__('file_saved') + "!"); */
      setToast(i18n.__('file_saved') + '!');
    });

  });

}

function readPlaylistFile(playlistfilepath) {

  let readline = require('readline'),
      instream = fs.createReadStream(playlistfilepath),
      outstream = new (require('stream'))(),
      rl = readline.createInterface(instream, outstream);
  
  let newid2 = playlist.getElementsByTagName('li').length;
  let newvideos2 = [];

  rl.on('line', function (line) {
      
    let lineparts = line.split('*');
    let filename2 = lineparts[0];
    let filepath2 = lineparts[1];

    newid2++;

    let newvideo2 = {
      _id: newid2,
      _name: filename2,
      _path: filepath2
    };

    newvideos2.push(newvideo2);

  });

  rl.on('close', function (line) {console.log(newvideos2)
    addToPlaylist(newvideos2);
  });

}


ipcRenderer.send('gimme-openedfile');

ipcRenderer.on('openedfile', (event, openedfile) => {

  if (openedfile !== null && openedfile !== '.') {

    let openedFilePath = openedfile;
    let openedFileName = path.basename(openedfile);
    let openedFileExt = path.extname(openedfile);
              
    if (openedFileExt === '.pppl') {
      
      playlistfile.remove({}, { multi: true }, function (err, numRemoved) {
        playlist.innerHTML = '';
        readPlaylistFile(openedFilePath);
        setTimeout(function(){ playerjs.playVideo(1); }, 500);
      });

    } else {

      /* mp4, mkv, etc => if associated to the player */
      if ( supportedFileExts.indexOf(openedFileExt) !== -1 ) {

        playlistfile.remove({}, { multi: true }, function (err, numRemoved) {
          playlist.innerHTML = '';
          let newvideos = [];

          let newvideo = {
            _id: 1,
            _name: openedFileName,
            _path: openedFilePath
          };
          newvideos.push(newvideo);
  
          addToPlaylist(newvideos);

          setTimeout(function(){ playerjs.playVideo(1); }, 500);
        });

      }

    }

  }

});
