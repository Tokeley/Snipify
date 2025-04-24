import BackIcon from '../assets/back-15-seconds.svg?react';
import ForwardIcon from '../assets/forward-15-seconds.svg?react';
import Play from '../assets/play.svg?react';
import Pause from '../assets/pause.svg?react';
import CheckCircle from '../assets/check-circle.svg?react'
import XCircle from '../assets/xmark-circle.svg?react';
import XMark from '../assets/xmark.svg?react';
import Trash from '../assets/trash.svg?react';


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
