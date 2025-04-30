import BackIcon from '../assets/backward.svg?react';
import ForwardIcon from '../assets/forward.svg?react';
import Play from '../assets/play.svg?react';
import Pause from '../assets/pause.svg?react';
import CheckCircle from '../assets/check-circle.svg?react'
import XCircle from '../assets/xmark-circle.svg?react';
import XMark from '../assets/xmark.svg?react';
import Trash from '../assets/trash.svg?react';
import Spotify from '../assets/spotify.svg?react';
import Outbox from '../assets/Outbox.svg?react';
import Gear from '../assets/gear-solid.svg?react';

export function Forward15(props) {
    return <ForwardIcon {...props} />;
  }
  
export function Back15(props) {
    return <BackIcon {...props} />;
}

export function PlayIcon(props) {
    return <Play {...props} />;
}

export function PauseIcon(props) {
    return <Pause {...props} />;
}

export function CheckCircleIcon(props) {
    return <CheckCircle {...props} />;
}

export function XCircleIcon(props) {
    return <XCircle {...props} />;
}

export function XMarkIcon(props) {
    return <XMark {...props} />;
}

export function TrashIcon(props) {
    return <Trash {...props} />;
}

export function ScissorsIcon(props) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path 
        d="M256 192l-39.5-39.5c4.9-12.6 7.5-26.2 7.5-40.5C224 50.1 173.9 0 112 0S0 50.1 0 112s50.1 112 112 112c14.3 0 27.9-2.7 40.5-7.5L192 256l-39.5 39.5c-12.6-4.9-26.2-7.5-40.5-7.5C50.1 288 0 338.1 0 400s50.1 112 112 112s112-50.1 112-112c0-14.3-2.7-27.9-7.5-40.5L499.2 76.8c7.1-7.1 7.1-18.5 0-25.6c-28.3-28.3-74.1-28.3-102.4 0L256 192zm22.6 150.6L396.8 460.8c28.3 28.3 74.1 28.3 102.4 0c7.1-7.1 7.1-18.5 0-25.6L342.6 278.6l-64 64zM64 112a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48 240a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" fill="#333333"/></svg>;
}

export function SpotifyIcon(props) {
    return <Spotify {...props} />;
}

export function GearIcon(props) {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
  ;
}

export function SnipIcon(props) {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M.2 276.3c-1.2-35.3 26.4-65 61.7-66.2l3.3-.1L57 208.1C22.5 200.5 .7 166.3 8.3 131.8S50.2 75.5 84.7 83.2l173 38.3c2.3-2.9 4.7-5.7 7.1-8.5l18.4-20.3C299.9 74.5 323.5 64 348.3 64l10.2 0c54.1 0 104.1 28.7 131.3 75.4l1.5 2.6c13.6 23.2 20.7 49.7 20.7 76.6L512 344c0 66.3-53.7 120-120 120l-8 0-96 0c-35.3 0-64-28.7-64-64c0-2.8 .2-5.6 .5-8.3c-19.4-11-32.5-31.8-32.5-55.7c0-.8 0-1.6 0-2.4L66.4 338c-35.3 1.2-65-26.4-66.2-61.7zm63.4-18.2c-8.8 .3-15.7 7.7-15.4 16.5s7.7 15.7 16.5 15.4l161.5-5.6c9.8-.3 18.7 5.3 22.7 14.2s2.2 19.3-4.5 26.4c-2.8 2.9-4.4 6.7-4.4 11c0 8.8 7.2 16 16 16c9.1 0 17.4 5.1 21.5 13.3s3.2 17.9-2.3 25.1c-2 2.7-3.2 6-3.2 9.6c0 8.8 7.2 16 16 16l96 0 8 0c39.8 0 72-32.2 72-72l0-125.4c0-18.4-4.9-36.5-14.2-52.4l-1.5-2.6c-18.6-32-52.8-51.6-89.8-51.6l-10.2 0c-11.3 0-22 4.8-29.6 13.1l-17.5-15.9 17.5 15.9-18.4 20.3c-.6 .6-1.1 1.3-1.7 1.9l57 13.2c8.6 2 14 10.6 12 19.2s-10.6 14-19.2 12l-85.6-19.7L74.3 130c-8.6-1.9-17.2 3.5-19.1 12.2s3.5 17.2 12.2 19.1l187.5 41.6c10.2 2.3 17.8 10.9 18.7 21.4l.1 1c.6 6.6-1.5 13.1-5.8 18.1s-10.6 7.9-17.2 8.2L63.6 258.1z" fill='#00d3bc'/></svg>;
}

export function InboxIcon(props) {
    return <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 42.65984q17.67424 0 30.16704 12.4928t12.4928 30.16704l0 494.32576 140.32896-140.67712q12.32896-12.32896 30.33088-12.32896 18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-213.34016 213.34016q-12.32896 12.32896-30.33088 12.32896t-30.33088-12.32896l-213.34016-213.34016q-12.32896-13.0048-12.32896-30.33088 0-17.67424 12.4928-30.16704t30.16704-12.4928q18.00192 0 30.33088 12.32896l140.32896 140.67712 0-494.32576q0-17.67424 12.4928-30.16704t30.16704-12.4928zM938.65984 640q17.67424 0 30.16704 12.4928t12.4928 30.16704l0 170.65984q0 53.32992-37.00736 90.33728-37.66272 37.66272-90.0096 37.66272l-683.66336 0q-52.3264 0-90.66496-37.33504-37.33504-38.33856-37.33504-90.66496l0-170.65984q0-17.67424 12.4928-30.16704t30.16704-12.4928 30.16704 12.4928 12.4928 30.16704l0 170.65984q0 17.67424 12.4928 30.16704t30.16704 12.4928l683.66336 0q17.32608 0 29.4912-12.4928t12.16512-30.16704l0-170.65984q0-17.67424 12.4928-30.16704t30.16704-12.4928z"  fill='#00d3bd' /></svg>
}

export function OutboxIcon(props){
    return <Outbox {...props} />
}

export function SearchIcon(props){
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>}

export function PlusIcon(props){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
  
}
