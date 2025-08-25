import React, { useState } from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Axios from 'axios';

const ProfilePicture = () => {
  const [src, selectFile] = useState(null)

  const handleFileChange = e => {
    selectFile(URL.createObjectURL(e.target.files[0]))
  }

  const [image, setImage] = useState(null)
  const [crop, setCrop] = useState({ aspect: 1 / 1 });
  const [result, setResult] = useState(null)


  function getCroppedImg() {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    setResult(base64Image)
  }

  const onDownload = () => {
    Axios.post( 
      "http://127.0.0.1:8000/api/profileImage/", 
    {   
      image: result    
    },
    {    
      headers: {    
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,   
      },    
    }  
    ).then((res) => {   
      location.reload()
    })   
  };

  return (
    <div className="container">
      <div className="row">
        <div className="uplaodProfileButton">
        <label className="ppbw" htmlFor="pui">Upload Image</label>
          <input type="file" hidden id="pui" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="FullImage">
          {src && <div className="innderFullImage"> 
              <ReactCrop className="imagefullinner" src={src} onImageLoaded={setImage} crop={crop} onChange={setCrop} />
              <button className="btnCropUpload" onClick={getCroppedImg} >Crop</button>
            </div>
          }

          {result && <div className="imagePreview">
            <img src={result} alt="Cropped Image" className="img-fluid" />
            <button className="btnCropUpload" onClick={onDownload} >upload</button>
          </div>
          }

        </div>

      </div>
    </div>
  )
}

export default ProfilePicture