var videos = [];
var video = {};

// Create video objects and add them to videos array
video = {
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
videos.push(video);
video = {
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
videos.push(video);
video = {
    title: "Caminades 3",
    sources: [
        {
            src: "http://www.caminandes.com/download/03_caminandes_llamigos_1080p.mp4",
            type: "video/mp4"
        }
    ],
    tracks: []
};
videos.push(video);
video = {
    title: "Big Buck Bunny",
    sources: [
        {
            src: "https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg",
            type: "video/ogg"
        }
    ],
    tracks: []
};
videos.push(video);

// make video element global
var videoElement;

window.onload = init;

function init() {
    // get video element
    videoElement = document.querySelector("video");
    // set up first video
    setupVideoElement(0);
}

function setupVideoElement(idx) {
    // set current video
    currentVideo = videos[idx];
    // set video element to hava a data attribute of the  current videos title
    videoElement.setAttribute("data-title", currentVideo.title);
    // get the p element in video so we can add sources and tracks before it
    var p = document.querySelector("video p");
    // loop through sources of current video and add the sources to the video element
    var sources = currentVideo.sources;
    for (var i in sources) {
        var source = document.createElement("source");
        // loop through attributes and add them to source
        for (var j in sources[i]) {
            source.setAttribute(j, sources[i][j]);
        }
        videoElement.insertBefore(source, p);
    }
    // loop through tracks of current video and add the tracks to the video element
    var tracks = currentVideo.tracks;
    for (var i in tracks) {
        var track = document.createElement("track");
        // loop through atribues and add themm to track
        for (var j in tracks[i]) {
            track.setAttribute(j, tracks[i][j]);
        }
        videoElement.insertBefore(track, p);
    }
}

function resetVideoElement() {
    // set video element back to just the p element
    videoElement.innerHTML = "<p>Your Browser does not support the video tag.</p>";
    videoElement.removeAttribute("data-title");
}