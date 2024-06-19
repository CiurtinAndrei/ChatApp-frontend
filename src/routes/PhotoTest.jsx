import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const PhotoTest = () => {
  const [photoID, setPhotoID] = useState('');
  const initialValues = {
    photo: null,
  };

  const validationSchema = Yup.object({
    photo: Yup.mixed().required('A photo is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const file = values.photo;
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64Image = reader.result;
      console.log('Base64 Image:', base64Image);

      const url = 'http://localhost:32767/api/images/uploadb64';
      const data = {
        image: base64Image.split(",")[1],
        fileName: file.name,
      };
      console.log(file.name);
      try {
        const response = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });
        setPhotoID(response.data.uploadedFileId);
        resetForm();
      } catch (error) {
        console.error('Error uploading image:', error.response ? error.response.data : error.message);
      } finally {
        setSubmitting(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const delPhoto = async (event) => {
    event.preventDefault();

    const url = `http://localhost:32767/api/images/delete/${photoID}`;
    try {
      await axios.delete(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      setPhotoID(''); 
    } catch (error) {
      console.error('Error deleting image:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form>
            <div>
              <label htmlFor="photo">Upload Photo</label>
              <input
                id="photo"
                name="photo"
                type="file"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue('photo', file);
                }}
              />
              <ErrorMessage name="photo" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>

      <form onSubmit={delPhoto}>
        <label>
          Photo ID:
          <input type="text" value={photoID} readOnly />
        </label>
        <button type="submit" disabled={!photoID}>
          Delete Photo
        </button>
      </form>
    </div>
  );
};

export default PhotoTest;