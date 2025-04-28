import React from 'react'
import MobileWrapper from '../components/MobileWrapper'
import { InboxIcon, OutboxIcon } from '../components/Icons'
import { useNavigate } from 'react-router-dom'

const AddOrRemoveSelect = () => {
  const navigate = useNavigate()
  const handleSnipOut = () => {
    navigate('/playlist-select')
  }
  const handleSnipIn = () => {
    navigate('/from-playlist-or-album-select')
  }
  return (
    <MobileWrapper>
      <div className="flex flex-col items-center space-y-4">
        <div onClick={() => handleSnipOut()} className="card w-80 h-30 bg-base-100 shadow-xl cursor-pointer hover:bg-base-200 transition-colors duration-300 ease-in-out hover:text-[#00d3bd] flex items-center justify-center">
          <div className="card-body flex flex-col items-center justify-center text-center">
            <div className='flex items-center w-full justify-center'>
              <h2 className="mr-4 card-title text-3xl transition-colors duration-300 ease-in-out">Snip Out</h2>
              <OutboxIcon className="w-7 h-7"/>
            </div>
            <p className='text-gray-500'>Remove tracks from a playlist</p>
          </div>
        </div>
        
        <div onClick={() => handleSnipIn()} className="card w-80 h-30 bg-base-100 shadow-xl cursor-pointer hover:bg-base-200 transition-colors duration-300 ease-in-out hover:text-[#00d3bd] flex items-center justify-center">
          <div className="card-body flex flex-col items-center justify-center text-center">
            <div className='flex items-center w-full justify-center'>
              <h2 className="mr-4 card-title text-3xl transition-colors duration-300 ease-in-out">Snip In</h2>
              <div className='w-7 h-7'>
                <InboxIcon  className="w-7 h-7" />
              </div>
            </div>
            <p className='text-gray-500'>Add tracks from a playlist or album into your playlist</p>
          </div>
        </div>
      </div>
    </MobileWrapper>
  )
}

export default AddOrRemoveSelect



