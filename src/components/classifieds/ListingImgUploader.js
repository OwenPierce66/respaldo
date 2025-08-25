import React, { useEffect, useState } from "react";
import { faPlusSquare, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";

const ListingImgUploader = (props) => {
  const maxImages = props.max ? props.max : 6;
  const [ImgData, setImgData] = useState(props.ImgData);
  const [Photos, setPhotos] = useState(props.Photos);
  const hiddenFileInput = React.useRef(null);

  const deleteExistingPhoto = (id) => {
    Axios.delete("http://127.0.0.1:8000/api/listing/image-upload/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
      },
      data: {
        imageId: id,
      },
    });
  };

  const handleImageSelect = (event) => {
    if (
      event.target.files.length + ImgData.length + Photos.length >
      props.max
    ) {
      alert(
        `You are only allowed to upload a maximum of ${props.max} Images per listing.`
      );
    } else {
      const files = [...event.target.files];
      files.map((file) => {
        const fileUploaded = file;
        let reader = new FileReader();
        reader.readAsDataURL(fileUploaded);
        reader.onload = () =>
          setImgData((ImgData) => [
            ...ImgData,
            {
              name: file.name,
              data: reader.result,
            },
          ]);
      });
    }
  };

  const handlePhotoPreview = () => {
    let count = 0;
    return Photos.map((img) => {
      let index = count;
      count += 1;
      return (
        <div className="img-preview">
          <FontAwesomeIcon
            className="img-preview-delete"
            icon={faTimesCircle}
            onClick={() => {
              if (window.confirm("Do you want to delete this image?")) {
                handleRemovePhoto(index);
              }
            }}
          />
          <img src={img.file} alt="img-preview" />
        </div>
      );
    });
  };

  const handleImagePreview = () => {
    let count = 0;
    return ImgData.map((img) => {
      let index = count;
      count += 1;
      return (
        <div className="img-preview">
          <FontAwesomeIcon
            className="img-preview-delete"
            icon={faTimesCircle}
            onClick={() => handleRemoveImage(index)}
          />
          <img src={img.data} alt="img-preview" />
        </div>
      );
    });
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleRemoveImage = (index) => {
    let images = [...ImgData];
    images.splice(index, 1);
    setImgData(images);
  };

  const handleRemovePhoto = (index) => {
    let images = [...Photos];
    deleteExistingPhoto(images[index].id);
    images.splice(index, 1);
    setPhotos(images);
  };

  useEffect(() => {
    props.handleImgData(ImgData);
  }, [ImgData]);

  return (
    <div className="image-upload">
      <div className="image-upload-info">
        <div>
          Photos {ImgData.length + Photos.length}/{maxImages}
        </div>
        <div>You can have up to {maxImages} photos</div>
      </div>
      <div className="uploader">
        <div className="images">
          {handleImagePreview()}
          {handlePhotoPreview()}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          ref={hiddenFileInput}
          onChange={handleImageSelect}
        />
        <button className="upload-button" onClick={handleClick} type="button">
          <FontAwesomeIcon icon={faPlusSquare} /> Add Photos
        </button>
      </div>
    </div>
  );
};

export default ListingImgUploader;
