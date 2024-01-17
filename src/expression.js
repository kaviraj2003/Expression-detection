import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import './expresssion.css';

const ExpressionDetection = () => {
  const webcamRef = useRef(null);
  const [mainExpression, setMainExpression] = useState('');
  const [detections, setDetections] = useState(0);

  useEffect(() => {
    const runExpressionDetection = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');

      const video = webcamRef.current.video;

      if (video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });

          video.srcObject = stream;

          video.addEventListener('play', () => {
            
           

            const displaySize = { width: video.videoWidth || 640, height: video.videoHeight || 480 };
            faceapi.matchDimensions(video, displaySize);

            setInterval(async () => {
              const faceDetections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

  

              setDetections(faceDetections.length);

              if (faceDetections.length > 0) {
                const detectedExpressions = faceDetections[0].expressions;
                if (detectedExpressions) {
                  const mainExpressionEntry = Object.entries(detectedExpressions).reduce(
                    (acc, [expression, probability]) =>
                      probability > acc[1] ? [expression, probability] : acc,
                    ['', 0]
                  );
      
                  const [expression] = mainExpressionEntry;
                  setMainExpression(expression);
                } else {
                  console.error('Expressions not available');
                }
              }
            }, 100);
          });
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      } else {
        console.error('Video element not found or getUserMedia is not supported');
      }
    };

    runExpressionDetection();

  }, []);
  
  return (
    <div id='express'>
      {detections > 0 && (
        (()=>{
          switch (mainExpression){
          case 'happy':
            console.log("happy");
            return <img src='happy.jpg' alt='happy' className='exp'/>
          case 'sad':
            console.log("sad");
            return <img src='sadd.jpg' alt='happy' className='exp'/>
          case 'fearful':
            console.log("fearful");
            return <img src='fearfull.jpg' alt='happy' className='exp'/>
          case 'surprised':
            console.log("surprise");
            return <img src='surprisedd.jpg' alt='happy' className='exp'/>
          case 'angry':
            console.log("angry");
            return <img src='angry.jpg' alt='happy' className='exp'/>
            case 'disgusted':
              console.log("disgusted");
            return <img src='disgust.jpg' alt='happy' className='exp'/>
          default:
            console.log("Neutral");
            return <img src='neutral.jpg' alt='neutral' className='exp'/>
        }
        })()
      )}
       <Webcam id='web' ref={webcamRef}/>
    </div>
   
  );
};

export default ExpressionDetection;
