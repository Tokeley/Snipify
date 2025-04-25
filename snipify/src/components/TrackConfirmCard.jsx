import React from 'react';
import { XMarkIcon } from './Icons';

const TrackConfirmCard = ({ track, removeFromRemoveList }) => {
  const id = track.id;
  const name = track.name;
  const artists = track.artists;
  const imageUrl = track.album.images?.[0]?.url || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';

  return (
    <div className="card card-side bg-base-100 shadow-md mb-4 w-full max-w-md sm:w-72 md:w-80 lg:w-96 h-20 overflow-hidden">
      <figure className="w-20 h-20 flex-shrink-0">
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </figure>

      <div className="flex-1 flex flex-col justify-center px-4 overflow-hidden">
        <h2 className="card-title text-base font-semibold truncate whitespace-nowrap overflow-hidden">
          {name}
        </h2>
        <p className="text-sm text-gray-400 truncate whitespace-nowrap overflow-hidden">
          {artists.map((a) => a.name).join(', ')}
        </p>
      </div>

      <button
        className="px-2"
        onClick={() => removeFromRemoveList(id)}
        aria-label="Remove track"
      >
        <XMarkIcon className="w-6 h-6 hover:scale-110 hover:cursor-pointer transition-transform duration-150 active:scale-90" />
      </button>
    </div>
  );
};

export default TrackConfirmCard;

