import React, { useState, useEffect } from "react";
import { socket } from "./socket";
import { ConnectionManager } from "./components/ConnectionManager";
import { ConnectionState } from "./components/Connectionstate";
import { MyForm } from "./components/MyForm";
import { Events } from "./components/Events";
import Chat from "./components/Chat/Chat";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chat" component={Chat} />
      </Routes>
    </BrowserRouter>
  );
}
