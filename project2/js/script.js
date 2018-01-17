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
        }
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
    ]
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
    tracks: []
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
    tracks: []
};
videosArray.push(videoObject);

// make video element global
var videoElement;

window.onload = init;

function init() {
    // get video element
    videoElement = document.querySelector("video");
    // listen for canplay event on video
    videoElement.addEventListener("canplay", setEndTime);
    // set up first video
    setupVideoElement(0);
    // set up all click handlers
    setupClickHandlers();
    // listen for time update
    videoElement.addEventListener("timeupdate", currentimeChanged);
    // listen for seeking and seeked events
    videoElement.addEventListener("seeking", displaySeeking);
    videoElement.addEventListener("seeked", removeSeeking);
    // listen
}

function currentimeChanged() {
    setCurrentTime(videoElement.currentTime);
    setProgressBars();
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
    currentVideo = videosArray[idx];
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
    videoElement.addEventListener("click", videoClicked);
    // clicking in progress bar will move bar and video position
    document.querySelector("#controlsProgressBar").addEventListener("click", setProgressPos);
}

function videoClicked() {
    // play pause video
    if (videoElement.paused) {
        videoElement.play();
    } else {
        videoElement.pause();
    }
}

function setProgressPos(evt) {
    // get progress bar attributes to determine where clicked in percent
    var boundingRect = evt.currentTarget.getBoundingClientRect();
    var progressPosition = (evt.clientX - boundingRect.left) / boundingRect.width;
    var percentPosition = Math.round(progressPosition * 100);
    // also need to set video position
    setVideoPos(percentPosition);
}

function setProgressBars() {
    // get bufferdBar abd playedBar elements
    var bufferedBar = document.querySelector("#controlsBufferedBar");
    var playedBar = document.querySelector("#controlsPlayedBar");
    var percentPosition = videoElement.currentTime / videoElement.duration * 100;
    // set bar positions
    var bufferedPercent = videoElement.buffered.end(0) / videoElement.duration *100;
    if (bufferedPercent < percentPosition) {
        bufferedBar.style.width = String(percentPosition) + "%";
        playedBar.style.width = "100%";
    } else {
        bufferedBar.style.width = String(bufferedPercent) + "%";
        var playedPercent = percentPosition / bufferedPercent * 100;
        playedBar.style.width = String(playedPercent) + "%";
    }
}

function setVideoPos(percent) {
    // set the actual video position
    var currentTime = Math.round(videoElement.duration * percent / 100);
    videoElement.currentTime = currentTime;
}

function displaySeeking() {
    var seekMsg = document.createElement("span");
    seekMsg.id = "seekMsg";
    seekMsg.innerHTML = "Seeking ...";
    var player = document.querySelector("#player");
    player.insertBefore(seekMsg, videoElement);
}

function removeSeeking() {
    var seekMsg = document.querySelector("#seekMsg");
    seekMsg.parentNode.removeChild(seekMsg);
}