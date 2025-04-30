// src/components/AlbumCard.jsx

import React from 'react';

const AlbumCard = ({ album, handleClick }) => {
  const id = album.id;
  const name = album.name;
  const artists = album.artists
  const imageUrl = album.images?.[0]?.url || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';

  return (
    <div
      className="card card-side bg-base-100 shadow-md mb-4 max-w-md w-80 hover:cursor-pointer hover:bg-base-200 transition duration-300 ease-in-out overflow-hidden"
        onClick={() => handleClick(id)}
    >
      <figure className="w-28 h-28 flex-shrink-0">
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </figure>
      <div className="card-body p-4 overflow-hidden ">
        <h2 className="card-title text-base font-semibold leading-tight truncate w-full overflow-hidden whitespace-nowrap ">{name}</h2>
        <p className="text-sm text-gray-400 truncate overflow-hidden whitespace-nowrap">{artists.map((a) => a.name).join(', ')}</p>
      </div>
    </div>
  );
};

export default AlbumCard;
