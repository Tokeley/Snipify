import React from 'react';

const PlaylistCard = ({ playlist }) => {
  const id = playlist.id;
  const name = playlist.name;
  const owner = playlist.owner.display_name;
  const description = playlist.description;
  const totalTracks = playlist.tracks.total;
  const imageUrl = playlist.images ? playlist.images[0].url : 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp';

  return (
    <div className="card card-side bg-base-100 shadow-md mb-4 w-full max-w-md hover:cursor-pointer hover:bg-base-200 transition duration-300 ease-in-out"
          onClick={() => window.location.href = `/swipe-remove/${id}`}
    >
      <figure className="w-27 h-27">
        <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base font-semibold leading-tight">{name}</h2>
        <p className="text-sm text-gray-400">by {owner}</p>
        <p className="text-sm">{totalTracks} tracks</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
