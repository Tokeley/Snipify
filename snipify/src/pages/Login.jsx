import React, { useState } from 'react';
import MobileWrapper from '../components/MobileWrapper';
import { SpotifyIcon } from '../components/Icons';

const Login = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/send-user-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email }),
        });

        if (res.ok) {
            setMessage("✅ Your info was sent! You'll be added soon.");
            setFullName('');
            setEmail('');
        } else {
            setMessage("❌ Something went wrong. Try again later.");
        }
    };

    return (
        <MobileWrapper>
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
                    <span className="font-bold">into</span>{' '}
                    <span className="italic font-serif font-extralight">perfection</span>
                </h2>
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

            <div className="mt-6 text-center px-4 w-80">
                <p className="text-sm text-gray-600 mb-4">
                    As this app is in development mode I need to add users manually before they can log in with Spotify.
                    Please enter the following and I will add you to the user list and send you an email once this is done.
                </p>

                <input
                    type="text"
                    placeholder="Full Name (For Spotify account)"
                    className="input input-bordered w-full mb-2"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email (For Spotify account)"
                    className="input input-bordered w-full mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className="btn btn-accent w-full"
                    onClick={handleSubmit}
                    disabled={!fullName || !email}
                >
                    Send
                </button>

                {message && <p className="mt-2 text-sm">{message}</p>}
            </div>
        </MobileWrapper>
    );
};

export default Login;

