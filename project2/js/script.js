var videosArray = [];
var videoObject = {};

// Create video objects and add them to videos array
videoObject = {
    title: "Elephants Dream",
    sources: [
        {
            src: "https://dl.dropboxusercontent.com/s/vtsoa1yunhivgaq/elephants-dream-medium.mp4?dl=1",
            type: "video/mp4"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/9mg11dpy5r3jt6l/elephants-dream-medium.webm?dl=1",
            type: "video/webm"
        }
    ],
    tracks: [
        {
            src: "https://dl.dropboxusercontent.com/s/zxli50ldo11s589/elephants-dream-subtitles-en.vtt?dl=1",
            label: "English subtitles",
            kind: "subtitles",
            srclang: "en"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/i9bq4knn8b36rvy/elephants-dream-subtitles-de.vtt?dl=1",
            label: "Deutsch subtitles",
            kind: "subtitles",
            srclang: "de"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/3aj6pcv35ozz0jm/elephants-dream-chapters-en.vtt?dl=1",
            label: "English chapters",
            kind: "chapters",
            srclang: "en"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/yhb9w3u5czof442/elephants-dream-chapters-fr.vtt?dl=1",
            label: "French chapters",
            kind: "chapters",
            srclang: "fr"
        }
    ],
    chapters: [
        "https://dl.dropboxusercontent.com/s/6ra4xa1425qgsai/introduction%28chapter-1%29.jpg?dl=1",
        "https://dl.dropboxusercontent.com/s/dms1utoon7tm35u/watchOut%28chapter-2%29.jpg?dl=1",
        "https://dl.dropboxusercontent.com/s/bs0c5ts3d1ck092/letsgo%28chapter-3%29.jpg?dl=1",
        "https://dl.dropboxusercontent.com/s/cvfk0op9102vpyt/themachine%28chapter-4%29.jpg?dl=1",
        "https://dl.dropboxusercontent.com/s/bofs32545upfw14/closeYourEyes%28chapter-5%29.jpg?dl=1",
        "https://dl.dropboxusercontent.com/s/8m1bhgco6b0cn3g/thereIsNothingThere%28chapter-6%29.jpg?dl=1",
        "https://dl.dropboxusercontent.com/s/ge1mzk2b4hjzpfu/theColossusOfRhodes%28chapter-7%29.jpg?dl=1"
    ]
};
videosArray.push(videoObject);
videoObject = {
    title: "Sintel",
    sources: [
        {
            src: "http://peach.themazzone.com/durian/movies/sintel-1024-surround.mp4",
            type: "video/mp4"
        }
    ],
    tracks: [
        {
            src: "https://dl.dropboxusercontent.com/s/1ubdhqaopg34tt5/sintel_en.vtt?dl=1",
            label: "English subtitles",
            kind: "subtitles",
            srclang: "en"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/zh3e9me4w12huiq/sintel_de.vtt?dl=1",
            label: "Deutsch subtitles",
            kind: "subtitles",
            srclang: "de"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/vytq0x5dtw6fapd/sintel_es.vtt?dl=1",
            label: "Spanish subtitles",
            kind: "subtitles",
            srclang: "es"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/6n76jp32h9pz4c4/sintel_fr.vtt?dl=1",
            label: "French subtitles",
            kind: "subtitles",
            srclang: "fr"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/wn2iitpdo09ryrh/sintel_it.vtt?dl=1",
            label: "Italian subtitles",
            kind: "subtitles",
            srclang: "it"
        },
        {
            src: "https://dl.dropboxusercontent.com/s/br4y8pajx8i3rze/sintel_ru.vtt?dl=1",
            label: "Russian subtitles",
            kind: "subtitles",
            srclang: "ru"
        }
    ],
    chapters: []
};
videosArray.push(videoObject);
videoObject = {
    title: "Caminades 3",
    sources: [
        {
            src: "http://www.caminandes.com/download/03_caminandes_llamigos_1080p.mp4",
            type: "video/mp4"
        }
    ],
    tracks: [],
    chapters: []
};
videosArray.push(videoObject);
videoObject = {
    title: "Big Buck Bunny",
    sources: [
        {
            src: "https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg",
            type: "video/ogg"
        }
    ],
    tracks: [],
    chapters: []
};
videosArray.push(videoObject);

// make video element global
var videoElement;
var currentVideoIndex = 0;
var currentChapterIndex = -1;
var currentActiveChapter = -1;
var playing = false;
var videoVolume = 0.5;
var videoRandom = false;
var randomArray;
var videoLoop = "N";

window.onload = init;

function init() {
    // get video element
    videoElement = document.querySelector("video");
    // listen for loadedmetadata
    videoElement.addEventListener("loadedmetadata", metaLoaded);
    // set up first video
    displayMetadataLoading();
    setupVideoElement(currentVideoIndex);
    // set up all click handlers
    setupClickHandlers();
    // set up all mousedown and mouseup handlers
    setupMouseDownHandlers();
    setupMouseUpHandlers();
    // set progress bars on window resize
    window.addEventListener("resize", setProgressBars);
    // listen for time update to update time and progress bars
    videoElement.addEventListener("timeupdate", currentimeChanged);
    // listen for waiting event and playing event to remove buffer msg
    videoElement.addEventListener("waiting", displayBuffering);
    videoElement.addEventListener("playing", videoPlaying);
    // listen for seeking and seeked events
    videoElement.addEventListener("seeking", displaySeeking);
    videoElement.addEventListener("seeked", removeMessage);
    // listen for canplay event to see if we should play video after prev/next
    videoElement.addEventListener("canplay", shouldPlay);
    // listen for volume control value change, use both change and input
    document.querySelector("#controlsVolume").addEventListener("change", adjustVolume);
    document.querySelector("#controlsVolume").addEventListener("input", adjustVolume);
    // listen for ended to move on to next video or random video
    videoElement.addEventListener("ended", nextVideo);
}

function metaLoaded() {
    setEndTime();
    removeMessage();
    setProgressBars();
}

function currentimeChanged() {
    setCurrentTime(videoElement.currentTime);
    setProgressBars();
    if (currentChapterIndex != -1) {
        determineCurrentChapter();
    }
    removeMessage();
}

function setCurrentTime(currentTime) {
    // change display of current time
    var currentTimeElement = document.querySelector("#controlsCurrentTime");
    currentTimeElement.innerHTML = formatTime(currentTime);
}

function setEndTime() {
    // change display of end time
    var endTimeElement = document.querySelector("#controlsEndTime");
    endTimeElement.innerHTML = formatTime(videoElement.duration);
}

function formatTime(duration) {
    // get duration in hours, minutes and seconds
    var hours = String(Math.floor(duration / 3600));
    var minutes = String(Math.floor(duration % 3600 / 60));
    var seconds = String(Math.floor(duration % 3600 % 60));
    // if minutes or second are a single digit, pad with a 0
    if (minutes.length == 1) minutes = "0" + minutes;
    if (seconds.length == 1) seconds = "0" + seconds;
    return hours + ":" + minutes + ":" + seconds;
}

function setupVideoElement(idx) {
    // set current video
    var currentVideo = videosArray[idx];
    // set video element to hava a data attribute of the  current videos title
    videoElement.setAttribute("data-title", currentVideo.title);
    // get the p element in video so we can add sources and tracks before it
    var pElement = document.querySelector("video p");
    // loop through sources of current video and add the sources to the video element
    var sources = currentVideo.sources;
    for (var source in sources) {
        var sourceElement = document.createElement("source");
        // loop through attributes and add them to source
        for (var attr in sources[source]) {
            sourceElement.setAttribute(attr, sources[source][attr]);
        }
        videoElement.insertBefore(sourceElement, pElement);
    }
    // loop through tracks of current video and add the tracks to the video element
    var tracks = currentVideo.tracks;
    for (var track in tracks) {
        var trackElement = document.createElement("track");
        // loop through atribues and add themm to track
        for (var attr in tracks[track]) {
            trackElement.setAttribute(attr, tracks[track][attr]);
        }
        videoElement.insertBefore(trackElement, pElement);
    }
}

function resetVideoElement() {
    // set video element back to just the p element
    videoElement.innerHTML = "<p>Your Browser does not support the video tag.</p>";
    videoElement.removeAttribute("data-title");
}

function setupClickHandlers() {
    // clicking in video area will play/pause
    videoElement.addEventListener("click", togglePlay);

    // clicking in progress bar will move bar and video position
    document.querySelector("#controlsProgressBar").addEventListener("click", setProgressPos);

    // set up click events on buttons
    var controlButtons = document.querySelectorAll("#controlsBottomRow > div");
    for (var i = 0; i < controlButtons.length; i++) {
        controlButtons[i].addEventListener("click", buttonClick);
    }
}

function setupMouseDownHandlers() {
    // set up mousedown events on buttons for applying effects
    var controlButtons = document.querySelectorAll("#controlsBottomRow > div");
    for (var i = 0; i < controlButtons.length; i++) {
        controlButtons[i].addEventListener("mousedown", buttonDown);
    }
}

function setupMouseUpHandlers() {
    // set up mouseup events on buttons for removing effects
    var controlButtons = document.querySelectorAll("#controlsBottomRow > div");
    for (var i = 0; i < controlButtons.length; i++) {
        controlButtons[i].addEventListener("mouseup", buttonUp);
    }
}

function togglePlay() {
    // play pause video
    if (videoElement.paused) {
        videoElement.play();
        playing = true;
        togglePlayButton("play");
    } else {
        videoElement.pause();
        playing = false;
        togglePlayButton("pause");
    }
}

function togglePlayButton(state) {
    // if playing display pause image else display play image
    var playButton = document.querySelector("#controlsPlayButton");
    if (state == "play") {
        playButton.style.backgroundImage = "url('img/pause.png')";
    } else {
        playButton.style.backgroundImage = "url('img/play.png')";
    }
}

function setProgressPos(evt) {
    // get progress bar attributes to determine where clicked in percent
    var boundingRect = evt.currentTarget.getBoundingClientRect();
    var progressPosition = (evt.clientX - boundingRect.left) / boundingRect.width;
    var percentPosition = Math.round(progressPosition * 100);
    // also need to set video position
    // setting the video position triggers timeupdate
    // the timeupdate event listener calls functions to set the text time
    // as well as the progress bar positions
    setVideoPos(percentPosition);
}

function setProgressBars() {
    // get progressBar and bufferdBar elements
    var progressBar = document.querySelector("#controlsProgressBar");
    progressBarWidth = progressBar.getBoundingClientRect().width;
    var bufferedBar = document.querySelector("#controlsBufferedBar");
    // set played bar position
    setPlayedBar(videoElement.currentTime);
    // if video readyState is greater than 2 than it should have buffered
    if (videoElement.readyState > 2) {
        // clear buffered div
        resetBufferedBar();
        // create buffered divs
        var buffered = videoElement.buffered;
        for (var i = 0; i < buffered.length; i++) {
            // create div and set properties
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.backgroundColor = "lightgray";
            div.style.height = "1em";
            // calculate location and size
            var left = Math.round(buffered.start(i) / videoElement.duration * progressBarWidth);
            div.style.left = String(left) + "px";
            var width = Math.round((buffered.end(i) - buffered.start(i)) / videoElement.duration * progressBarWidth);
            div.style.width = String(width) + "px";
            // append to parent
            bufferedBar.appendChild(div);
        }
    }
}

function setPlayedBar(currentTime) {
    // claculate and set width of played bar
    var playedBar = document.querySelector("#controlsPlayedBar");
    var percentPosition = currentTime / videoElement.duration * 100;
    playedBar.style.width = String(percentPosition) + "%";
}

function resetBufferedBar() {
    // reset buffered bar to empty
    var bufferedBar = document.querySelector("#controlsBufferedBar");
    bufferedBar.innerHTML = "";
}

function setVideoPos(percent) {
    // set the actual video position
    var currentTime = Math.round(videoElement.duration * percent / 100);
    videoElement.currentTime = currentTime;
    // set played bar for visual indication that video pos is updating
    setPlayedBar(currentTime);
}

function displaySeeking() {
    // display seeking message
    displayMessage("Seeking ...");
}

function displayBuffering() {
    // display buffering message
    if (videoElement.readyState == 2) {
        displayMessage("Buffering ...");
    }
}

function displayMetadataLoading() {
    // display metadata message
    displayMessage("Metadata Loading ...");
}

function displayMessage(message) {
    // display message
    var msg = document.createElement("span");
    msg.id = "messages";
    msg.innerHTML = message;
    var player = document.querySelector("#player");
    player.insertBefore(msg, videoElement);
}

function removeMessage() {
    // remove message if it exists
    var msg = document.querySelector("#messages");
    if (msg) msg.parentNode.removeChild(msg);
}

function videoPlaying() {
    // remove buffering msg if this event fired after buffering
    removeMessage();
}

function buttonDown(evt) {
    // change class to give button press effect
    evt.currentTarget.classList.add("buttonDown");
}

function buttonUp(evt) {
    // remove class to remove button press effect
    evt.currentTarget.classList.remove("buttonDown");
}

function buttonClick(evt) {
    // process button clicks
    var buttonId = evt.currentTarget.id;
    switch (buttonId) {
        case "controlsPlayButton":
            togglePlay();
            break;
        case "controlsPrevVideo":
            if (currentVideoIndex > 0) {
                prevNext("prev");
            }
            break;
        case "controlsStop":
            videoElement.pause();
            togglePlayButton("pause");
            break;
        case "controlsNextVideo":
            if (currentVideoIndex < videosArray.length - 1) {
                prevNext("next");
            }
            break;
        case "controlsChapters":
            toggleChapters();
            break;
        case "controlsPlaylist":
            togglePlaylist();
            break;
        case "controlsSettings":
            break;
        case "controlsLoop":
            if (videoLoop == "N") {
                videoLoop = "1";
                evt.currentTarget.innerHTML = "1";
            } else if (videoLoop == "1") {
                videoLoop = "A";
                evt.currentTarget.innerHTML = "A";
            } else {
                videoLoop = "N";
                evt.currentTarget.innerHTML = "N";
            }
            break;
        case "controlsRandom":
            toggleButtonStyle(evt.currentTarget);
            videoRandom = !videoRandom;
            if (videoRandom) randomArray = createRandomArray(videosArray.length);
            currentVideoIndex = randomArray[0];
            changeVideo();
            break;
        case "controlsCaptions":
            break;
        case "controlsFullScreen":
            if (videoElement.requestFullscreen) {
                videoElement.requestFullscreen();
            } else if (videoElement.mozRequestFullScreen) {
                videoElement.mozRequestFullScreen();
            } else if (videoElement.webkitRequestFullscreen) {
                videoElement.webkitRequestFullscreen();
            } else if (videoElement.msRequestFullscreen) {
                videoElement.msRequestFullscreen();
            } else if (videoElement.webkitSupportsFullscreen) {
                videoElement.webkitEnterFullscreen();
            }
            break;
        case "controlsMute":
            toggleVolume();
            break;
    }
}

function prevNext(option) {
    // increment or decrement index
    if (option == "prev") {
        currentVideoIndex--;
    } else {
        currentVideoIndex++;
    }
    changeVideo();
}

function changeVideo() {
    //set chapter vars back to -1 and hide chapters if showing
    currentChapterIndex = -1;
    currentActiveChapter = -1;
    hideChapters();
    //togglePlayButton("pause");
    resetBufferedBar();
    resetVideoElement();
    // setup new video element
    setupVideoElement(currentVideoIndex);
    displayMetadataLoading();
    // load new video element
    videoElement.load();
}

function shouldPlay() {
    // if video was playing before switching videos, play video
    if (playing) videoElement.play();
}

function toggleButtonStyle(elmt) {
    // toggle buttonActive class
    if (elmt.classList.contains("buttonActive")) {
        elmt.classList.remove("buttonActive");
    } else {
        elmt.classList.add("buttonActive");
    }
}

function toggleChapters() {
    // if video has chapter tracks, toggle button and display choices
    var chaptersButton = document.querySelector("#controlsChapters");
    var chapterTracks = chapterTrack();
    if (chapterTracks.length > 0) {
        toggleButtonStyle(chaptersButton);
        displayChapterChoices(chapterTracks);
    }
}

function togglePlaylist() {
    var playlistButton = document.querySelector("#controlsPlaylist");
    toggleButtonStyle(playlistButton);
    var playlistDiv = document.querySelector("#playlistDiv");
    if (playlistDiv.innerHTML != "") {
        playlistDiv.innerHTML = "";
    } else {
        var htmlString = '<ul id="playlist">'
        for (var i=0; i<videosArray.length; i++) {
            var idx;
            if (videoRandom) {
                idx = randomArray[i];
            } else {
                idx = i;
            }
            htmlString += '<li data-idx="' + idx + '">';
            htmlString += videosArray[idx].title;
            htmlString += '</li>';
        }
        htmlString += "</ul>";
        playlistDiv.innerHTML = htmlString;
        var listItems = document.querySelectorAll("#playlistDiv li");
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", playlistHandler);
        }
    }
}

function chapterTrack() {
    // get list of chapter tracks
    var textTracks = videoElement.textTracks;
    var chapterTracks = [];
    for (var i = 0; i < textTracks.length; i++) {
        if (textTracks[i].kind == "chapters") chapterTracks.push(i);
    }
    return chapterTracks;
}

function displayChapterChoices(chapterTracks) {
    // display list of chapter tracks and setup click handler
    var chapterListDiv = document.querySelector("#chapterListDiv");
    if (chapterListDiv.innerHTML != "") {
        chapterListDiv.innerHTML = "";
    } else {
        var htmlString = '<ul id="chapterlist"><li data-idx="-1">None</li>';
        for (var idx in chapterTracks) {
            htmlString += '<li data-idx="' + chapterTracks[idx] + '">';
            htmlString += videoElement.textTracks[chapterTracks[idx]].label;
            htmlString += '</li>';
        }
        htmlString += "</ul>";
        chapterListDiv.innerHTML = htmlString;
        var listItems = document.querySelectorAll("#chapterListDiv li");
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].addEventListener("click", chapterHandler);
        }
    }
}

function chapterHandler(evt) {
    // handle click from chapter list
    var chaptersButton = document.querySelector("#controlsChapters");
    toggleButtonStyle(chaptersButton);
    document.querySelector("#chapterListDiv").innerHTML = "";
    loadChapters(evt.currentTarget.getAttribute("data-idx"));
}

function playlistHandler(evt) {
    var playlistButton = document.querySelector("#controlsPlaylist");
    toggleButtonStyle(playlistButton);
    document.querySelector("#playlistDiv").innerHTML = "";
    var idx = evt.currentTarget.getAttribute("data-idx");
    currentVideoIndex = idx;
    changeVideo();
}

function loadChapters(idx) {
    // if idx -1 (none) hide chapters
    if (idx == -1) {
        hideChapters();
        // else if chapters not already loaded, force load
    } else if (idx != currentChapterIndex) {
        currentChapterIndex = idx;
        var textTrack = videoElement.textTracks[idx];
        if (textTrack.mode == "disabled") {
            videoElement.setAttribute("crossorigin", "anonymous");
            textTrack.mode = "hidden";
            document.querySelectorAll("track")[idx].addEventListener('load', displayChapters);
        } else {
            displayChapters();
        }
        // else show chapters
    } else {
        var textTrack = videoElement.textTracks[idx];
        showChapters(textTrack.cues.length);
    }
}

function displayChapters() {
    // build the chapters divs and then show them
    videoElement.removeAttribute("crossorigin");
    var chaptersOuterDiv = document.querySelector("#chaptersOuterDiv");
    chaptersOuterDiv.style.height = "170px";
    var chaptersInnerDiv = document.querySelector("#chaptersInnerDiv");
    chaptersInnerDiv.innerHTML = "";
    var cues = videoElement.textTracks[currentChapterIndex].cues;
    for (var i = 0; i < cues.length; i++) {
        var div = document.createElement("div");
        div.id = cues[i].id;
        div.setAttribute("data-startTime", cues[i].startTime);
        div.setAttribute("data-endTime", cues[i].endTime);
        var htmlString = '<img src="' + videosArray[currentVideoIndex].chapters[i] + '">';
        htmlString += '<p>' + cues[i].id + ' - ' + cues[i].text + '</p>';
        div.innerHTML = htmlString;
        chaptersInnerDiv.appendChild(div);
        div.addEventListener("click", chapterClicked);
    }
    showChapters(cues.length);
}

function hideChapters() {
    var chaptersOuterDiv = document.querySelector("#chaptersOuterDiv");
    chaptersOuterDiv.style.height = "0";
    var chaptersInnerDiv = document.querySelector("#chaptersInnerDiv");
    chaptersInnerDiv.style.width = "0";
}

function showChapters(numberChapters) {
    var chaptersOuterDiv = document.querySelector("#chaptersOuterDiv");
    chaptersOuterDiv.style.height = "170px";

    /*
    // This only gets the corect width of the last 2 divs
    chapterDivs = document.querySelectorAll("#chaptersInnerDiv > div");
    var innerWidth = 0;
    for (var i=0; i<chapterDivs.length; i++) {
        console.log(chapterDivs[i].getBoundingClientRect());
        innerWidth += chapterDivs[i].getBoundingClientRect().width;
    }
    chaptersInnerDiv.style.width = String(Math.ceil(innerWidth)) + "px";
    */

    var chaptersInnerDiv = document.querySelector("#chaptersInnerDiv");
    chaptersInnerDiv.style.width = String(numberChapters * 230) + "px";
    currentActiveChapter = -1;
    determineCurrentChapter();
}

function chapterClicked(evt) {
    // handle click on chapter, if currentActiveChapter = -1, nothing to remove
    if (currentActiveChapter != -1) {
        document.querySelector(".chapterActive").classList.remove("chapterActive");
    }
    evt.currentTarget.classList.add("chapterActive");
    var startTime = evt.currentTarget.getAttribute("data-startTime");
    videoElement.currentTime = startTime;
}

function determineCurrentChapter() {
    // determine current chaper to highlight and scroll into view
    var divs = document.querySelectorAll("#chaptersInnerDiv > div");
    var found = false;
    // loop through all chapters
    for (var i = divs.length - 1; i >= 0; i--) {
        var divStart = divs[i].getAttribute("data-startTime");
        // if found correct chapter and not already found make it active
        if (divStart <= videoElement.currentTime && !found) {
            found = true;
            // if correct chapter is not current one make it active
            // prevents bar scrolling every second so you can select one
            if (i != currentActiveChapter) {
                if (currentActiveChapter != -1) {
                    document.querySelector(".chapterActive").classList.remove("chapterActive");
                }
                currentActiveChapter = i;
                divs[i].classList.add("chapterActive");
                var chaptersOuterDiv = document.querySelector("#chaptersOuterDiv");
                chaptersOuterDiv.scrollLeft = i * 170;
            }
        }
    }
}

function toggleVolume() {
    var controlsMute = document.querySelector("#controlsMute");
    var controlsVolume = document.querySelector("#controlsVolume");
    // if not muted, save volume and set video and controls
    if (videoElement.volume > 0.0) {
        // save current volume
        videoVolume = videoElement.volume;
        videoElement.volume = 0.0;
        controlsVolume.value = 0;
        controlsMute.style.backgroundImage = "url('img/mute.png')";
    // else retrieve previous volume and set video and controls
    } else {
        videoElement.volume = videoVolume;;
        controlsVolume.value = Math.round(videoVolume * 100);
        controlsMute.style.backgroundImage = "url('img/nomute.png')";
    }
}

function adjustVolume(evt) {
    var controlsMute = document.querySelector("#controlsMute");
    var controlVolume = evt.currentTarget.value;
    videoElement.volume = controlVolume / 100;
    if (controlVolume == 0) {
        controlsMute.style.backgroundImage = "url('img/mute.png')";
    } else {
        controlsMute.style.backgroundImage = "url('img/nomute.png')";
    }
}

function nextVideo() {
    var startIdx = currentVideoIndex;
    var idx;
    if (videoRandom) {
        idx = randomArray.indexOf(currentVideoIndex);
        if (videoLoop == "N") {
            if (idx != randomArray.length - 1) {
                currentVideoIndex = randomArray[idx + 1];
            }
        } else if (videoLoop == "A") {
            currentVideoIndex = randomArray[(idx + 1) % randomArray.length];    
        }
    } else {
        if (videoLoop == "N") {
            if (currentVideoIndex != videosArray.length - 1) {
                currentVideoIndex = currentVideoIndex + 1;
            }
        } else if (videoLoop == "A") {
            currentVideoIndex = (currentVideoIndex + 1) % videosArray.length;
        }
    }
    if (currentVideoIndex != startIdx || videoLoop == "1") {
        changeVideo();
    } else {
        togglePlayButton("pause");
    }
}

function createRandomArray(num) {
    var numArray = [];
    while (numArray.length < num) {
        var randInt = Math.floor(Math.random() * 4);
        var idx = numArray.indexOf(randInt);
        if (idx == -1) numArray.push(randInt);
    }
    return numArray;
}