import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { socket } from '../../socket';

const Lobby = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('')
  const [room, setRoom] = React.useState('')
  // const joinRoom = () => {
  //   window.localStorage.setItem('username', username)
  
  
  //   navigate('/chat')

  // }
   const joinRoom = () => {
     if (username !== "" && room !== "") {
       const joinData = { room, username };
       socket.emit("join_room", joinData);
        window.localStorage.setItem("username", username);
        window.localStorage.setItem("room", room);
        navigate("/chat");
      //  setShowChat(true);
     }
   };

  //  const createid = () => {
  //    const uniqueId = nanoid(8);
  //    setRoom(uniqueId);
  //    setRoomBool(false);
  //  };
  return (
    <div className="h-[100vh] flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-center">Welcome to the Lobby</h1>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Enter your name"
          className="border-2 border-gray-400 rounded p-2 mt-4"
        />
        <input
          onChange={(e) => setRoom(e.target.value)}
          type="text"
          placeholder="Enter room code"
          className="border-2 border-gray-400 rounded p-2 mt-4"
        />
        <button
          onClick={joinRoom}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          {/* <Link to='/chat'> Join room</Link>  */}
          join room
        </button>
      </div>
    </div>
  );
}

export default Lobby