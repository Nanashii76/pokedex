import React, {useState, useEffect, use} from "react";
import {useParams, Link} from "react-router-dom";
import axios from "axios";
import "../styles/PokemonDetail.css";

const API_BASE_URL = process.env.API_BASE_URL;

function PokemonDetail() {
    const {id} = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/pokemon/${id}`);
                setPokemon(response.data);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("Pokémon not found.");
                } else {
                    setError("Error to load Pokémon details.");
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonDetails();
    }, [id]);

    if (loading) {
        return <div className="pokemon-detail">Loading Pokémon details...</div>;
    }
    if (error) {
        return <div className="pokemon-detail error">{error}</div>;
    }
    if (!pokemon) {
        return <div className="pokemon-detail">No Pokémon data available.</div>;
    }

      return (
    <div className="pokemon-detail-container">
      <Link to="/" className="back-button">← Voltar para a Pokedex</Link>
      <div className="pokemon-detail-card">
        <h2 className="detail-name">{pokemon.name} <span className="detail-id">#{pokemon.id}</span></h2>
        <div className="detail-image-wrapper">
          <img src={pokemon.sprites?.other['official-artwork']?.front_default || pokemon.sprites?.front_default} alt={pokemon.name} className="detail-image" />
        </div>

        <div className="detail-types">
          {pokemon.types.map((typeInfo, index) => (
            <span key={index} className={`pokemon-type ${typeInfo.type.name}`}>
              {typeInfo.type.name}
            </span>
          ))}
        </div>

        <div className="detail-stats">
          <h3>Estatísticas Base</h3>
          <ul>
            {pokemon.stats.map((statInfo, index) => (
              <li key={index}>
                <span>{statInfo.stat.name}:</span>
                <span>{statInfo.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-abilities">
          <h3>Habilidades</h3>
          <ul>
            {pokemon.abilities.map((abilityInfo, index) => (
              <li key={index}>{abilityInfo.ability.name}</li>
            ))}
          </ul>
        </div>

        <div className="detail-dimensions">
          <h3>Dimensões</h3>
          <p>Altura: {pokemon.height / 10} m</p>
          <p>Peso: {pokemon.weight / 10} kg</p>
        </div>
      </div>
    </div>
  );

}

export default PokemonDetail;