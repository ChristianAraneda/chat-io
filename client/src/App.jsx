import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Admin } from "./Admin";
import { Client } from "./Client";
import io from "socket.io-client";

// const socket = io("/");

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Client />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;
