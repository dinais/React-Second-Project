import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchResource, deleteResource, updateResource } from './ServerRequests'
import { FaTrash, FaEdit } from 'react-icons/fa';
import { AddNewPhoto, EditPhoto } from './PhotosActions'
export default function Photos() {
    const { albumId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false)
    const [editingPhoto, setEditingPhoto] = useState(null)
    const isLoading = useRef(false);

    useEffect(() => {
        loadPhotos();
    }, []);
    const handleTrashClick = async (id) => {
        try {
            await deleteResource(id, "photos");
            setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));
        } catch (error) {
            console.error("Error deleting photo:", error.message);
        }
    };
    const loadPhotos = async () => {
        if (isLoading.current) return;
        isLoading.current = true;

        try {
            const response = await fetchResource(albumId, "photos", "albumId", `_page=${page}`);
            const data = response.data;
            if (data.length > 0) {
                setPhotos((prevPhotos) => [...prevPhotos, ...data]);
                setPage((prevPage) => prevPage + 1);
                console.log(photos);

            } else {
                setHasMore(false);
            }

        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            isLoading.current = false;
        }
    }
    const handleUpdateClick = async (id, updatedTitle, updatedUrl, updatedThumbnailUrl) => {
        try {
            const foundPhoto = photos.find((photo) => photo.id === id);
            const updatedPhoto = {
                ...foundPhoto,
                ...(updatedUrl !== null && { url: updatedUrl }),
                ...(updatedThumbnailUrl !== null && { thumbnailUrl: updatedThumbnailUrl })
            };
            const result = await updateResource(id, updatedPhoto, "photos");
            setPhotos((prevPhotos) =>
                prevPhotos.map((photo) => {
                    if (photo.id === id) {
                        return updatedTitle || updatedUrl || updatedThumbnailUrl ?
                            { ...photo, title: updatedTitle, url: updatedUrl, thumbnailUrl: updatedThumbnailUrl } :
                            result;
                    }
                    return photo;
                })
            );

            console.log(photos);

            if (updatedTitle && updatedUrl && updatedThumbnailUrl)
                setEditingPhoto(null);
        } catch (error) {
            console.error("Error updating photo:", error.message);
        }
    };
    return (
        <div className="content-container">
            <h1>Photos</h1>
            <div>
                <button onClick={() => setIsAddPhotoOpen(true)}>Add photo</button>
                {isAddPhotoOpen && (
                    <AddNewPhoto
                        id={albumId}
                        setIsAddPhotoOpen={setIsAddPhotoOpen}
                        setPhotos={setPhotos}
                    />
                )}
                {photos.map((photo) => (
                    <div key={photo.id} className="photo">
                        <img src={photo.thumbnailUrl} alt={photo.title} width={200} />
                        <FaEdit
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                            onClick={() => setEditingPhoto(photo)}
                        />
                        <FaTrash
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onClick={() => handleTrashClick(photo.id)}
                        />
                        {(editingPhoto && editingPhoto.id === photo.id) && <EditPhoto photo={photo} handleUpdateClick={handleUpdateClick} setEditingPhoto={setEditingPhoto} />}

                    </div>
                ))}
            </div>
            {hasMore ? (
                <button onClick={loadPhotos}>Load More</button>) :
                (!hasMore && <p>No more photos to load.</p>)
            }
        </div>)
}