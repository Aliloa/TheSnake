import { useState, useEffect } from "react";
import s from "./Item.module.scss";
import useStore from "../../utils/store";

const Item = ({ coordinates, type, mode }) => {
  const [num_random] = useState(Math.floor(Math.random() * 9) + 1); // Generate random number only once

  let style = {
    transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
    backgroundImage:
      type === "trap"
        ? `url('/pills/${num_random}.png')`
        : type === "food"
        ? `url('/pills/heart.png')`
        : "", // Définit l'image de fond en fonction du type
  };
  
  if (mode) {
    style.backgroundImage =
      type === "trap"
        ? `url('poop.png')`
        : type === "food"
        ? `url('poop.png')`
        : ""; // Modifie l'image de fond en fonction du mode
  }
  
  // const style = {
  //   transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
  //   backgroundImage:
  //     type === "trap"
  //       ? `url('/pills/${num_random}.png')`
  //       : type === "food"
  //       ? `url('/pills/heart.png')`
  //       : "", // Définit l'image de fond en fonction du type
  // };

  return <div className={`${s.item} ${s[`item_${type}`]}`} style={type === 'trap' ? { ...style } : style}></div>;
};

export default Item;
