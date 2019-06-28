/* global cv */
import { useCallback, useEffect } from "react";

const FPS = 30;

const processFirstFrame = (src, cap) => {
  try {
    cap.read(src);
    const handMask = makeHandMask(src);
    cv.imshow("canvasOutput", handMask);
    const handContour = getHandContour(handMask);
    if (!handContour) {
      return;
    }

    const m = cv.moments(handContour);
    const coordinates = { x: m.m10 / m.m00, y: m.m01 / m.m00 };
    handContour.delete();
    return coordinates;
  } catch (err) {
    console.log("error");
    console.error(err);
  }
};

const processVideo = (src, cap, drag, initialCoordinates) => {
  try {
    cap.read(src);
    const handMask = makeHandMask(src);
    cv.imshow("canvasOutput", handMask);
    const handContour = getHandContour(handMask);
    if (!handContour) {
      return;
    }

    const m = cv.moments(handContour);
    const coordinates = {
      x: 5 * (initialCoordinates.x - m.m10 / m.m00),
      y: 5 * (m.m01 / m.m00 - initialCoordinates.y)
    };
    handContour.delete();
    drag.move(coordinates);
  } catch (err) {
    console.error(err);
  }
};

// get the polygon from a contours hull such that there
// will be only a single hull point for a local neighborhood
const makeHandMask = img => {
  // filter by skin color
  const imgHLS = new cv.Mat();
  cv.cvtColor(img, imgHLS, cv.COLOR_BGR2HLS);
  const rangeMask = new cv.Mat();
  const low = new cv.Mat(imgHLS.rows, imgHLS.cols, imgHLS.type(), [
    40,
    40,
    40,
    40
  ]);
  const high = new cv.Mat(imgHLS.rows, imgHLS.cols, imgHLS.type(), [
    150,
    150,
    150,
    205
  ]);
  cv.inRange(imgHLS, low, high, rangeMask);

  // remove noise
  const blurred = new cv.Mat();
  cv.blur(rangeMask, blurred, new cv.Size(10, 10));
  const thresholded = new cv.Mat();
  cv.threshold(blurred, thresholded, 200, 255, cv.THRESH_BINARY);

  imgHLS.delete();
  rangeMask.delete();
  low.delete();
  high.delete();
  blurred.delete();

  return thresholded;
};

const getHandContour = handMaskImage => {
  const mode = cv.RETR_EXTERNAL;
  const method = cv.CHAIN_APPROX_SIMPLE;
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(handMaskImage, contours, hierarchy, mode, method);
  hierarchy.delete();
  return contours.get(0);
};

export default function useWebCamSensor(api) {
  const start = useCallback(
    function start() {
      const videoInput = document.getElementById("videoInput"); // video is the id of video tag
      const src = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
      const cap = new cv.VideoCapture(videoInput);
      setTimeout(() => {
        const initialCoordinates = processFirstFrame(src, cap);
        if (!initialCoordinates) return;
        const preDrag: ?PreDragActions = api.tryGetLock(
          initialCoordinates.x < 260 ? "11" : "5"
        );
        if (!preDrag) {
          return;
        }
        const drag = preDrag.fluidLift({ x: 0, y: 0 });
        setInterval(() => {
          processVideo(src, cap, drag, initialCoordinates);
        }, 1000 / FPS);
        window.addEventListener("keydown", e => {
          if (e.code === "KeyZ" && e.altKey) {
            console.log("DROPPED");
            clearInterval();
            if (drag.isActive()) {
              drag.drop();
            }
          }
        });
      }, 1000);
    },
    [api]
  );

  useEffect(() => {
    const videoInput = document.getElementById("videoInput"); // video is the id of video tag
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        videoInput.srcObject = stream;
        videoInput.play();
      })
      .catch(function(err) {
        console.log("An error occurred! " + err);
      });
    window.addEventListener("keydown", e => {
      if (e.altKey && e.code === "KeyC") {
        start();
      }
    });
  }, [start]);
}
