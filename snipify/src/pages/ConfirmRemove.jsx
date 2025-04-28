import React, { useEffect, useState } from 'react'
import MobileWrapper from '../components/MobileWrapper'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from './Loading'
import { useToken } from '../contexts/TokenContext.jsx';
import TrackConfirmCard from '../components/TrackConfirmCard'
import { TrashIcon, CheckCircleIcon } from '../components/Icons.jsx';

const ConfirmRemove = () => {
  const { token } = useToken();
  const { state } = useLocation()
  const navigate = useNavigate()
  const toRemoveUris = state?.toRemoveUris || []
  const playlistId = state?.playlistId || null
  const playlistName = state?.playlistName || null
  const [removeSuccess, setRemoveSuccess] = useState(false)

  console.log("Playlist ID:", playlistId)

  const [removeTracks, setRemoveTracks] = useState([])
  const [loading, setLoading] = useState(true)

  const removeFromRemoveList = (id) => {
    setRemoveTracks((prev) => prev.filter((track) => track.id !== id))
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

  const removeTracksFromPlaylist = async () => {
    const trackUris = removeTracks.map(track => track.uri)
    console.log("Track URIs to remove:", trackUris)
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            tracks: trackUris.map(uri => ({ uri }))
      
          })
        }
      )
      if (!response.ok) throw new Error('Failed to remove tracks')
      setRemoveSuccess(true)
    } catch (error) {
      console.error(`Error removing tracks from playlistId ${playlistId}:`, error)
      return null
    }
  }

  useEffect(() => {
    const fetchAllTracks = async () => {
      setLoading(true)
      // remove duplicates
      const uniqueUris = [...new Set(toRemoveUris)]
      const fetchedTracks = await Promise.all(uniqueUris.map(getTrack))
      const validTracks = fetchedTracks.filter((track) => track !== null)
      setRemoveTracks(validTracks)
      setLoading(false)
    }

    if (toRemoveUris.length > 0) {
      fetchAllTracks()
    } else {
      setLoading(false)
    }
  }, [toRemoveUris])

  if (loading) {
    return <Loading />
  }

  if (removeSuccess) {  
    return (
      <MobileWrapper>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl mb-6 text-center font-semibold">Tracks Removed!</h1>
          <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
          { removeTracks.length == 1 
          ? 
            <p className="p-4 text-gray-500 text-center">{removeTracks.length} track has been removed from {playlistName}</p> 
          : 
            <p className="p-4 text-gray-500 text-center">{removeTracks.length} tracks have been removed from {playlistName}</p>
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
        <h1 className="text-3xl mb-2 text-center font-semibold">Confirm tracks to remove</h1>
        <p className="text-center  mb-2 text-gray-500 text-lg">From: {playlistName}</p>
        {removeTracks.length === 0 ? (
          <p className="p-4 text-gray-500 text-center mb-6">No tracks to remove</p>
        ) : (
          removeTracks.map((track) => (
            <TrackConfirmCard track={track} removeFromRemoveList={removeFromRemoveList}/>
          ))
        )}
        {removeTracks.length === 0 ? (
          <button
            className="btn shadow-2xl flex items-center justify-center"
            onClick={() => { navigate(`/`) }}
          >
            Return Home
          </button>
        ) : (
          <button
            className="btn btn-wide shadow-2xl flex items-center justify-center"
            onClick={() => {removeTracksFromPlaylist() }}
          >
            Remove Tracks
            <TrashIcon className="w-5 h-5 ml-2" />
          </button>
        )}
      
      </div>
    </MobileWrapper>
  )
}

export default ConfirmRemove
