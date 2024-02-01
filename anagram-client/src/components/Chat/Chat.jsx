import React, { useState, useEffect } from "react";
import { socket } from "../../socket";
import Grid from "../grid/Grid";
import isValidWord from "../../services/WordValidation";
import Scoreboard from "../Scoreboard/Scoreboard";
import GameString from "../GameString/GameString";

export default function Chat() {
  const roomID = window.localStorage.getItem("room");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const username = window.localStorage.getItem("username");
  const [leaderboard, setLeaderboard] = useState([]); // [{username: "abc", score: 10}, {username: "xyz", score: 20}
  const [fooEvents, setFooEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userscore, setUserscore] = useState(0);
  const [randomString, setRandomString] = useState("");
  // const username = window.localStorage.getItem("username");
  const [validInput, setValidInput] = useState(true);
  const [flag, setFlag] = useState(false);
  const [score, setScore] = useState(0);
  const [lettersEntered, setLettersEntered] = useState(0);

  const handleInputKeyPress = (e) => {
    const enteredChar = e.key.toLowerCase();
    const isEnterKey = e.key === "Enter";
    const isAllowed = new RegExp(`^[${randomString}]$`).test(enteredChar);
    if (isEnterKey) {
      isValidWord(inputValue).then((res) => {
        if (res) {
          socket.emit(
            "send-message",
            score + inputValue.length,
            username,
            roomID
          );

          socket.emit("set-score", score, username, roomID);
          setScore(score + inputValue.length);
          setMessages((previous) => [
            ...previous,
            {
              text: score + inputValue.length,
              ownMessage: true,
              username: username,
            },
          ]);

          // setLeaderboard((prev) => [
          //   ...prev,
          //   { username: username, score: score },
          // ]);

          setInputValue("");
        } else {
          if (score > 0) {
            setScore(score - inputValue.length);
          }
          setValidInput(false);
          setInputValue("");
        }
      });
    }
    if (isAllowed) {
      // socket.emit("validate-input", { inputChar: enteredChar, randomString });
      setLettersEntered((prevCount) => prevCount + 1);
    } else {
      // Prevent non-allowed characters or exceeding 7 letters
      e.preventDefault();
    }
  };

  useEffect(() => {
    const roomID = window.localStorage.getItem("room");
    const username = window.localStorage.getItem("username");
    socket.emit("join_room", { roomID, username });
  }, []);

  useEffect(() => {
    function getRandomString(randomString) {
      console.log("hi", randomString);
      setRandomString(randomString);
    }

    function onReceiveMessage(message, username) {
      setMessages((previous) => [
        ...previous,
        { text: message, ownMessage: false, username: username },
      ]);
    }

    socket.on("connection", (socket) => {
      console.log("hello", socket.id);
    });
    socket.on("room_joined", (username, roomID) => {
      console.log("room joined", username);
    });
    // socket.on("set-score", (score, username) => {});
    socket.on("user-connected", (username) => {
      console.log("user connected", username);
    });
    socket.on("receive-message", onReceiveMessage);
    socket.on("set-score", (score, username) => {});
    socket.on("start-round", getRandomString);
    return () => {
      socket.off("receive-message", onReceiveMessage);
      socket.off("random-string", getRandomString);
    };
  }, []);

  const startTimer = () => {
    socket.emit("start-timer", roomID);
  };

  const sendMessage = () => {
    if (inputValue !== "") {
      socket.emit("send-message", inputValue, username, roomID);
      setMessages((previous) => [
        ...previous,
        { text: inputValue, ownMessage: true, username: username },
      ]);
      setInputValue("");
    }
  };

  const startRound = () => {
    socket.emit("start-round", generateRandomString(), roomID);
  };
  function generateRandomString() {
    const vowels = "aeiou";
    const consonants = "bcdfghjklmnpqrstvwxyz";
    const allLetters = vowels + consonants;

    const randomChars = [];
    const usedLetters = new Set();

    // Ensure at least 2 unique vowels
    for (let i = 0; i < 2; i++) {
      const randomVowel = vowels.charAt(
        Math.floor(Math.random() * vowels.length)
      );
      randomChars.push(randomVowel);
      usedLetters.add(randomVowel);
    }

    // Ensure 7 characters in total with unique letters
    while (randomChars.length < 7) {
      const randomLetter = allLetters.charAt(
        Math.floor(Math.random() * allLetters.length)
      );
      if (!usedLetters.has(randomLetter)) {
        randomChars.push(randomLetter);
        usedLetters.add(randomLetter);
      }
    }

    console.log(randomChars);

    const randomString = randomChars.join("");
    setRandomString(randomString.split());
    return randomString;
  }

  return (
    <div className="w-[100vw]">
      <button onClick={startRound}>Start Round</button>
      {/* <Scoreboard leaderboard={leaderboard} /> */}
      {/* <Grid guesses={[0]} turn={3} /> */}

      <div className=" w-[100vw] items-center text-center">
        <p>Try to find maximum number of words using this string</p>
        <p className="text-4xl font-bold uppercase tracking-wider text-center  ">
          {/* <GameString  /> */}
          {randomString}
        </p>
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <input
            type="text"
            placeholder="Write your message!"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleInputKeyPress}
            className={`w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3 ${
              !validInput ? "border-red-500" : ""
            }`}
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            {/* ... (existing JSX) */}
          </div>
        </div>
        {!validInput && <p className="text-red-500 mt-2">Not a Valid Word.</p>}
      </div>
      <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen w-1/3">
        <div
          id="messages"
          className="flex flex-col  space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message  ${
                message.ownMessage ? "col-start-2 text-white" : "col-start-1"
              }`}
            >
              <div
                className={`px-4 py-4 w-[200px] flex flex-row rounded-lg inline-block rounded-bl-none  bg-gray-300 text-gray-600${
                  message.ownMessage
                    ? " text-slate-800 row-span-2 col-start-1"
                    : "col-start-2"
                }`}
              >
                <p className="  rounded-bl-none bg-gray-300 text-blue-600">
                  {message.username} :
                </p>
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              placeholder="Write your message!"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="button"
                onClick={sendMessage}
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Send</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-6 w-6 ml-2 transform rotate-90"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
