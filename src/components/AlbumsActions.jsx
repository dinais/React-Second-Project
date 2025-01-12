import { useState,useRef} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { createResource } from "./ServerRequests"
import './style.css';
export function SearchAlbums(props) {
    const { setFilteredAlbums, albums, setIsSearchAlbumOpen, searchType, setSearchType } = props;
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchSubmit = () => {
      const queryParams = new URLSearchParams();
      queryParams.set(searchType, searchQuery);
      navigate({ search: queryParams.toString() });
      setFilteredAlbums(filterAlbums());
    };
    const handleCloseSearch = () => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.delete(searchType);
      navigate({ search: queryParams.toString() });
      setIsSearchAlbumOpen(false);
      setSearchQuery("");
      setFilteredAlbums(albums)
    };
  
    const handleSearchTypeChange = (e) => {
      setSearchType(e.target.value);
      setSearchQuery("");
    };
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
  
    const filterAlbums = () => {
      return albums.filter((album) => {
        if (searchType === "id") {
          return album.id.toString().includes(searchQuery);
        } else if (searchType === "title") {
          return album.title.includes(searchQuery);
        } 
        return false;
      });
    };
    return (
      <div >
        <FaTimes onClick={handleCloseSearch} />
        <select
          value={searchType}
          onChange={handleSearchTypeChange}
          style={{ marginRight: "10px" }}
        >
          <option value="id">Search by ID</option>
          <option value="title">Search by Title</option>
        </select>
        <input
          type="text"
          placeholder={`Enter ${searchType}...`}
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleSearchSubmit} >Search</button>
  
      </div>);
  
  }
  SearchAlbums.propTypes = {
    setFilteredAlbums: PropTypes.func.isRequired,
    albums: PropTypes.array.isRequired,
    setIsSearchAlbumOpen: PropTypes.func.isRequired,
    searchType: PropTypes.string.isRequired,
    setSearchType: PropTypes.func.isRequired,
  };
  export function AddNewAlbum(props) {
    const { id, setIsAddAlbumOpen, setAlbums} = props;
    const [newAlbum, setNewAlbum] = useState({ userId: id, title: ""});
    const newTitle = useRef(null)
    const handleAddAlbum = () => {
      if (newTitle != null && newTitle !== "")
        processNewAlbum();
    }
    const processNewAlbum = async () => {
      try {
        const addedAlbum = await createResource("albums", newAlbum);
        setAlbums((prevAlbums) => {
          const updatedAlbums = [...prevAlbums, addedAlbum];
          return (updatedAlbums);
        });
        setIsAddAlbumOpen(false);
        setNewAlbum({ userId: id, title: "" });
  
      } catch (error) {
        console.error("Error adding album:", error.message);
      }
    };
    const handleAddAlbumInput = (e) => {
      const { value } = e.target;
      setNewAlbum((prevState) => ({
        ...prevState,
        title: value
      }));
    };
  
    return (<div>
      <FaTimes onClick={() => setIsAddAlbumOpen(false)} />
      <input name="title" onChange={handleAddAlbumInput} ref={newTitle} type="text" value={newAlbum.title} placeholder="Add title..." />
      <button onClick={handleAddAlbum}>Save album</button>
    </div>)
  }
  AddNewAlbum.propTypes = {
    id: PropTypes.number.isRequired,
    setIsAddAlbumOpen: PropTypes.func.isRequired,
    setAlbums: PropTypes.func.isRequired,
    sortItems: PropTypes.func.isRequired,
    criterion: PropTypes.string.isRequired,
  };