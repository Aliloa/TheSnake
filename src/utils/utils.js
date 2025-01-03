import uniqid from "uniqid";
import gsap from "gsap";
import useStore from "./store";

const flashbangAudio = new Audio("/audio/csgo-flashbang.mp3");
const tellepillsAudio = new Audio("/audio/tellepills.mp3");
const paralysisAudio = new Audio("/audio/paralysis.mp3");
const speedupAudio = new Audio("/audio/speed_up.mp3");
const speedownAudio = new Audio("/audio/speed_down.mp3");
const diharreaAudio = new Audio("/audio/explosive_diharrea.mp3");


let animation = null;

// window.location.href = "https://google.com";
export const netherPortal = () => {
  const video = document.getElementById("nether-video");
  video.style.display = "block";

  setTimeout(() => {
    video.style.display = "none";
  }, 3000);
};

export const flashUser = () => {
  if (animation) animation.kill();

  flashbangAudio.currentTime = 0;
  flashbangAudio.play();
  document.querySelector(".flashbang").style.opacity = "1";

  animation = gsap.to(".flashbang", {
    opacity: 0,
    duration: 2,
    delay: 0.25,
  });
};

function playModeAnimation(mode, audioElement) {
  // if (animation) animation.kill();
  
  audioElement.play();
  
  const element = document.querySelector(`.${mode}`);
  element.style.opacity = "1";

  animation = gsap.fromTo(
    `.${mode}`,
    {
      x: "-5%",
    },
    {
      x: "5%",
      opacity: 0,
      duration: 3,
      ease: "power1.out",
    }
  );
}

export const triggerMode = () => {
  const modes = ['speedup', 'paralysis', 'diharrea', 'speedown'];
  const selectedMode = modes[Math.floor(Math.random() * modes.length)];

  // déclenche le mode sélectionné aléatoirement
  useStore.getState().addMode(selectedMode);

 if (selectedMode === "speedup") {
  playModeAnimation("speedup", speedupAudio);
}

if (selectedMode === "speedown") {
  playModeAnimation("speedown", speedownAudio);
}

if (selectedMode === "paralysis") {
  playModeAnimation("paralysis", paralysisAudio);
}

if (selectedMode === "diharrea") {
  playModeAnimation("diharrea", diharreaAudio);
}

  setTimeout(() => {
    useStore.getState().removeMode(selectedMode);
  }, 1000);
};

export const wizz = () => {
  gsap.to("#board", {
    duration: 0.05,
    x: "+=30%",
    yoyo: true,
    repeat: 9,
  });
};

export const reversedControls = (e, direction) => {
  switch (e.keyCode) {
    //touche du haut
    case 38:
      // console.log("going up");
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const defaultControls = (e, direction) => {
  switch (e.keyCode) {
    case 38:
      // console.log("going up");
      if (direction.current !== "DOWN") {
        direction.current = "UP";
      }
      // Going up
      break;
    case 40:
      if (direction.current !== "UP") {
        direction.current = "DOWN";
      }
      // Going down
      break;
    case 37:
      if (direction.current !== "RIGHT") {
        direction.current = "LEFT";
      }
      // Going left
      break;
    case 39:
      if (direction.current !== "LEFT") {
        direction.current = "RIGHT";
      }
      // Going right
      break;

    default:
      break;
  }
};

export const generateRandomCoordinates = (mode) => {
  // console.log("generate random");
  const id = uniqid();
  let min = 0;
  let max = 49;
  let x, y;

  if (mode.includes("corner")) {
    // logique pour générer des coordonnées uniquement sur les côtés
    const side = Math.random();
    console.log(side);

    if (side <= 0.25) {
      console.log("generate left");
      //générer à gauche
      x = min;
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      y *= 10;
    } else if (side > 0.25 && side <= 0.5) {
      console.log("generate right");
      //générer à droite
      x = max * 10;
      y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      y *= 10;
    } else if (side > 0.5 && side <= 0.75) {
      console.log("generate bottom");
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      x *= 10;

      y = max * 10;
      //générer en bas
    } else if (side > 0.75) {
      console.log("generate top");
      x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
      x *= 10;

      y = min;
      //générer en haut
    }

    // console.log(side);
  } else {
    // logique classique
    x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

    x *= 10;

    y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;

    y *= 10;
  }

  // console.log(x, y);

  return { x, y, id };
};
