import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useToken } from "../contexts/TokenContext.jsx"; // Needed for Spotify API auth
import { CheckCircleIcon, XCircleIcon } from "../components/Icons.jsx";

const TrackCard = ({ trackURI, index, total, handleNextTrack, handleRemoveTrack, handleAddTrack }) => {
  const { token } = useToken();
  const [trackInfo, setTrackInfo] = useState(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0.7, 1, 0.7]);
  const keepOpacity = useTransform(x, [0, 50], [0, 1]);
  const removeOpacity = useTransform(x, [-50, 0], [1, 0]);
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

  // Handle swipe actions (right and left)
  const handleSwipeRight = () => {
    handleNextTrack();
    if (handleAddTrack) {
      handleAddTrack(trackURI);
    }
  };

  const handleSwipeLeft = () => {
    handleNextTrack();
    if (handleRemoveTrack) {
      handleRemoveTrack(trackURI);
    }
  };

  const handleDragEnd = () => {
    if (x.get() > 100) {
      handleSwipeRight();
    }
    if (x.get() < -100) {
      handleSwipeLeft();
    }
  };

  // Add keyboard listeners to handle arrow key presses
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleSwipeRight();
      }
      if (event.key === "ArrowLeft") {
        handleSwipeLeft();
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSwipeRight, handleSwipeLeft]);

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
      dragElastic={0.7}
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
        <h2 className="card-title text-base font-semibold text-left truncate whitespace-nowrap overflow-hidden w-full">
          {trackInfo.name}
        </h2>
        <p className="text-sm text-gray-400 text-left truncate whitespace-nowrap overflow-hidden w-full">
          {trackInfo.artists.map((a) => a.name).join(", ")}
        </p>
      </div>

      {/* Keep! Text */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center"
        style={{ opacity: keepOpacity }}
      >
        {
          handleAddTrack 
            ? 
            <h1 style={{ color: "#008000" }} className="text-3xl font-bold mb-2">Add!</h1>
            :
            <h1 style={{ color: "#008000" }} className="text-3xl font-bold mb-2">Keep!</h1>
        }
        <CheckCircleIcon className="w-24 h-24 fill-current" />
      </motion.div>

      {/* Remove! Text */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-center items-center"
        style={{ opacity: removeOpacity }}
      >
        {
          handleAddTrack 
            ? 
            <h1 style={{ color: "#B31B1B" }} className="text-3xl font-bold mb-2">Ignore!</h1>
            :
            <h1 style={{ color: "#B31B1B" }} className="text-3xl font-bold mb-2">Remove!</h1>
        }
        <XCircleIcon className="w-24 h-24 fill-current" />
      </motion.div>

    </motion.div>
  );
};

export default TrackCard;
