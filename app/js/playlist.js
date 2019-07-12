module.exports = {
  toggleShowPlaylist,
  fillPlaylist,
  searchInPlaylist,
  addToPlaylist,
  savePlaylist,
  readPlaylistFile,
  deleteVideo
};

function toggleShowPlaylist() {

  let isPlaylistVisible = playlist.style.display;

  if (isPlaylistVisible === "" || isPlaylistVisible === "block") {

    searchinplaylist.style.display = 'none';
    searchinplaylisticon.style.display = 'none';
    playlist.style.display = 'none';
    videoplayer.style.width = '100%';
    w3.removeClass('#playlistbutton','activated');
    store.set('settings.showplaylist', false);
    setToast(i18n.__('playlist') + ' ' + i18n.__('off'));

  } else {

    searchinplaylist.style.display = 'block';
    searchinplaylisticon.style.display = 'block';
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
      let playlistLI_videoOpenA = document.createElement("a");
      let playlistLI_videoDeleteI = document.createElement("i");

      playlistLI.setAttribute("id", "vid-li-" + d._id);

      playlistLI_videoDeleteI.setAttribute("id", "vid-x-" + d._id);
      playlistLI_videoDeleteI.setAttribute("class", "fa fa-close clickable deletefromlistlink");
      playlistLI_videoDeleteI.setAttribute("onclick", "playlistjs.deleteVideo(" + d._id + ");");

      playlistLI_videoOpenA.appendChild(document.createTextNode(d._name));
      playlistLI_videoOpenA.setAttribute("id", "vid-" + d._id);
      playlistLI_videoOpenA.setAttribute("class", "vidlink");
      playlistLI_videoOpenA.setAttribute("onclick", "playerjs.playVideo(" + d._id + ");");

      playlistLI.appendChild(playlistLI_videoDeleteI);
      playlistLI.appendChild(playlistLI_videoOpenA);
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

function searchInPlaylist(searchedText) {

  playlist.innerHTML = '';

  if (searchedText === '') {

    playlistfile.find({}, function(err, docs) {
      docs.forEach(function(d) {
    
        let playlistLI = document.createElement("li");
        let playlistLI_videoOpenA = document.createElement("a");
        let playlistLI_videoDeleteI = document.createElement("i");
  
        playlistLI.setAttribute("id", "vid-li-" + d._id);
  
        playlistLI_videoDeleteI.setAttribute("id", "vid-x-" + d._id);
        playlistLI_videoDeleteI.setAttribute("class", "fa fa-close clickable deletefromlistlink");
        playlistLI_videoDeleteI.setAttribute("onclick", "playlistjs.deleteVideo(" + d._id + ");");
  
        playlistLI_videoOpenA.appendChild(document.createTextNode(d._name));
        playlistLI_videoOpenA.setAttribute("id", "vid-" + d._id);
        playlistLI_videoOpenA.setAttribute("class", "vidlink");
        playlistLI_videoOpenA.setAttribute("onclick", "playerjs.playVideo(" + d._id + ");");
  
        playlistLI.appendChild(playlistLI_videoDeleteI);
        playlistLI.appendChild(playlistLI_videoOpenA);
        playlist.appendChild(playlistLI);
  
      });
  
    });

  } else {

    let searchedTextRegExp = new RegExp(".*"+searchedText+".*");

    playlistfile.find({ _name: {$regex : searchedTextRegExp} }).exec(function (err, docs) {
      docs.forEach(function(d) {
  
        let playlistLI = document.createElement("li");
        let playlistLI_videoOpenA = document.createElement("a");
        let playlistLI_videoDeleteI = document.createElement("i");

        playlistLI.setAttribute("id", "vid-li-" + d._id);

        playlistLI_videoDeleteI.setAttribute("id", "vid-x-" + d._id);
        playlistLI_videoDeleteI.setAttribute("class", "fa fa-close clickable deletefromlistlink");
        playlistLI_videoDeleteI.setAttribute("onclick", "playlistjs.deleteVideo(" + d._id + ");");

        playlistLI_videoOpenA.appendChild(document.createTextNode(d._name));
        playlistLI_videoOpenA.setAttribute("id", "vid-" + d._id);
        playlistLI_videoOpenA.setAttribute("class", "vidlink");
        playlistLI_videoOpenA.setAttribute("onclick", "playerjs.playVideo(" + d._id + ");");

        playlistLI.appendChild(playlistLI_videoDeleteI);
        playlistLI.appendChild(playlistLI_videoOpenA);
        playlist.appendChild(playlistLI);
  
      });
    });

  }

}

function addToPlaylist(newvideos) {

  playlistfile.insert(newvideos, function(err, docs) {
    docs.forEach(function(d) {

      console.log('Added file:', d._name);

      let playlistLI = document.createElement("li");
      let playlistLI_videoOpenA = document.createElement("a");
      let playlistLI_videoDeleteI = document.createElement("i");

      playlistLI.setAttribute("id", "vid-li-" + d._id);

      playlistLI_videoDeleteI.setAttribute("id", "vid-x-" + d._id);
      playlistLI_videoDeleteI.setAttribute("class", "fa fa-close clickable deletefromlistlink");
      playlistLI_videoDeleteI.setAttribute("onclick", "playlistjs.deleteVideo(" + d._id + ");");

      playlistLI_videoOpenA.appendChild(document.createTextNode(d._name));
      playlistLI_videoOpenA.setAttribute("id", "vid-" + d._id);
      playlistLI_videoOpenA.setAttribute("class", "vidlink");
      playlistLI_videoOpenA.setAttribute("onclick", "playerjs.playVideo(" + d._id + ");");

      playlistLI.appendChild(playlistLI_videoDeleteI);
      playlistLI.appendChild(playlistLI_videoOpenA);
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

    fse.writeFile(fileName + '.pppl', playlistString, (err) => {
      if(err){
        alert(i18n.__('file_save_failed') + err.message)
      }
      setToast(i18n.__('file_saved') + '!');
    });

  });

}

function readPlaylistFile(playlistfilepath) {

  let readline = require('readline'),
      instream = fse.createReadStream(playlistfilepath),
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

function deleteVideo(videoID) {

  playlistfile.remove({ _id: videoID }, function(err, numDeleted) {
    document.getElementById('vid-li-' + videoID).outerHTML = '';
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
