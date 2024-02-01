import React, { useState, useEffect } from "react";
import { socket } from "../socket";

const Timer = () => {
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(false);

  const handleStartTimer = () => {
    setIsActive(true);
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    console.log("Timer completed!");
  };

  const startTimer = () => {
    socket.emit("start-timer");
    handleStartTimer();
  };

  useEffect(() => {
    socket.on("start-timer", handleStartTimer);
    socket.on("timer-complete", handleTimerComplete);

    return () => {
      socket.off("start-timer", handleStartTimer);
      socket.off("timer-complete", handleTimerComplete);
    };
  }, []);

  useEffect(() => {
    let intervalId;

    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive]);

  useEffect(() => {
    if (seconds === 0) {
      socket.emit("timer-complete");
    }
  }, [seconds]);

  return (
    <div>
      <p>{`Time remaining: ${seconds} seconds`}</p>
      <button onClick={startTimer} disabled={isActive}>
        Start Timer
      </button>
    </div>
  );
};

export default Timer;
