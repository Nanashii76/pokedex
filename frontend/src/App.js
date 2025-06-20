import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Pokedex from './components/Pokedex';
import PokemonDetail from './components/PokemonDetail'; 
import './App.css';

function App() {
  return (
    <Router> 
      <div className="App">
        <header className="App-header">
          <h1>Minha Pokedex</h1>
        </header>
        <main>
          <Routes> 
            <Route path="/" element={<Pokedex />} /> 
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;