import BackIcon from '../assets/back-15-seconds.svg?react';
import ForwardIcon from '../assets/forward-15-seconds.svg?react';
import Play from '../assets/play.svg?react';
import Pause from '../assets/pause.svg?react';



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