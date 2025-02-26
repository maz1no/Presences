var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var presence = new Presence({
    clientId: "463097721130188830",
    mediaKeys: true
}), strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused",
    live: "presence.activity.live"
});
var pattern = "•";
var truncateAfter = function (str, pattern) {
    return str.slice(0, str.indexOf(pattern));
};
presence.on("UpdateData", () => __awaiter(this, void 0, void 0, function* () {
    var video = document.querySelector(".video-stream");
    if (video !== null && !isNaN(video.duration)) {
        var oldYouTube = null;
        var YouTubeTV = null;
        var title;
        document.querySelector(".watch-title") !== null
            ? (oldYouTube = true)
            : (oldYouTube = false);
        document.querySelector(".player-video-title") !== null
            ? (YouTubeTV = true)
            : (YouTubeTV = false);
        if (!oldYouTube && !YouTubeTV) {
            title =
                document.location.pathname !== "/watch"
                    ? document.querySelector(".ytd-miniplayer .title")
                    : document.querySelector("h1 yt-formatted-string.ytd-video-primary-info-renderer");
        }
        else {
            if (oldYouTube) {
                if (document.location.pathname == "/watch")
                    title = document.querySelector(".watch-title");
            }
            else if (YouTubeTV) {
                title = document.querySelector(".player-video-title");
            }
        }
        var uploaderTV, uploaderMiniPlayer, uploader2, edited;
        edited = false;
        uploaderTV = document.querySelector(".player-video-details");
        uploaderMiniPlayer = document.querySelector("yt-formatted-string#owner-name");
        if (uploaderMiniPlayer !== null) {
            if (uploaderMiniPlayer.innerText == "YouTube") {
                edited = true;
                uploaderMiniPlayer.setAttribute("premid-value", "Listening to a playlist");
            }
        }
        uploader2 = document.querySelector("#owner-name a");
        var uploader = uploaderMiniPlayer !== null && uploaderMiniPlayer.innerText.length > 0
            ? uploaderMiniPlayer
            : uploader2 !== null && uploader2.innerText.length > 0
                ? uploader2
                : document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a") !== null
                    ? document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a")
                    : uploaderTV = truncateAfter(uploaderTV.innerText, pattern), timestamps = getTimestamps(Math.floor(video.currentTime), Math.floor(video.duration)), live = Boolean(document.querySelector(".ytp-live")), presenceData = {
            details: title.innerText,
            state: edited == true
                ? uploaderMiniPlayer.getAttribute("premid-value")
                : uploaderTV !== null
                    ? uploaderTV
                    : uploader.innerText,
            largeImageKey: "yt_lg",
            smallImageKey: video.paused ? "pause" : "play",
            smallImageText: video.paused
                ? (yield strings).pause
                : (yield strings).play,
            startTimestamp: timestamps[0],
            endTimestamp: timestamps[1]
        };
        presence.setTrayTitle(video.paused ? "" : title.innerText);
        if (video.paused || live) {
            delete presenceData.startTimestamp;
            delete presenceData.endTimestamp;
            if (live) {
                presenceData.smallImageKey = "live";
                presenceData.smallImageText = (yield strings).live;
            }
        }
        if (video && title !== null && uploader !== null) {
            presence.setActivity(presenceData, !video.paused);
        }
    }
    else {
        presence.setActivity();
        presence.setTrayTitle();
    }
}));
presence.on("MediaKeys", (key) => {
    switch (key) {
        case "pause":
            var video = document.querySelector(".video-stream");
            video.paused ? video.play() : video.pause();
            break;
        case "nextTrack":
            document.querySelector(".ytp-next-button").click();
            break;
        case "previousTrack":
            document.querySelector(".ytp-prev-button").click();
            break;
    }
});
function getTimestamps(videoTime, videoDuration) {
    var startTime = Date.now();
    var endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
    return [Math.floor(startTime / 1000), endTime];
}
