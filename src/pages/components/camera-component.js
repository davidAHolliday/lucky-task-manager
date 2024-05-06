import React, { useEffect, useRef, useState } from 'react';
import { baseUrl } from '../../utils/helperFunctions';
import axios from 'axios';

const CameraComponent = (props) => {
  const [cameraStatus, setCameraStatus] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  let stream = null;


  const saveImage = (taskProfile, index, capturedImage) => {
    if (!capturedImage) {
        console.error('No captured image available.');
        return;
    }

    // Convert data URL to Blob
    fetch(capturedImage)
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch the image.');
            }
            return res.blob();
        })
        .then(blob => {
            const imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('title', 'My First Picture'); // Add a title for the photo
            formData.append('image', imageFile);

            const url = `${baseUrl}/task/v1/photo/${taskProfile.taskId}/${index}`; // Adjust the base URL
            axios.post(url, formData)
                .then(response => {
                    console.log('Image uploaded successfully:', response.data);
                    closeCamera();
                    props.showCamModal(false)
                    cameraStatus(false)


                    // Handle response as needed
                })
                .catch(error => {
                    console.error('Error uploading image:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching or converting image:', error);
        });

    }


    const openCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          setCameraStatus(true);
        } catch (err) {
          console.error('Error accessing camera:', err);
        }
      };

useEffect(()=>{

    if(cameraStatus){
        openCamera();
    }
    if(!cameraStatus){
        closeCamera();

    }
    

},[cameraStatus])


  const capture = () => {
    if (!videoRef.current.srcObject) {
      console.error('Camera stream not available.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const imageSrc = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageSrc); // Set captured image for display
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
  
  };

  const closeCamera = () => {
    if (!videoRef.current.srcObject) {
      console.error('Camera stream not available.');

      return;
    }

    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setCameraStatus(false);
    props.showCamModal(false)
  };

  return (
    <div className='camera-container'>
      <video ref={videoRef} autoPlay />
      {!cameraStatus && <button onClick={openCamera}>Open Camera</button>}
      {cameraStatus && (
        <>
       {  !capturedImage &&   <button onClick={capture}>Take Picture</button>}
          {/* <button onClick={closeCamera}>Close Camera</button> */}
        </>
      )}
      {capturedImage && <img src={capturedImage} alt="Captured" />}
      <button onClick={()=>saveImage(props.taskProfile, parseInt(props.index),capturedImage)}>Save Img</button>
      {/* <button onClick={()=>openCamera()}>Save Img</button> */}


    </div>
  );
};

export default CameraComponent;