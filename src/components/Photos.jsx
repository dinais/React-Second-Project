import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { fetchResource, deleteResource } from './ServerRequests'
import { FaTrash, FaEdit } from 'react-icons/fa';
import { AddNewPhoto } from './PhotosActions'
export default function Photos() {
    const { albumId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const[isAddPhotoOpen,setIsAddPhotoOpen]=useState(false)
    const isLoading = useRef(false);

    console.log('HI PHOTOS' + albumId);
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
    return (
        <div>
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
                    <div key={photo.id}>
                        <img src={photo.thumbnailUrl} alt={photo.title} width={200} />
                        <FaTrash
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            onClick={() => handleTrashClick(photo.id)}
                        />
                    </div>
                ))}
            </div>
            {hasMore ? (
                <button onClick={loadPhotos}>Load More</button>) :
                (!hasMore && <p>No more photos to load.</p>)
            }
        </div>)
}