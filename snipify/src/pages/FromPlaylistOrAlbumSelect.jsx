import React, { useState } from 'react';
import MobileWrapper from '../components/MobileWrapper';
import { useToken } from '../contexts/TokenContext.jsx';
import PlaylistCard from '../components/PlaylistCard.jsx';
import AlbumCard from '../components/AlbumCard.jsx';
import Loading from '../pages/Loading.jsx';
import { SearchIcon } from '../components/Icons.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

const FromPlaylistOrAlbumSelect = () => {
  const { token } = useToken();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('playlist'); // 'album' or 'playlist'
  const [page, setPage] = useState(1);
  const limit = 21;
  const navigate = useNavigate();

  const handleSearch = async (pageOverride = page) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    const offset = (pageOverride - 1) * limit;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}&limit=${limit}&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to search');

      const data = await response.json();
      const items = data[`${searchType}s`]?.items || [];
      setResults(items);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setPage(1);
      handleSearch(1);
    }
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setSearchTerm('');
    setResults([]);
    setPage(1);
  };

  const handleNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(nextPage);
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max(1, page - 1);
    setPage(prevPage);
    handleSearch(prevPage);
  };

  const handleClickPlaylist = (playlistId) => {
    navigate('/playlist-select-in', { state: { fromCollectionType: 'playlist', fromCollectionId: playlistId} })
  }

  const handleClickAlbum = (albumId) => {
    navigate('/playlist-select-in', { state: { fromCollectionType: 'album', fromCollectionId: albumId} })
  }


  if (loading) return <Loading />;

  return (
    <MobileWrapper>
      <div className="mb-6 w-80">
        <h1 className="text-3xl mb-3 text-center font-semibold">Search Spotify</h1>
        <p className='text-gray-500 mb-3'>For a playlist or album to select tracks from</p>

        {/* Search Bar with Icon Inside */}
        <div className="flex justify-center w-full mb-4">
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              placeholder={`Search for ${searchType}s...`}
              className="input input-bordered w-full pr-12 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:cursor-pointer"
              onClick={() => {
                setPage(1);
                handleSearch(1);
              }}
            >
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Radio Buttons for Search Type */}
        <div className="flex justify-center mb-8 gap-4">
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Playlists</span>
            <input
              type="radio"
              name="searchType"
              value="playlist"
              className="radio checked:bg-accent"
              checked={searchType === 'playlist'}
              onChange={handleSearchTypeChange}
            />
          </label>
          <label className="label cursor-pointer">
            <span className="label-text mr-2">Albums</span>
            <input
              type="radio"
              name="searchType"
              value="album"
              className="radio checked:bg-accent"
              checked={searchType === 'album'}
              onChange={handleSearchTypeChange}
            />
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
        {results
          .filter((item) => item && item.id)
          .map((item) =>
            searchType === 'playlist' ? (
              <PlaylistCard key={item.id} playlist={item} handleClick={handleClickPlaylist}/>
            ) : (
              <AlbumCard key={item.id} album={item} handleClick={handleClickAlbum}/>
            )
          )}
      </div>

      {/* Pagination */}
      {results.length > 0 && (
        <div className="join my-8 justify-center flex">
          <button
            className="join-item btn"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            «
          </button>
          <button className="join-item btn cursor-default">Page {page}</button>
          <button
            className="join-item btn"
            onClick={handleNextPage}
          >
            »
          </button>
        </div>
      )}
    </MobileWrapper>
  );
};

export default FromPlaylistOrAlbumSelect;

