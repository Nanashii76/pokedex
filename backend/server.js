const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Route to search a pokemon by ID or name
app.get('/api/pokemon/:identifier', async (req, res) => {
    const { identifier } = req.params;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ message: error.response.data });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

// Route to get a list of all pokemon (with pagination)
app.get('/api/pokemons', async (req, res) => {
    const {offset = 0, limit = 20} = req.query;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
        const pokemons = response.data.results;

        // For each pokemon, fetch additional details
        const detailedPokemons = await Promise.all(
            pokemons.map(async (pokemon) => {
                const detailsResponse = await axios.get(pokemon.url);
                return {
                    name: pokemon.name,
                    id: detailsResponse.data.id,
                    image: detailsResponse.data.sprites.front_default,
                    types: detailsResponse.data.types.map(typeInfo => typeInfo.type.name)
                };
            })
        );

        res.json({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous,
            results: detailedPokemons,
        });
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ message: error.response.data });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});