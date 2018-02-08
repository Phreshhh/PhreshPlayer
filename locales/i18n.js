const electron = require('electron');
const {remote} = require('electron');
const path = require("path");
const fs = require('fs');
const Store = require('electron-store');
const store = new Store();

let loadedLanguage;
let storedLanguage;

if (store.has('settings.language')) {
  storedLanguage = store.get('settings.language');
} else {
  store.set('settings.language', 'en');
  storedLanguage = 'en';
}

let app = electron.app ? electron.app : electron.remote.app;

module.exports = i18n;

function i18n() {

  if (storedLanguage !== undefined && storedLanguage !== "") {

    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, storedLanguage + '.json'), 'utf8'));

  } else {

    if(fs.existsSync(path.join(__dirname, app.getLocale() + '.json'))) {
      loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, app.getLocale() + '.json'), 'utf8'));
    }
    else {
      loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, 'en.json'), 'utf8'));
    }

  }


}

i18n.prototype.__ = function(phrase) {
	let translation = loadedLanguage[phrase];
  if(translation === undefined) {
    translation = phrase;
  }
	return translation;
}
