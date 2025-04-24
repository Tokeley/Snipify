import React from 'react';
import { XMarkIcon } from './Icons';

const TrackConfirmCard = ({ track, removeFromRemoveList }) => {
  const id = track.id;
  const name = track.name;
  const artists = track.artists;
  const imageUrl = track.album.images?.[0]?.url || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';

  return (
    <div className="card card-side bg-base-100 shadow-md mb-4 w-full max-w-md sm:w-72 md:w-80 lg:w-96 ">
      <figure className="w-20 h-20">
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </figure>

      <div className="card-body p-4 pr-10"> {/* Add right padding to leave space for icon */}
        <h2 className="card-title text-base font-semibold leading-tight">{name}</h2>
        <p className="text-sm text-gray-400 text-left truncate whitespace-nowrap overflow-hidden w-full">
          {artists.map((a) => a.name).join(', ')}
        </p>
      </div>

        <button
            className="mr-4"
            onClick={() => removeFromRemoveList(id)}
            aria-label="Remove track"
            >
            <XMarkIcon className="w-8 h-8 hover:scale-110 hover:cursor-pointer transition-transform duration-150 active:scale-90" />
        </button>
    </div>
  );
};

export default TrackConfirmCard;
