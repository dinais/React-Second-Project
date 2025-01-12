import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { fetchResource } from "./ServerRequests";
import { SearchAlbums, AddNewAlbum } from "./AlbumsActions";
import './style.css';
export default function Albums() {
    const [albums, setAlbums] = useState([]);
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [isSearchAlbumOpen, setIsSearchAlbumOpen] = useState(false);
    const [searchType, setSearchType] = useState("id");
    const [isAddAlbumOpen, setIsAddAlbumOpen]=useState(false)
    const navigate = useNavigate();
    const location = useLocation();

    const { id } = useParams();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const queryString = queryParams.toString();
        const fetchAlbums = async () => {
            try {
                const data = await fetchResource(id, 'albums', 'userId', queryString);
                setAlbums(data);
                setFilteredAlbums(data)
            } catch (error) {
                console.error("Error fetching albums:", error);
            }
        };
        fetchAlbums();
    }, [id, albums, location]);

    const searchAlbumClicked = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete('search');
        queryParams.set(searchType, '');
        navigate({ search: queryParams.toString() });
        setIsSearchAlbumOpen(true);
        console.log('search clicked');

    };

    return (<>
        <div className="content-container">
        <h1>Albums</h1>
        <button onClick={() => setIsAddAlbumOpen(true)} className="album-button">Add album</button>
        {isAddAlbumOpen && <AddNewAlbum id={id} setIsAddAlbumOpen={setIsAddAlbumOpen} setAlbums={setAlbums}/>}
        <button onClick={searchAlbumClicked}  className="album-button">Search album</button>
        {isSearchAlbumOpen && searchAlbumClicked && <SearchAlbums setFilteredAlbums={setFilteredAlbums} albums={albums} setIsSearchAlbumOpen={setIsSearchAlbumOpen} searchType={searchType} setSearchType={setSearchType} />}
        {albums.length > 0 ? (
            (isSearchAlbumOpen ? filteredAlbums : albums).map((album) => (
                <div key={album.id} className="album-item">
                    {album.id}
                    <Link to={`${album.id}/photos`} className="album-link">{album.title}</Link>
                </div>
            ))
        ) : (
            isSearchAlbumOpen ? (<div>No albums match your search criteria</div>
            ) : (
                <div>You do not have any albums, create some!</div>
            )
        )}
        </div>
    </>)

}
