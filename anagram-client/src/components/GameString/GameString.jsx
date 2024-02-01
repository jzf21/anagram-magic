import { useEffect, useState } from "react";
import { socket } from "../../socket";
import generateRandomString from "../../services/RandomStringGenerator";

const GameString = () => {
  const [gameString, setGameString] = useState([]);

  useEffect(() => {
    socket.on("set-word", (gameString) => {
      setGameString(generateRandomString().split());
    });
    return () => {
      socket.off("start-round");
    };
  }, []);

  return (
    <div>
      {gameString.map((letter, index) => {
        return <div key={index}>{letter}</div>;
      })}
      {/* {gameString} */}
    </div>
  );
};

export default GameString;
