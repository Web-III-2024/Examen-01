import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import App from "./App";
import NavBar from "./components/navBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PokemonDetails from '../src/pages/PokemonDetails';


// import PokeApi from "./pages/PokeApi";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/pokemon/:name" element={<PokemonDetails isOpen={false} closeModal={function (): void {
        throw new Error("Function not implemented.");
      } } children={undefined} />} />


    </Routes>
  </BrowserRouter>
);
