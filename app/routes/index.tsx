"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function IndexPage() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [rotate, setRotate] = useState(0);

  return (
    <>
      <div className="inputs">
        x:
        <input
          type="range"
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
        />
        y:
        <input
          type="range"
          value={y}
          onChange={(e) => setY(Number(e.target.value))}
        />
        rotate
        <input
          type="range"
          value={rotate}
          onChange={(e) => setRotate(Number(e.target.value))}
        />
      </div>
      <div>
        <motion.div
          className={"w-40 h-40 bg-blue-400 rounded-full flex"}
          // animate={{ x, y, rotate }}
          // // transition={{ type: "spring" }}

          // whileHover={{ scale: 1.2 }}
          // whileTap={{ scale: 1.1 }}
          // drag="x"
          // dragConstraints={{ left: -100, right: 100 }}
          animate={{ x: [0, 100, 0] }}
        />
      </div>
    </>
  );
}
