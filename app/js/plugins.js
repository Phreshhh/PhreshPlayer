module.exports = {
  syncPluginsInfo,
  updatePluginInfo,
  updatePluginInstalledInfo,
  updatePluginUpdatedInfo,
  updatePluginEnabledInfo,
  getPluginsInfo,
  installPlugin,
  deletePlugin,
  updatePlugin,
  loadPlugins
};

fse.ensureDirSync(pluginsDir);

/* Sync plugins */

let serverPluginsArr = [];

function syncPluginsInfo() {

  return new Promise( (resolve, reject) => {

    request("http://phresh-it.hu/old/apps/phreshplayer/plugins/plugins.json", function(error, response, body) {
      console.log('Server plugin info check error: '+ error);
      console.log('Server plugin request statuscode:'+ response.statusCode);
      console.log('Server plugin request response: ');
      console.log(response);
      
      let avilablePluginsObj = JSON.parse(body);

      for ( let PhreshPlayerPlugins in avilablePluginsObj ) {

        avilablePluginsObj[PhreshPlayerPlugins].forEach(serverpluginObj => {

          let syncedpluginObj = {
            "name": serverpluginObj.name,
            "productName": serverpluginObj.productName,
            "version": serverpluginObj.version,
            "description": serverpluginObj.description,
            "homepage": serverpluginObj.homepage,
            "author": serverpluginObj.author,
            "copyright": serverpluginObj.copyright,
            "license": serverpluginObj.license,
            "repository": serverpluginObj.repository,
            "dependencies": serverpluginObj.dependencies,
            "download": serverpluginObj.download,
          };

          serverPluginsArr.push(syncedpluginObj);

          updatePluginInfo(serverpluginObj.name, syncedpluginObj)
          .then( (pluginInfoResult) => {
            console.log(pluginInfoResult);
            resolve();
          });

        });

      }

    });

  });
}

function updatePluginInfo(pluginname, syncedpluginObj) {

  return new Promise( (resolve, reject) => {

    pluginsfile.find({name: pluginname}).exec(function (err, docs) {
      docs.forEach(function(d) {

        // check is installed
        let pluginIsInstalled = fse.pathExistsSync(path.join(pluginsDir, pluginname, 'index.js'));

        let pluginVersion = d.version;
        if (pluginIsInstalled) {
          pluginVersion = d.version;
          // check is up to date
          if (d.version !== syncedpluginObj.version) {
            updatePluginUpdatedInfo(d.name, false);
          }
        } else {
          pluginVersion = syncedpluginObj.version;
        }

        pluginsfile.update({ name: pluginname }, {
          $set: {
            "name": syncedpluginObj.name,
            "productName": syncedpluginObj.productName,
            "version": pluginVersion,
            "description": syncedpluginObj.description,
            "homepage": syncedpluginObj.homepage,
            "author": syncedpluginObj.author,
            "copyright": syncedpluginObj.copyright,
            "license": syncedpluginObj.license,
            "repository": syncedpluginObj.repository,
            "dependencies": syncedpluginObj.dependencies,
            "download": syncedpluginObj.download
          }
        }, function (err, numReplaced) {
          resolve(syncedpluginObj.productName + " plugin info updated.");
        });

      });

      if (docs.length === 0) {
        // new plugin
        
        syncedpluginObj["installed"] = false;
        syncedpluginObj["updated"] = false;
        syncedpluginObj["enabled"] = false;

        pluginsfile.insert(syncedpluginObj, function(err, docs) {
          resolve(syncedpluginObj.productName + " plugin info inserted.");
        });
      }

    });

  });

}

function updatePluginInstalledInfo(pluginname, installedInfo) {

  return new Promise( (resolve, reject) => {

    pluginsfile.find({name: pluginname}).exec(function (err, docs) {
      docs.forEach(function(d) {

        pluginsfile.update({ name: pluginname }, {
          $set: {
            "installed": installedInfo
          }
        }, function (err, numReplaced) {
          console.log(pluginname + " installed: " + installedInfo);
          resolve();
        });

      });

    });

  });

}
function updatePluginUpdatedInfo(pluginname, updatedInfo) {

  return new Promise( (resolve, reject) => {

    pluginsfile.find({name: pluginname}).exec(function (err, docs) {
      docs.forEach(function(d) {

        pluginsfile.update({ name: pluginname }, {
          $set: {
            "updated": updatedInfo
          }
        }, function (err, numReplaced) {
          console.log(pluginname + " updated: " + updatedInfo);
          resolve();
        });

      });

    });

  });

}
function updatePluginEnabledInfo(pluginname, enabledInfo) {

  return new Promise( (resolve, reject) => {
    
    pluginsfile.find({name: pluginname}).exec(function (err, docs) {
      docs.forEach(function(d) {

        pluginsfile.update({ name: pluginname }, {
          $set: {
            "enabled": enabledInfo
          }
        }, function (err, numReplaced) {
          loadPlugins();
          if (enabledInfo) {
            console.log(pluginname + " enabled.");
            resolve();
          } else {
            console.log(pluginname + " disabled.");
            resolve();
          }
        });

      });

    });

  });

}

function getPluginsInfo() {

  return new Promise( (resolve, reject) => {

    pluginsmodalcontent.innerHTML = '';

    pluginsfile.find({}).sort({ name: 1 }).exec(function (err, docs) {
      docs.forEach(function(d) {

        let installIcon = "";
        let updateIcon = "";
        let enabledIcon = ""; // disabled too
        let deleteIcon = "";

        if (d.installed) {
          
          if (d.enabled) {

            enabledIcon = `
            <div class="w3-right">
              <a class="clickable" onclick="pluginsjs.updatePluginEnabledInfo('` + d.name + `', false);setTimeout(function() { pluginsjs.getPluginsInfo(); }, 300);">
                <i class="fa fa-thumbs-down w3-tooltip">
                  <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom">` + i18n.__('disable') + `</span>
                </i>
              </a>
            </div>
            `;

          } else {

            enabledIcon = `
            <div class="w3-right">
              <a class="clickable" onclick="pluginsjs.updatePluginEnabledInfo('` + d.name + `', true);setTimeout(function() { pluginsjs.getPluginsInfo(); }, 300);">
                <i class="fa fa-thumbs-up w3-tooltip">
                  <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom">` + i18n.__('enable') + `</span>
                </i>
              </a>
            </div>
            `;

          }

          if (!d.updated) {
            
            updateIcon = `
            <div class="w3-right">
              <a class="clickable" onclick="pluginsjs.updatePlugin('` + d.name + `');">
                <i class="fa fa-refresh w3-tooltip">
                  <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom">` + i18n.__('update') + `</span>
                </i>
              </a>
            </div>
            `;

          }
          /* installIcon = ""; */
          deleteIcon = `
          <div class="w3-right">
            <a class="clickable" onclick="pluginsjs.deletePlugin('` + d.name + `');">
              <i class="fa fa-times w3-tooltip">
                <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom">` + i18n.__('delete') + `</span>
              </i>
            </a>
          </div>
          `;

        } else {

          /* updateIcon = ""; */
          installIcon = `
          <div class="w3-right">
            <a class="clickable" onclick="pluginsjs.installPlugin('` + d.name + `');">
              <i class="fa fa-download w3-tooltip">
                <span class="w3-text w3-tag w3-tooltip-absolute w3-round-large w3-animate-zoom">` + i18n.__('install') + `</span>
              </i>
            </a>
          </div>
          `;

        }

        let pluginInfoBox = `
        <div id="plugininfobox-` + d.name + `" class="w3-panel w3-round w3-light-grey plugininfobox">
          <p>` + d.productName + ` v` + d.version + ` - ` + d.author + `</p>
          <p>` + d.description + `</p>
          <p>Homepage: <a class="clickable" onclick="openExternalLink('` + d.homepage + `');">` + d.homepage + `</a></p>
          <p>Repository: <a class="clickable" onclick="openExternalLink('` + d.repository + `');">` + d.repository + `</a></p>
          <p>Copyright: ` + d.copyright + `, licence: ` + d.license + `</p>
          <div class="w3-row">

            ` + deleteIcon + `
            ` + enabledIcon + `
            ` + updateIcon + `
            ` + installIcon + `
          
          </div>

        </div>`;

        pluginsmodalcontent.innerHTML += pluginInfoBox;

      });

      resolve();
    });

  });

}

function installPlugin(pluginname) {

  return new Promise( (resolve, reject) => {

    loadingoverlay.classList.remove("closedoverlay");
    loadingoverlay.classList.add("openedoverlay");

    let pluginDir = path.join(pluginsDir,pluginname);
    fse.ensureDirSync(pluginDir);

    pluginsfile.find({name: pluginname}).limit(1).exec(function (err, docs) {
  
      docs.forEach(function(d) {
        
        let pluginZipFilePath = path.join(pluginDir, pluginname + ".zip");
        let pluginZipFile = fse.createWriteStream(pluginZipFilePath);
        http.get(d.download, function(response) {
          
          response.pipe(pluginZipFile);
          fse.createReadStream(pluginZipFilePath)
          .pipe(
            unzipper.Extract({ path: pluginDir })
          )

          /* install plugin npm packages .. */
          
          if (Object.entries(d.dependencies).length !== 0 && d.dependencies.constructor === Object) {
            
            let pluginDepenciesListArr = [];
          
            Object.entries(d.dependencies).forEach(([pluginPackageName, pluginPackageVersion]) => {
    
              let pluginDepenciesListObj =  {
                name: pluginPackageName,
                version: pluginPackageVersion
              }
              pluginDepenciesListArr.push(pluginDepenciesListObj);

            });

            co(function* () {
              yield npminstall({
                // install root dir
                root: process.cwd(),
                // optional packages need to install, default is package.json's dependencies and devDependencies
                // pkgs: [
                //   { name: 'foo', version: '~1.0.0' },
                // ],
                // install to specific directory, default to root
                // targetDir: '/home/admin/.global/lib',
                // link bin to specific directory (for global install)
                // binDir: '/home/admin/.global/bin',
                // registry, default is https://registry.npmjs.org
                // registry: 'https://registry.npmjs.org',
                // debug: false,
                // storeDir: root + 'node_modules',
                // ignoreScripts: true, // ignore pre/post install scripts, default is `false`
                // forbiddenLicenses: forbit install packages which used these licenses
                pkgs: pluginDepenciesListArr,
                targetDir: pluginDir.toString(),
              });
            }).catch(err => {
              console.error(err.stack);
            })
            .then ( () => {
              fse.removeSync(pluginZipFilePath);
              updatePluginUpdatedInfo(pluginname, true);
              updatePluginInstalledInfo(pluginname, true);
              console.log("Plugin install finished.");
              setTimeout ( () => {
                loadingoverlay.classList.remove("openedoverlay");
                loadingoverlay.classList.add("closedoverlay");
                getPluginsInfo();
              }, 1000);
              resolve();
            });

          } else {
            fse.removeSync(pluginZipFilePath);
            updatePluginUpdatedInfo(pluginname, true);
            updatePluginInstalledInfo(pluginname, true);
            console.log("Plugin install finished.");
            setTimeout ( () => {
              loadingoverlay.classList.remove("openedoverlay");
              loadingoverlay.classList.add("closedoverlay");
              getPluginsInfo();
            }, 1000);
            resolve();
          }

        });

      });
  
    });

  });

}

function deletePlugin(pluginname) {

  return new Promise( (resolve, reject) => {

    loadingoverlay.classList.remove("closedoverlay");
    loadingoverlay.classList.add("openedoverlay");
    fse.removeSync(pluginsDir + "/" + pluginname);
    updatePluginInstalledInfo(pluginname, false);
    updatePluginUpdatedInfo(pluginname, false);
    updatePluginEnabledInfo(pluginname, false);
    console.log("Plugin uninstall finished.");
    setTimeout ( () => {
      loadingoverlay.classList.remove("openedoverlay");
      loadingoverlay.classList.add("closedoverlay");
      getPluginsInfo();
    }, 1000);
    resolve();

  });

}

function updatePlugin(pluginname) {

  return new Promise( (resolve, reject) => {

    w3.removeClass('#loadingoverlay','closedoverlay');
    w3.addClass('#loadingoverlay','openedoverlay');

    deletePlugin(pluginname)
    .then( () => {
      installPlugin(pluginname)
    })
    .then( () => {
      syncPluginsInfo()
    })
    .then( () => {
      getPluginsInfo()
    })
    .then( () => {
      loadPlugins()
    });

  });

}

function loadPlugins() {

  return new Promise( (resolve, reject) => {

    pluginsfile.find({installed: true, enabled: true}).exec(function (err, docs) {
      docs.forEach(function(d) {

        let pluginIndexJS = path.join(pluginsDir, d.name, 'index.js');
        window[d.name + 'js'] = require(pluginIndexJS);
        console.log(d.name + " loaded");
        
      });
      resolve();
    });

  });

}

loadPlugins();
