import React from 'react'
import MobileWrapper from '../components/MobileWrapper';

const Login = () => {
    return (
        <MobileWrapper>
            <header className="App-header">
                <a className="btn-spotify" href="/auth/login" >
                    Login with Spotify 
                </a>
            </header>
        </MobileWrapper>
    );
}

export default Login