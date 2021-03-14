'use strict';

window.o_shoppages = window.o_shoppages || {};

o_shoppages.cliplister = (() => {
    function initVideos () {
        o_global.eventLoader.onLoad(40, () => {
            loadVideos();
        });
    }

    function loadVideos () {
        const cliplistervideos = document.querySelectorAll('.cliplistervideo:not([id])');
        if (cliplistervideos && cliplistervideos.length > 0) {
            let done = false;
            const callWhenExternalCliplisterIsAdded = (event) => {
                if (!done && (!event || !event.currentTarget || !event.currentTarget.readyState ||
                    (/loaded|complete/).test(event.currentTarget.readyState))) {
                    done = true;
                    Array.prototype.forEach.call(cliplistervideos, o_shoppages.cliplister.createPlayer);
                }
            };
            o_shoppages.cliplister.prepareExternalCliplisterStuff(callWhenExternalCliplisterIsAdded);
        }
    }

    function prepareExternalCliplisterStuff (callWhenExternalCliplisterIsAdded) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = callWhenExternalCliplisterIsAdded;
        script.src = 'https://cdn19.mycliplister.com/media019/merge?cliplister=86605.2&clviewer=86605.18&videostage=86605.15&innercontrols=86605.4&clickablevideo=86605.3&bufferingspinner=86605.3&nextbutton=86605.4&previewimage=86605.3&playbutton=86605.1&autoplaynext=86605.5';

        const elements = document.getElementsByTagName('head');
        if (elements !== null && elements.length > 0) {
            elements[0].appendChild(script);
        }
    }

    function getPlayerConfig (requestKey, cliplisterElementId) {
        return {
            parentId: cliplisterElementId,
            customer: 86605,
            assetKeys: [requestKey],
            keyType: 10000,
            backgroundColor: '#000000',
            autoplay: false,
            defaultQuality: 'auto',
            assetLimit: 1,
            stage: {
                width: '100%',
                aspectRatio: 'asset'
            },
            plugins: {
                ClickableVideo: {
                    layer: 1
                },
                InnerControls: {
                    breakpoints: {
                        s: 447 // eslint-disable-line id-length
                    },
                    layer: 2,
                    id: 'controls',
                    blacklist: ['playback-speed', 'share'],
                    template: {
                        type: 'external',
                        source: 'https://cdn19.mycliplister.com/media019/static/viewer/assets/skins/otto/2018/controls-otto-live.html'
                    }
                },
                BufferingSpinner: {
                    layer: 3
                },
                PreviewImage: {
                    layer: 4
                },
                PlayButton: {
                    id: 'playButton',
                    layer: 5,
                    image: 'https://cdn19.mycliplister.com/media019/static/viewer/assets/skins/otto/img/playButton_otto2.png',
                    width: 72,
                    height: 72
                }
            }
        };
    }

    function createPlayer (cliplisterVideo) {
        if (cliplisterVideo.getAttribute('id')) {
            return null;
        }
        enrichElementWithRandomId(cliplisterVideo);
        const requestKey = cliplisterVideo.getAttribute('data-requestkey');
        trackVideoView(requestKey);
        const player = new Cliplister.Viewer(getPlayerConfig(requestKey, cliplisterVideo.getAttribute('id')));
        let videoLength = null;

        player.onReady(() => {
            const assets = player.getAssets();
            const currentAssetIndex = player.getCurrentAssetIndex();
            const currentAsset = assets[currentAssetIndex];

            videoLength = currentAsset.duration;
        });

        player.onPlay(() => {
            o_shoppages.cliplister.trackVideoStart(requestKey, videoLength);
        });

        player.onProgress10(() => {
            o_shoppages.cliplister.trackVideoProgress(requestKey, videoLength, 0.1);
        });

        player.onProgress50(() => {
            o_shoppages.cliplister.trackVideoProgress(requestKey, videoLength, 0.5);
        });

        player.onProgress90(() => {
            o_shoppages.cliplister.trackVideoProgress(requestKey, videoLength, 0.9);
        });

        player.onQualityChange(() => {
            const currentQuality = player.getCurrentQuality();
            o_shoppages.cliplister.trackVideoQuality(currentQuality.display);
        });

        return player;
    }

    function enrichElementWithRandomId (element) {
        const randomString = Math.random().toString(36)
            .substring(7);
        element.setAttribute('id', randomString);
    }

    function trackVideoView (requestkey) {
        o_shoppages.cliplister.sendEventToTrackingServer({
            ot_Video: 'view',
            ot_VideoRequestKey: requestkey
        });
    }

    function trackVideoStart (requestKey, videoLength) {
        o_shoppages.cliplister.sendEventToTrackingServer({
            ot_Video: 'start',
            ot_VideoRequestKey: requestKey,
            ot_VideoLength: videoLength
        });
    }

    function trackVideoProgress (requestkey, videoLength, progress) {
        o_shoppages.cliplister.sendEventToTrackingServer({
            ot_Video: 'progress',
            ot_VideoRequestKey: requestkey,
            ot_VideoLength: videoLength,
            ot_VideoProgress: progress
        });
    }

    function trackVideoQuality (currentQuality) {
        o_shoppages.cliplister.sendEventToTrackingServer({
            ot_VideoQuality: currentQuality
        });
    }

    function sendEventToTrackingServer (trackingData) {
        if (window.o_tracking && window.o_tracking.bct) {
            window.o_tracking.bct.sendEventToTrackingServer(trackingData);
        }
    }

    return {
        initVideos,
        loadVideos,
        createPlayer,
        prepareExternalCliplisterStuff,
        enrichElementWithRandomId,

        // just for testing
        trackVideoView,
        trackVideoStart,
        trackVideoProgress,
        trackVideoQuality,
        sendEventToTrackingServer
    };
})();

o_global.eventLoader.onLoad(100, () => {
    o_shoppages.cliplister.initVideos();
});
