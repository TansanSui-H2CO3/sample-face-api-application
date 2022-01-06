async function detect_face_from_image() {
    // load model
    const MODEL_URL = '/weights';
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

    // define the target image
    const input = document.getElementById('image');
    const inputSize = {
        width: input.width,
        height: input.height
    };

    // detect faces
    const detections = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, inputSize);
    
    // prepare canvas
    const canvas = document.getElementById('image-canvas');
    faceapi.matchDimensions(canvas, inputSize);

    // draw detections
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
}

async function detect_face_from_video() {
    // play video of web camera
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    }).then(stream => {
        video.srcObject = stream
        video.play()
    }).catch(e => {
        console.log(e)
    });

    //load model
    const MODEL_URL = '/weights';
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);

    // define the target video
    const input = document.getElementById('video');
    const inputSize = {
        width: input.width,
        height: input.height
    };

    // prepare canvas
    const canvas = document.getElementById('video-canvas');
    faceapi.matchDimensions(canvas, inputSize);

    input.addEventListener('play', () => {
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, inputSize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            const minProbability = 0.05
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections, minProbability);
        }, 100);
    });

}