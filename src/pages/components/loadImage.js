import React, { useState, useEffect } from 'react';

const ImageComponent = ({ data }) => {
    const [imageData, setImageData] = useState('');

    

    useEffect(() => {
        if (data ) {
            // Assuming data.photo is a Base64 encoded string representing the image
            setImageData(data.image.data || '');
        } else {
            console.error('Image data is missing or invalid:', data);
        }
    }, [data]);




    return (
        <div>
            {imageData ? (
                <img style={{ width: '75px', height: 'auto' }} src={`data:image/jpeg;base64,${imageData}`} alt="Uploaded" />
            ) : (
                <p>No image data available</p>
            )}
        </div>
    );
};

export default ImageComponent;

