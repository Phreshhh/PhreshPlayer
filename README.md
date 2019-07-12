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

### Planned features
- [ ] Subtitles customizer (position, font size, font weight)
- [ ] Subtitles sync (earlier, later, default)
- [ ] 3D Stereo Effect

## Changelog v1.1.2

#### Changes
- [x] logos and icons changed - Thanks [Hernán Hernández](https://github.com/doblehachege) for [Issue 1](https://github.com/Phreshhh/PhreshPlayer/issues/1)and [LOGO PROPOSAL FOR PHRESH PLAYER](https://busy.org/@callmeh/logo-proposal-for-phresh-player)
- [x] video conversion moved into plugin ~ [less installation space](#less-installation-space)
- [x] open devtools moved into plugin
#### New Features
- [x] control panel pin
- [x] search in playlist
- [x] delete from playlist
- [x] theme selector with 4 starter theme (Phresh, Cobalt, Full Metal, Hello Kitty)
#### Bugfixes
- [x] toasts visible on fullscreen also from now
- [x] fullscreen icon states fixed in control panel
- [x] unnecessary disk usage removed: 'remember playtime' save only on quit from now - Thanks for [abdulmoizhussain](https://github.com/abdulmoizhussain) for [Issue 2](https://github.com/Phreshhh/PhreshPlayer/issues/2)
- [x] hide cursor everywhere on idle/playing

## A feature though! (Moved into plugin: FFMPEG Video Converter)

Still I see today '.avi' and '.wmv' files, so..

.. if you drop an (or more) '.avi' or '.wmv' file into the player,
then convert files to '.mp4' automatically (and add it to playlist also automatically after conversion).

**WARNING! High CPU usage while converting.**

The conversion unfortunately work only Linux and Windows. As far as I know, not works on MacOS and the CPU limit works on Linux only.

### Supported file types
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
[PhreshPlayer v1.0.0](https://github.com/Phreshhh/phreshplayer/releases/tag/v1.0.0)

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

### Remember: Keep It Simple
#### Features what i never build in (but if you want, you can make it in a plugin format)
- open file or folder menu (drag 'n drop included)
- delete playlist menu (drag 'n drop included)
- equalizer
- Normalizer
- video, audio speed change (faster, slower)
- subtitle explorer (the subtitles of same name with video is automatically loaded)
- presetted widow sizes (you can resize free and this size is saved)
- video ratio changer (this setting automatically too)

[Suggestion Addition Menu & Features in The Application PhreshPlayer](https://steemit.com/utopian-io/@saputra.ridho/suggestion-addition-menu-and-features-in-the-application-phreshplayer)

[Add Search Feature And Some Improvement To PhreshPlayer](https://steemit.com/utopian-io/@fajrikhairul/add-search-feature-and-some-improvement-to-phreshplayer)

### Reviews

> Bored of your current media player or just looking to try out a new one that works on all major OSes? If that's the case, you might want to consider giving PhreshPlayer a quick run-through.
Offers support for a wide array of media formats

>Right off the bat, we're going to say that this is not your typical full-featured media player. Instead, the application aims to deliver a set of typical and useful features in a very intuitive manner.

>We'll start off with one of its most useful features namely the fact that it comes with support for some of the most popular media formats out there such as MP4, MKV, WEBM, M4V, OGG, MOV, MP3, and FLAC.

>Even more interesting is the fact that if you happen to load files with other types of formats (let's say AVI or WMW), the utility automatically converts the files to MP4 and adds subsequently adds them to the playlist.
Intuitive and straightforward controls

>It also comes with support for a wide array of keyboard shortcuts and various mouse actions/events. For instance, you can quickly toggle the playlist by pressing the L key, fullscreen with F, mute with M, increase and decrease volume using the up and down arrows, and seek intervals of 5 seconds forward and backwards using the right and left arrows, just to name a few.

>There's also a right-click menu that allows you to toggle the fullscreen, the playlist, the always on top, and the subtitles on or off. You're also provided with the possibility to change the languages for both the GUI and the subtitles.
Good-looking, smooth-running, intuitive media player that only has one major drawback

>Taking everything into account, PhreshPlayer is a nice media player that is mostly aimed at users who prefer their media player to be on the minimalist side of things. It's also rather good-looking with its black-themed GUI, easy to install, and even easier to work with.
<a name="less-installation-space"></a>
>However, just like most other Electron-based apps, it does have one somewhat noteworthy disadvantage. Typing the scales at just about under 500 MB as tested (version 1.0.0), this is one very bulky media player, especially if you consider its minimalist feature set.

*Vladimir Ciobica*
