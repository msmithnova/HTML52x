var video, htmlTracks;
var trackStatusesDiv;
var buttonLoadFirstTrack, buttonLoadSecondTrack, buttonLoadThirdTrack;
var buttonLoadFirstCues, buttonLoadSecondCues, buttonLoadThirdCues;

window.onload = function () {
    // called when the page has been loaded
    video = document.querySelector("#myVideo");
    trackStatusesDiv = document.querySelector("#trackStatusesDiv");

    buttonLoadFirstTrack = document.querySelector("#buttonLoadFirstTrack");
    buttonLoadFirstTrack.disabled = false;
    buttonLoadSecondTrack = document.querySelector("#buttonLoadSecondTrack");
    buttonLoadSecondTrack.disabled = false;
    buttonLoadThirdTrack = document.querySelector("#buttonLoadThirdTrack");
    buttonLoadThirdTrack.disabled = false;

    buttonLoadFirstCues = document.querySelector("#buttonLoadFirstCues");
    buttonLoadSecondCues = document.querySelector("#buttonLoadSecondCues");
    buttonLoadThirdCues = document.querySelector("#buttonLoadThirdCues");

    cueChangeFirstTrack = document.querySelector("#cueChangeFirstTrack");
    cueChangeSecondTrack = document.querySelector("#cueChangeSecondTrack");

    stopCueChangeFirstTrack = document.querySelector("#stopCueChangeFirstTrack");
    stopCueChangeSecondTrack = document.querySelector("#stopCueChangeSecondTrack");

    cueEnterExitFirstTrack = document.querySelector("#cueEnterExitFirstTrack");
    cueEnterExitSecondTrack = document.querySelector("#cueEnterExitSecondTrack");

    stopCueEnterExitFirstTrack = document.querySelector("#stopCueEnterExitFirstTrack");
    stopCueEnterExitSecondTrack = document.querySelector("#stopCueEnterExitSecondTrack");

    // Get the tracks as HTML elements
    htmlTracks = document.querySelectorAll("track");

    // display their status in a div under the video
    displayTrackStatuses();
};

function displayTrackStatuses() {
    trackStatusesDiv.innerHTML = "";

    // display track info from HTML track
    for (var i = 0; i < htmlTracks.length; i++) {
        var currentHtmlTrack = htmlTracks[i];

        var label = "<li>label = " + currentHtmlTrack.label + "</li>";
        var kind = "<li>kind = " + currentHtmlTrack.kind + "</li>";
        var lang = "<li>lang (method 1) = " + currentHtmlTrack.srclang + "</li>";
        var lang2 = "<li>lang (metthod 2) = " + currentHtmlTrack.track.language + "</li>";
        var readyState = "<li>readyState = " + currentHtmlTrack.readyState + "</li>";
        if (currentHtmlTrack.readyState == 2) {
            if (i == 0) {
                buttonLoadFirstCues.disabled = false;
                cueChangeFirstTrack.disabled = false;
                cueEnterExitFirstTrack.disabled = false;
            } else if (i == 1) {
                buttonLoadSecondCues.disabled = false;
                cueChangeSecondTrack.disabled = false;
                cueEnterExitSecondTrack.disabled = false;
            } else {
                buttonLoadThirdCues.disabled = false;
            }
        }
        // get mode for TextTrack object 2 different ways
        var mode = "<li>mode (method 1) = " + currentHtmlTrack.track.mode + "</li>";
        var mode2 = "<li>mode (method 2) = " + video.textTracks[i].mode + "</li>";

        trackStatusesDiv.innerHTML += "<li><b>Track:" + i + ":</b></li>" + "<ul>" + label + kind + lang + lang2 + readyState + mode + mode2 + "</ul>";
    }
}

function readContent(track) {
    console.log("reading content of loaded track...");
    displayTrackStatuses();
}

function getTrack(htmlTrack, callback) {
    var textTrack = htmlTrack.track;


    if (htmlTrack.readyState === 2) {
        console.log("text track already loaded");
        callback(textTrack);
    } else {
        // will force the track to be loaded
        console.log("Forcing the text track to be loaded");

        textTrack.mode = "hidden";
        htmlTrack.addEventListener('load', function (e) {
            callback(textTrack);
        });
    }
}
function forceLoadTrack(n) {
    getTrack(htmlTracks[n], readContent);
}

function loadCues(track) {
    // instead of displaying the track statuses, we display
    // in the same div, the track content//
    // first, empty the div
    trackStatusesDiv.innerHTML = "";
    // get the list of cues for that track   
    var cues = htmlTracks[track].track.cues;
    // iterate on them
    for (var i = 0; i < cues.length; i++) {
        // current cue
        var cue = cues[i];
        var id = cue.id + "<br>";
        var timeSegment = cue.startTime + " => " + cue.endTime + "<br>";
        var text = cue.text + "<P>"
        trackStatusesDiv.innerHTML += id + timeSegment + text;
    }
}

function cueChange(track) {
    trackStatusesDiv.innerHTML = "";
    htmlTracks[track].track.addEventListener("cuechange", displayCueChanges);
    if (track == 0) {
        stopCueChangeFirstTrack.disabled = false;
        cueChangeFirstTrack.disabled = true;
    } else {
        stopCueChangeSecondTrack.disabled = false;
        cueChangeSecondTrack.disabled = true;
    }
    video.play();
}

function displayCueChanges() {
    var cue = this.activeCues[0];
    if(cue !== undefined)
        trackStatusesDiv.innerHTML += "cue change: text = " + cue.text + "<br>";
}

function stopCueChange(track) {
    htmlTracks[track].track.removeEventListener("cuechange", displayCueChanges);
    if (track == 0) {
        stopCueChangeFirstTrack.disabled = true;
        cueChangeFirstTrack.disabled = false;
    } else {
        stopCueChangeSecondTrack.disabled = true;
        cueChangeSecondTrack.disabled = false;
    }
}

function cueEnterExit(track) {
    trackStatusesDiv.innerHTML = "";
    if (track == 0) {
        stopCueEnterExitFirstTrack.disabled = false;
        cueEnterExitFirstTrack.disabled = true;
    } else {
        stopCueEnterExitSecondTrack.disabled = false;
        cueEnterExitSecondTrack.disabled = true;
    }
    // get the list of cues for that track
    var cues = htmlTracks[track].track.cues;
    // iterate on them
    for(var i=0; i < cues.length; i++) {
        // current cue
        var cue = cues[i];   
        addCueListeners(cue);
    }
    video.play();
}

function addCueListeners(cue) {
    cue.addEventListener("enter", displayCueEnter);
    cue.addEventListener("exit", displayCueExit);
}

function displayCueEnter() {
    trackStatusesDiv.innerHTML += 'entered cue id=' + this.id + " " + this.text + "<br>";
}

function displayCueExit() {
    trackStatusesDiv.innerHTML += 'exited cue id=' + this.id + "<br>";
}

function stopCueEnterExit(track) {
    if (track == 0) {
        stopCueEnterExitFirstTrack.disabled = true;
        cueEnterExitFirstTrack.disabled = false;
    } else {
        stopCueEnterExitSecondTrack.disabled = true;
        cueEnterExitSecondTrack.disabled = false;
    }
    var cues = htmlTracks[track].track.cues;
    for(var i=0; i < cues.length; i++) {
        var cue = cues[i];   
        removeCueListeners(cue);
    }
}

function removeCueListeners(cue) {
    cue.removeEventListener("enter", displayCueEnter);
    cue.removeEventListener("exit", displayCueExit);
}