import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { createResource } from "./ServerRequests"
export function AddNewPhoto(props) {
  const { id, setIsAddPhotoOpen, setPhotos } = props;
  const [newPhoto, setNewPhoto] = useState({ albumId: id, title: "", url: "" ,thumbnailUrl:""});
  const newTitle = useRef();
  const newUrl = useRef();
  const newThumbnailUrl = useRef();

  const handleAddPhoto = () => {
    if (newTitle != null && newTitle !== "" || newUrl != null && newUrl !== ""||newThumbnailUrl != null && newThumbnailUrl !== "")
      processNewPhoto();
  }
  const processNewPhoto = async () => {
    try {
      const addedPhoto = await createResource("photos", newPhoto);
      setPhotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos, addedPhoto];
        return (updatedPhotos);
      });
      setIsAddPhotoOpen(false);
      setNewPhoto({ albumId: id, title: "", url: "" ,thumbnailUrl:""});

    } catch (error) {
      console.error("Error adding photo:", error.message);
    }
  };
  const handleAddPhotoInput = (e) => {
    const { name, value } = e.target;
    setNewPhoto((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div>
      <FaTimes onClick={() => setIsAddPhotoOpen(false)} />
      <input name="title" onChange={handleAddPhotoInput} type="text" value={newPhoto.title} placeholder="Add title..." />
      <input name="url" onChange={handleAddPhotoInput} type="text" value={newUrl.body} placeholder="Add url..." />
      <input name="thumbnailUrl" onChange={handleAddPhotoInput} type="text" value={newThumbnailUrl.body} placeholder="Add thumbnailUrl..." />
      <button onClick={handleAddPhoto}>Save photo</button>
    </div>
  )
}
AddNewPhoto.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setIsAddPhotoOpen: PropTypes.func.isRequired,
  setPhotos: PropTypes.func.isRequired
};