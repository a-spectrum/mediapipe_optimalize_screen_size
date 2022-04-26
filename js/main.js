const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = document.getElementsByClassName('output_canvas')[0].getContext('2d');
const controlsElement = document.getElementsByClassName('control_panel')[0];
const challengeContainer = document.getElementsByClassName('challenge_container')[0];

const controls = window;
const mpPose = window;
const fpsControl = new controls.FPS();

// Change the screenSizes Enum here to change the video & canvas size.
let graphicSize= screenSizes.medium;

challengeContainer.setAttribute("width", graphicSize.width);
challengeContainer.setAttribute("height", graphicSize.height);

canvasElement.setAttribute("width", graphicSize.width);
canvasElement.setAttribute("height", graphicSize.height);

function onResults(results) {
    if (!results.poseLandmarks) {
        return;
    }

    // Update the frame rate.
    fpsControl.tick();

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(results.segmentationMask, 0, 0,
    // canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
    // canvasCtx.globa/lCompositeOperation = 'source-in';
    // canvasCtx.fillStyle = '#00FF00';
    // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    // Only overwrite missing pixels.
    // canvasCtx.globalCompositeOperation = 'destination-atop';
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.globalCompositeOperation = 'source-over';

    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        { color: '#00FF00', lineWidth: 4 });
    drawLandmarks(canvasCtx, results.poseLandmarks,
        { color: '#FF0000', lineWidth: 2 });

    canvasCtx.restore();
};

const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

pose.setOptions({
    modelComplexity: 0,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: graphicSize.width,
    height: graphicSize.height
});
camera.start();

new controls
    .ControlPanel(controlsElement, {
        selfieMode: true,
        // smoothLandmarks: true,
        // enableSegmentation: false,
        // smoothSegmentation: true,
        // minDetectionConfidence: 0.5,
        // minTrackingConfidence: 0.5,
        // effect: 'background',
    })
    .add([
        new controls.StaticText({ title: 'MediaPipe Pose' }),
        fpsControl,
        // new controls.Toggle({ title: 'Selfie Mode', field: 'selfieMode' }),
        // new controls.Toggle(
        //     { title: 'Smooth Landmarks', field: 'smoothLandmarks' }),
        // new controls.Toggle(
        //     { title: 'Enable Segmentation', field: 'enableSegmentation' }),
        // new controls.Toggle(
        //     { title: 'Smooth Segmentation', field: 'smoothSegmentation' }),
        // new controls.Slider({
        //     title: 'Min Detection Confidence',
        //     field: 'minDetectionConfidence',
        //     range: [0, 1],
        //     step: 0.01
        // }),
        // new controls.Slider({
        //     title: 'Min Tracking Confidence',
        //     field: 'minTrackingConfidence',
        //     range: [0, 1],
        //     step: 0.01
        // }),
        // new controls.Slider({
        //     title: 'Effect',
        //     field: 'effect',
        //     discrete: { 'background': 'Background', 'mask': 'Foreground' },
        // }),
    ])
    .on(x => {
        const options = x;
        videoElement.classList.toggle('selfie', options.selfieMode);
        activeEffect = (x)['effect'];
        pose.setOptions(options);
    });
