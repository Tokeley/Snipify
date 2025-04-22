import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useToken } from "../contexts/TokenContext.jsx"; // Needed for Spotify API auth

const TrackCard = ({ trackURI, index, total, handleNextTrack, handleRemoveTrack }) => {
  const { token } = useToken();
  const [trackInfo, setTrackInfo] = useState(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const keepOpacity = useTransform(x, [0, 100], [0, 1]);
  const removeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const depth = total - index - 1;
  const isFront = index === 0;

  useEffect(() => {
    const fetchTrackInfo = async () => {
      try {
        const trackId = trackURI.split(":").pop();
        const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch track info");

        const data = await res.json();
        setTrackInfo(data);
      } catch (err) {
        console.error("Track fetch failed:", err);
      }
    };

    fetchTrackInfo();
  }, [trackURI, token]);

  const handleSwipeRight = () => {
    console.log("Kept!");
  };

  const handleSwipeLeft = () => {
    handleRemoveTrack(trackURI);
  };

  const handleDragEnd = () => {
    if (x.get() > 100) {
      handleNextTrack();
      handleSwipeRight();
    }
    if (x.get() < -100) {
      handleNextTrack();
      handleSwipeLeft();
    }
  };

  if (!trackInfo) return null;

  return (
    <motion.div
      className="absolute card bg-base-100 shadow-xl w-72 hover:cursor-grab active:cursor-grabbing"
      style={{
        zIndex: depth,
        gridRow: 1,
        gridColumn: 1,
        x,
        rotate,
        opacity,
        scale: 1 - index * 0.02,
        y: 0 - index * 8,
        transition: "0.2s ease",
        touchAction: "pan-y",
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
    >
      <figure className="aspect-square w-full">
        <img
          src={trackInfo.album.images[0]?.url}
          alt={trackInfo.name}
          className="w-full h-full object-cover rounded-t-lg pointer-events-none select-none"
        />
      </figure>
      <div className="card-body p-4 text-center">
        <h2 className="card-title text-base font-semibold text-left">{trackInfo.name}</h2>
        <p className="text-sm text-gray-400 text-left">
          {trackInfo.artists.map((a) => a.name).join(", ")}
        </p>
      </div>

      {/* Keep! Text */}
      <motion.div
        className="absolute top-6 left-6 text-green-500 text-3xl font-bold"
        style={{ opacity: keepOpacity }}
      >
        Keep!
      </motion.div>

      {/* Remove! Text */}
      <motion.div
        className="absolute top-6 right-6 text-red-500 text-3xl font-bold"
        style={{ opacity: removeOpacity }}
      >
        Remove!
      </motion.div>
    </motion.div>
  );
};

export default TrackCard;
