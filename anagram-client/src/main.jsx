import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter } from "react-router-dom";
import Chat from "./components/Chat/Chat.jsx";
import { RouterProvider } from "react-router-dom";
import Lobby from "./pages/Lobby/Lobby.jsx";
const router = createBrowserRouter([
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/",
    element: <Lobby/>,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
