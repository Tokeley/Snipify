import React from 'react'
import { SnipIcon, GearIcon } from './Icons'

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <div className="navbar-start">
        <div>
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle ml-1">
            <a href="/settings" className="w-5 h-5 flex items-center justify-center">
              <GearIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <a className="btn btn-ghost text-xl flex items-center gap-2 text-gray-800" href="/">
          <div className="w-5 h-5">
            <SnipIcon className="w-6 h-6" />
          </div>
          Snipify
        </a>
      </div>

      <div className="navbar-end">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => { window.location.href = '/from-playlist-or-album-select' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Navbar
