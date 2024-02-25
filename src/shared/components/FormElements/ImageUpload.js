import React, { useEffect, useRef, useState } from 'react';

import './ImageUpload.css';
import Button from './Button';

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };

    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  return (
    <div className='form-control'>
      <input
        id={props.id}
        style={{ display: 'none' }}
        type='file'
        accept='jpg,png,jpeg'
        ref={filePickerRef}
        onChange={pickedHandler}
      />

      <div className={`image-upload ${props.center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}
          {!previewUrl && <p>Please upload your image</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          Choose Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
