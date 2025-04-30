import React, { useEffect, useState } from 'react'
import MobileWrapper from '../components/MobileWrapper'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from './Loading'
import { useToken } from '../contexts/TokenContext.jsx';
import TrackConfirmCard from '../components/TrackConfirmCard'
import { TrashIcon, CheckCircleIcon } from '../components/Icons.jsx';

const ConfirmAdd = () => {
  const { token } = useToken();
  const { state } = useLocation()
  const navigate = useNavigate()
  const toAddUris = state?.toAddUris || []
  const playlistId = state?.playlistId || null
  const playlistName = state?.playlistName || null
  const [addSuccess, setAddSuccess] = useState(false)

  const [addTracks, setAddTracks] = useState([])
  const [loading, setLoading] = useState(true)

  const removeFromAddList = (id) => {
    setAddTracks((prev) => prev.filter((track) => track.id !== id))
  }

  const getTrack = async (uri) => {
    const id = uri.startsWith('spotify:track:') ? uri.split(':')[2] : uri
  
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      if (!response.ok) throw new Error('Failed to fetch track')
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Error fetching track for URI ${uri}:`, error)
      return null
    }
  }

  const addTracksToPlaylist = async () => {
    const trackUris = addTracks.map(track => track.uri)
    console.log("Track URIs to add:", trackUris)
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            uris: trackUris
          })
        }
      )
      if (!response.ok) throw new Error('Failed to add tracks')
      setAddSuccess(true)
    } catch (error) {
      console.error(`Error adding tracks to playlistId ${playlistId}:`, error)
    }
  }

  useEffect(() => {
    const fetchAllTracks = async () => {
      setLoading(true)
      const uniqueUris = [...new Set(toAddUris)]
      const fetchedTracks = await Promise.all(uniqueUris.map(getTrack))
      const validTracks = fetchedTracks.filter((track) => track !== null)
      setAddTracks(validTracks)
      setLoading(false)
    }

    if (toAddUris.length > 0) {
      fetchAllTracks()
    } else {
      setLoading(false)
    }
  }, [toAddUris])

  if (loading) {
    return <Loading />
  }

  if (addSuccess) {  
    return (
      <MobileWrapper>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl mb-6 text-center font-semibold">Tracks Added!</h1>
          <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
          { addTracks.length === 1 
            ? <p className="p-4 text-gray-500 text-center">1 track has been added to {playlistName}</p> 
            : <p className="p-4 text-gray-500 text-center">{addTracks.length} tracks have been added to {playlistName}</p>
          }
          <button
            className="btn shadow-2xl flex items-center justify-center"
            onClick={() => { navigate(`/`) }}
          >
            Return Home
          </button>
        </div>
      </MobileWrapper>
    )
  }

  return (
    <MobileWrapper>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl mb-2 text-center font-semibold">Confirm tracks to add</h1>
        <p className="text-center mb-2 text-gray-500 text-lg">To: {playlistName}</p>
        {addTracks.length === 0 ? (
          <p className="p-4 text-gray-500 text-center mb-6">No tracks to add</p>
        ) : (
          addTracks.map((track) => (
            <TrackConfirmCard key={track.id} track={track} removeFromRemoveList={removeFromAddList} />
          ))
        )}
        {addTracks.length === 0 ? (
          <button
            className="btn shadow-2xl flex items-center justify-center"
            onClick={() => { navigate(`/`) }}
          >
            Return Home
          </button>
        ) : (
          <button
            className="btn btn-wide shadow-2xl flex items-center justify-center"
            onClick={addTracksToPlaylist}
          >
            Add Tracks
          </button>
        )}
      </div>
    </MobileWrapper>
  )
}

export default ConfirmAdd
