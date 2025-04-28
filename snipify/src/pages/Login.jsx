import React from 'react'
import MobileWrapper from '../components/MobileWrapper';
import { SpotifyIcon } from '../components/Icons';

const Login = () => {
    console.log("Server url: " + import.meta.env.VITE_SERVER_URL);
    return (
        <MobileWrapper>
            <div className="text-center">
            <div className="text-center">
            <h1 className="text-5xl font-bold">
                <span className="bg-gradient-to-r from-[#00d3bd] to-[#00a6b2] bg-clip-text text-transparent">
                    Snip
                </span>{' '}
                <span className="text-gray-700">
                    your playlists
                </span>
            </h1>

                <h2 className="mt-2 text-5xl text-gray-700">
                    <span className="font-bold">
                        into
                    </span>
                    {' '}
                    <span className="italic font-serif font-extralight">
                        perfection
                    </span>
                </h2>
            </div>
            </div>

            <div className="my-3 w-14 h-14">
                <img src="downarrow.png" alt="Down arrow" className="mx-auto" />
            </div>
            <a 
            className="btn shadow-2xl bg-white text-gray-700 border-[#e5e5e5] flex items-center justify-center gap-x-2" 
            href={`${import.meta.env.VITE_SERVER_URL}/auth/login`}
            >
                <SpotifyIcon className="w-5 h-5" />
                Login with Spotify
            </a>
        </MobileWrapper>
    );
}

export default Login;

