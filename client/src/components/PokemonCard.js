// frontend/src/components/PokemonCard.js
import React from 'react';
import { Link } from 'react-router-dom'; 
import '../styles/PokemonCard.css';

function PokemonCard({ pokemon }) {
  if (!pokemon) {
    return <div className="pokemon-card">Carregando Pokémon...</div>;
  }

  const imageUrl = pokemon.image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card-link">
      <div className="pokemon-card">
        <img src={imageUrl} alt={pokemon.name} className="pokemon-image" />
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <p className="pokemon-id">ID: #{pokemon.id}</p>
        <div className="pokemon-types">
          {pokemon.types && pokemon.types.map((typeInfo, index) => (
            <span key={index} className={`pokemon-type ${typeInfo.type ? typeInfo.type.name : typeInfo}`}>
              {typeInfo.type ? typeInfo.type.name : typeInfo}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default PokemonCard;