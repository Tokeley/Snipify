import React from 'react'
import MobileWrapper from '../components/MobileWrapper';

const Login = () => {
    console.log("Server url: " + import.meta.env.VITE_SERVER_URL);
    return (
        <MobileWrapper>
            <header className="App-header">
            <a className="btn-spotify" href={`${import.meta.env.VITE_SERVER_URL}/auth/login`}>
                Login with Spotify
            </a>
            </header>
        </MobileWrapper>
    );
}

export default Login