import React from 'react'
import MobileWrapper from '../components/MobileWrapper'
import { useNavigate } from 'react-router-dom'

const FromPlaylistOrAlbumSelect = () => {
    const navigate = useNavigate()
  return (
    <MobileWrapper>
        <div className="flex flex-col items-center">
            <h1 className="text-3xl mb-6 text-center font-semibold">Coming soon</h1>
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

export default FromPlaylistOrAlbumSelect