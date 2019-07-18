# Phreshplayer

Inspired by <a href="https://mpv.io/" target="_blank">mpv</a> player (with old hud) - I'm really liked it.. :( and <a href="https://potplayer.daum.net/" target="_blank">PotPlayer</a>.

Developed using <a href="https://electronjs.org/" target="_blank">Electron</a>.

**Keep It Simple!**

I'm sick of so much bullsh.t features in modern mediaplayers like kmp, vlc, etc.
Filters, useless view modes and more..

At last time I used PotPlayer but at this time is overhyped too.

The lot of extra features is it would be awesome, but finaly the program can't do that normally what it created first.
So I make my own..

I don't planning more features to the updates (exept audioTrack support/changes if will supported..), only neccessary bug fixes.

The Phresh media player is a simple and intuitive desktop app for Windows, Mac and Linux. It plays media files.. end of story.

In turn, I pays great attention to the naturality, easy and clear usage with much (and usual) keyboard shortcuts and some mouse gestures.

The player has an right click menu also for more powerful support the handling.

PhreshPlayer knows read the '.srt' subtitles also, only '.srt'. The '.sub' files not supported.

## Changelog

<a href="https://github.com/Phreshhh/phreshplayer/blob/master/CHANGELOG.md" target="_blank">Changes & Version history</a>.

## New features

For new features, please check the player plugins: <a href="https://github.com/Phreshhh/PhreshPlayer-plugins" target="_blank">PhreshPlayer plugins</a>.

### Supported file types (extendable with plugin)
- mp4
- webm
- mkv (aac audio only. ac3 not, but you can convert to aac)
- m4v
- ogg (ogv)
- mov
- mp3
- flac

### Shortcuts

|key|action|
|---|---|
|l|toggle (show/hide) playlist|
|f|toggle fullscreen|
|enter|toggle fullscreen|
|esc|exit fullscreen|
|m|toggle mute|
|up|volume increase|
|down|volume decrease|
|left|seek -5 sec|
|right|seek +5 sec|
|p|previous video|
|b|previous video|
|n|next video|
|space|toggle play/pause|
|t|toggle always on top|
|q|quit|

### Mouse events

|event|action|
|---|---|
|mouse move|show controls (auto hide after 1 sec)|
|leave cursor on controls box|show controls (still visible)|
|left doubleclick|toggle fullscreen|
|scroll up|volume increase|
|scroll down|volume decrease|
|left click on progressbar|seek to the point|
|right click|menu open|

### File/Folder drops

|place|action|
|---|---|
|videoplayer area|clear actual playlist, and refill with the new files|
|playlist area|append files to the actual playlist|

The application can read folders also, but just 1 level deep:
- .
- ..
- Folder
  - Folder2
    - file level 3
  - file level 2
  - file2 level 2


- file  level 1
- file2 level 1

level 1 and level 2 files will append also to the playlist if you drop in at the same time, but  level 3 file in Folder2 won't.

### 'Sorry bro, no mana..'

The electron (and the original too) Chromium/Chrome currently not support multi audio tracks in html 5 video players, so the language change unavilable yet in multi language videos.. :(

*Unfortunately I can't test on MacOS, so if you want better support for Mac, buy me a MacBook.. :D .. Or write to me the problems and deficiency what you found and i'll try to fix it.*

## Screenshots

<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/1_player-only.jpg" width="400" alt="PhreshPlayer">
<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/2_player+controlbox+tooltip+toast.jpg" width="400" alt="Player, Controlbox, Tooltip, Notify">
<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/3_play-video.jpg" width="400" alt="Playing video">
<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/4_subtitles.jpg" width="400" alt="Show subtitle">
<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/5_rightclickmenu.jpg" width="400" alt="Right click menu">
<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/6_convert-while-playing.jpg" width="400" alt="Convert video (while playing other)">
<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/7_still-converting-after-close-modal.jpg" width="400" alt="Still converting (after modal closed)">
<img src="https://github.com/Phreshhh/phreshplayer/blob/master/screenshots/8_after-conversion-play-video.jpg" width="400" alt="After conversion (auto add to playlist and) play the video">

## Licence
Copyright (c) 2018, Krisztián Kis - Phresh-IT. All rights reserved.

Licensed under the [MIT](https://github.com/Phreshhh/phreshplayer/blob/master/LICENSE.md) License.

## Builds
[PhreshPlayer v1.1.3](https://github.com/Phreshhh/PhreshPlayer/releases/tag/v1.1.3)

## Web

<a href="https://phresh-it.hu/" target="_blank">Phresh-IT</a>

<a href="https://phresh-it.hu/apps/phreshplayer/" target="_blank">PhreshPlayer</a>

## Dev

Clone or download the repo and navigate in console to the program's root folder.

### Install

```
npm install
```

### Run

```
npm start
```

### Build

```
npm run dist
```

### Support

If you like my work(s), please buy me a coffee or support/donate me. Contributions, issues(problems, ideas) and [donates](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=L3HSBGM4JTKEL&source=url) are welcome.

Thank you, Have a nice day!