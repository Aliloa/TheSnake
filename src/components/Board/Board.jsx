import { useEffect, useState, useRef } from "react";
import Snake from "../Snake/Snake";
import gsap from "gsap";
import s from "./Board.module.scss";
import Item from "../Item/Item";
import {
  defaultControls,
  flashUser,
  tellepills,
  generateRandomCoordinates,
  triggerMode,
  reversedControls,
  wizz,
  netherPortal,
} from "../../utils/utils";
import GameOver from "../GameOver/GameOver";
import useStore from "../../utils/store";
import Submit from "../Submit/Submit";
import Scoreboard from "../Scoreboard/Scoreboard";

const Board = () => {
  const { mode, removeMode } = useStore();
  const [paused, setPaused] = useState(false);
  const [snakeData, setSnakeData] = useState([
    [0, 0],
    [10, 0],
  ]);
  const [headRotation, setHeadRotation] = useState(0);

  const [trapArray, setTrapArray] = useState([]);
  const [foodArray, setFoodArray] = useState([]);

  const [hasEnteredResults, setHasEnteredResults] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(0.2);
  const [score, setScore] = useState(0);
  const [death, setDeath] = useState(0);

  const timer = useRef(0);
  const foodTimer = useRef(0);
  const trapTimer = useRef(0);
  const direction = useRef("RIGHT");
  const canChangeDirection = useRef(true);

  let stop = false;
  let diharreaStyle = false;

  const gameIsOver = () => {
    gsap.ticker.remove(gameLoop);

    setDeath(death + 1);

    const video = document.getElementById("die-video");
    video.style.display = "block";

    // video.currentTime = 0;
    // video.play();

    const deathAudio = new Audio("/audio/death.mp3");
    deathAudio.load();
    deathAudio.play();

    setGameOver(true);
  };

  const isOutOfBorder = (head) => {
    if (head[0] >= 500 || head[1] >= 500 || head[0] < 0 || head[1] < 0) {
      return true;
    } else {
      return false;
    }
  };

  const hasEatenItem = ({ getter, setter }) => {
    const head = snakeData[snakeData.length - 1];

    // comparer les coordonnées de la tête du snake avec LES food
    const item = getter.find(
      (_item) => _item.x === head[0] && _item.y === head[1]
    );

    if (item) {
      // si y'a match on renvoie true

      // mettre à jour le tableau des food disponibles
      const newItemArray = getter.filter((_item) => _item !== item);

      setter(newItemArray);

      return true;
    } else {
      // sinon on renvoie false
      return false;
    }
  };

  const moveSnake = () => {
    if (!stop){
    let newSnakeData = [...snakeData];
    let head = newSnakeData[newSnakeData.length - 1];
    let newHeadRotation = headRotation;

    // console.log(head);
    switch (direction.current) {
      case "RIGHT":
        head = [head[0] + 10, head[1]];
        newHeadRotation  = 0;

        break;
      case "LEFT":
        head = [head[0] - 10, head[1]];
        newHeadRotation  = 180;

        break;
      case "DOWN":
        head = [head[0], head[1] + 10];
        newHeadRotation  = 90;

        break;
      case "UP":
        head = [head[0], head[1] - 10];
        newHeadRotation  = -90;

      default:
        break;
    }
    newSnakeData.push(head);
    newSnakeData.shift();

    setHeadRotation(newHeadRotation);
    // console.log(newHeadRotation);

    const snakeCollapsed = hasCollapsed(head);
    const outOfBorder = isOutOfBorder(head);
    const snakeAteFood = hasEatenItem({
      getter: foodArray,
      setter: setFoodArray,
    });
    const snakeAteTrap = hasEatenItem({
      getter: trapArray,
      setter: setTrapArray,
    });

    // console.log(snakeCollapsed);

    if (outOfBorder || snakeCollapsed) {
      gameIsOver();
    } else {
      if (snakeAteTrap === true) {
        // trap execution logic
        const effects = [ triggerMode];

        const selectedEffect =
          effects[Math.floor(Math.random() * effects.length)];

        selectedEffect();
      }
      if (snakeAteFood === true) {
        // agrandir le serpent
        newSnakeData.unshift([]);

        setScore(score + 10);

        if (speed > 0.05) {
          // console.log("speed =", speed);
          setSpeed(speed - 0.02);
        }
      }
      setSnakeData(newSnakeData);
    }
  }
  };

  const hasCollapsed = (head) => {
    let snake = [...snakeData];
    // let head = snake[snake.length - 1];

    // retire la dernière case du tableau
    snake.pop();

    // comparer les coordonnées de head (tête du snake) avec les autres points du snake
    for (let i = 0; i < snake.length; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        // si match renvoie true
        return true;
      }
    }

    // sinon renvoie false
    return false;
  };

  const onKeyDown = (e) => {
    // console.log(e);
    if (canChangeDirection.current === false) return;
    canChangeDirection.current = false;

    mode.includes("reversed")
      ? reversedControls(e, direction)
      : defaultControls(e, direction);
  };

  mode.includes("diharrea")
  ? diharreaStyle =  true 
  : diharreaStyle =  false;


  const addItem = ({ getter, setter }) => {
    // génération de coordonnées
    const coordinates = generateRandomCoordinates(mode);

    //fusion des deux tableaux
    const array = [...foodArray, ...trapArray];

    //test pour savoir si un item est déjà existant à cet endroit
    const itemAlreadyExistsHere = array.some(
      (item) => item.x === coordinates.x && coordinates.y === item.y
    );

    // si ça existe déjà, rappeler la fonction
    if (itemAlreadyExistsHere) {
      addItem({ getter, setter });
      return;
    }

    setter((oldArray) => [...oldArray, coordinates]);
  };

  const gameLoop = (time, deltaTime, frame) => {
    // console.log(time, deltaTime, frame);
    // console.log("game loop");
    timer.current += deltaTime * 0.001;
    foodTimer.current += deltaTime * 0.001;
    trapTimer.current += deltaTime * 0.001;

    // ici, gestion de l'apparition de la nourriture
    if (foodTimer.current > 2 && foodArray.length < 20) {
      foodTimer.current = 0;
      addItem({
        getter: foodArray,
        setter: setFoodArray,
      });
    }

    // ici, gestion des pièges
    if (trapTimer.current > 3 && trapArray.length < 10) {
      trapTimer.current = 0;
      addItem({
        getter: trapArray,
        setter: setTrapArray,
      });
    }
    
    if (mode.includes("speedup") && timer.current > speed - 0.08) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
    
    if (mode.includes("paralysis") && timer.current > speed * 20) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }

    if (mode.includes("speedown") && timer.current > speed * 3) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }
    
    // Cas par défaut
    if (!mode.includes("speedup") && !mode.includes("paralysis") &&!mode.includes("speedown") && timer.current > speed) {
      timer.current = 0;
      moveSnake();
      canChangeDirection.current = true;
    }    
  };

  const replay = () => {
    // replay game

    removeMode("corner");
    removeMode("speedup");
    removeMode("reversed");

    const video = document.getElementById("die-video");
    video.style.display = "none";
    // video.pause();

    //reset game over
    setGameOver(false);
    setHasEnteredResults(false);
    setSpeed(0.2); // reset speed
    setScore(0); // reset score

    //reset data snake
    setSnakeData([
      [0, 0],
      [10, 0],
    ]);
    //reset food
    setFoodArray([]);
    setTrapArray([]);

    //reset direction
    direction.current = "RIGHT";

    //reset timer
    timer.current = 0;

    //reset food timer
    foodTimer.current = 0;
  };

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    gsap.ticker.add(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      gsap.ticker.remove(gameLoop);
    };
  }, [snakeData]);

  // const pauseGame = () => {
  //   console.log("pause game");
  //   if (paused) {
  //     gsap.ticker.add(gameLoop);
  //     setPaused(false);
  //   } else {
  //     setPaused(true);
  //     timer.current = 0;
  //     foodTimer.current = 0;

  //     gsap.ticker.remove(gameLoop);
  //   }
  // };

  const style = {
    backgroundImage: "url('background.png')",
    backgroundSize: "cover",
  };

  return (
    <>
      {gameOver && <GameOver replay={replay} />}
      {gameOver && !hasEnteredResults && (
        <Submit
          score={score}
          death={death}
          setHasEnteredResults={setHasEnteredResults}
        />
      )}
      {gameOver && <Scoreboard />}

      <div id="board" className={s.board} style={style}>
        <Snake data={snakeData} rotation={headRotation} />

        <span className={s.score}>Score: {score}</span>

        <span className={s.death}>Death: {death}</span>

        {foodArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="food" mode = {diharreaStyle}  />
        ))}

        {trapArray.map((coordinates) => (
          <Item key={coordinates.id} coordinates={coordinates} type="trap" mode = {diharreaStyle}  />
        ))}
      </div>
    </>
  );
};

export default Board;
