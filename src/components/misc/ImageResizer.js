import React from 'react';
import Compress from "browser-image-compression";

function ResizeImageFn(event) {

  var imageFile = event.target.files[0];

  var options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 600,
    useWebWorker: true
  }

  imageCompression(imageFile, options)
    .then(function (compressedFile) {
      return compressedFile; // write your own logic
    })
    .catch(function (error) {
      console.log(error.message);
    });
}


export { ResizeImageFn };