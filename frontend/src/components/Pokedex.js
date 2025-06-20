import React, {useState, useEffect} from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard";
import "../styles/Pokedex.css";

const API_BASE_URL = process.env.API_BASE_URL;

function Pokedex() {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 20;

    const loadPokemons = async (currentOffset) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/pokemons?offset=${currentOffset}&limit=${limit}`);
            setPokemonList(prevList => [...prevList, ...response.data.results]);
            setTotalCount(response.data.count);

        } catch (err) {
            setError("Error to load Pokémon data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const serachPokemon = async () => {
        if(!searchTerm.trim()) {
            setError("Please enter a Pokémon name or ID.");
            setPokemonList([]);
            return;
        }

        setLoading(true);
        setError(null);
        setPokemonList([]);
        try {
            const response = await axios.get(`${API_BASE_URL}/pokemon/${searchTerm.toLowerCase()}`);
            setPokemonList([response.data]);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("Pokémon not found.");
            } else {
                setError("Error to search Pokémon.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadPokemons(offset);
    }, [offset]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if(searchTerm.trim()) {
            serachPokemon();
        } else {
            setOffset(0);
            setPokemonList([]);
            loadPokemons(0);
        }
    }

    const handleLoadMore = () => {
        if (pokemonList.length < totalCount) {
            setOffset(prevOffset => prevOffset + limit);
        }
    }

  return (
    <div className="pokedex-container">
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="Pesquisar Pokémon por nome ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Buscar</button>
        <button type="button" onClick={() => {
            setSearchTerm('');
            setOffset(0);
            setPokemonList([]);
            loadPokemons(0);
        }} className="clear-button">Limpar Busca</button>
      </form>

      {loading && <p className="loading-message">Carregando Pokémon...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.id || pokemon.name} pokemon={pokemon} />
        ))}
      </div>

      {!searchTerm && pokemonList.length < totalCount && (
        <button onClick={handleLoadMore} className="load-more-button" disabled={loading}>
          {loading ? 'Carregando...' : 'Carregar Mais'}
        </button>
      )}
    </div>
  );
}

export default Pokedex;