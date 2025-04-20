import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const SwipeCards = () => {
  const [cards, setCards] = useState(cardData);

  return (
    <div
      className="grid w-screen h-screen place-items-center bg-neutral-100"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
    >
      {cards.map((card, index) => (
        <Card
            key={card.id}
            index={index}
            total={cards.length}
            cards={cards}
            setCards={setCards}
            {...card}
        />
        ))}

    </div>
  );
};

const Card = ({ id, url, setCards, cards, index }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-18, 18]);
  const isFront = id === cards[cards.length - 1].id;
  const depth = cards.length - index - 1;

  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const keepOpacity = useTransform(x, [0, 100], [0, 1]);
  const removeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleSwipeRight = () => {
    console.log("Swiped right");
  };

  const handleSwipeLeft = () => {
    console.log("Swiped left");
  };

  const handleDragEnd = () => {
    if (x.get() > 100) {
      setCards((pv) => pv.filter((v) => v.id !== id));
      handleSwipeRight();
    }
    if (x.get() < -100) {
      setCards((pv) => pv.filter((v) => v.id !== id));
      handleSwipeLeft();
    }
  };

  return (
    <motion.div
      className="relative h-96 w-72 hover:cursor-grab active:cursor-grabbing"
      style={{
        zIndex: index,
        gridRow: 1,
        gridColumn: 1,
        x,
        rotate,
        opacity,
        scale: isFront ? 1 : 1 - depth * 0.02,
        y: isFront ? 0 : depth * 8,
        transition: "0.2s ease",
        touchAction: "pan-y",
      }}
      animate={{
        scale: isFront ? 1 : 1 - depth * 0.02,
        y: isFront ? 0 : depth * 8,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
    >
      <img
        src={url}
        alt="Placeholder alt"
        className="h-full w-full rounded-lg bg-white object-cover pointer-events-none select-none"
      />

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


export default SwipeCards;

const cardData = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=2235&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=2273&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1578608712688-36b5be8823dc?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1505784045224-1247b2b29cf3?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];