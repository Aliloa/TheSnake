import { useState, useEffect } from "react";
import s from "./Item.module.scss";

const Item = ({ coordinates, type }) => {
  const [num_random] = useState(Math.floor(Math.random() * 9) + 1); // Generate random number only once
  const style = {
    transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
    backgroundImage: type === 'trap' ? `url('/pills/${num_random}.png')` : type === 'food' ? `url('/pills/heart.png')` : '', // Apply color based on type
  };

  return <div className={`${s.item} ${s[`item_${type}`]}`} style={type === 'trap' ? { ...style } : style}></div>;
};

export default Item;
