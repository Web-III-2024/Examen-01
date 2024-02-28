import axios from "axios";
import { useEffect, useState } from "react";
import PokemonCard from "./CartaPokemon";
import "../styles/style.css";
import Modal from "./PokemonDetails";
import { useNavigate } from "react-router-dom";

interface GenerationRange {
  offset: number;
  limit: number;
}

const generationRanges: Record<number, GenerationRange> = {
  1: { offset: 0, limit: 151 },
  2: { offset: 151, limit: 100 },
  3: { offset: 251, limit: 135 },
  4: { offset: 386, limit: 107 },
  5: { offset: 493, limit: 156 },
  6: { offset: 649, limit: 72 },
  7: { offset: 721, limit: 88 },
  8: { offset: 809, limit: 89 },
};

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  height: number;
  weight: number;
}

const Home = () => {
  const [generation, setGeneration] = useState(1);
  const [tempGeneration, setTempGeneration] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const navigate = useNavigate();

  const fetchPokemons = (gen: number) => {
    const { offset, limit } = generationRanges[gen];
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
      .then((response) => {
        const fetches = response.data.results.map((pokemon: { name: string; url: string }) => axios.get(pokemon.url));
        return Promise.all(fetches);
      })
      .then((responses) => {
        const pokemonData: Pokemon[] = responses.map((response) => ({
          id: response.data.id,
          name: response.data.name,
          image: response.data.sprites.front_default,
          types: response.data.types,
          abilities: response.data.abilities,
          height: response.data.height,
          weight: response.data.weight,
        }));
        setPokemons(pokemonData);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  };
  
  useEffect(() => {
    fetchPokemons(generation);
  }, [generation]);

  const handleCardClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  const applyFilters = () => {
    setGeneration(tempGeneration);
  };

  return (
    <div>
      <select value={tempGeneration} onChange={(e) => setTempGeneration(Number(e.target.value))}>
        {Object.keys(generationRanges).map((gen) => (
          <option key={gen} value={gen}>
            Generación {gen}
          </option>
        ))}
      </select>

      <button onClick={applyFilters}>Aplicar Filtros</button>

      <div className="pokemon-container">
        {pokemons.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            id={pokemon.id}
            name={pokemon.name}
            image={pokemon.image}
            types={pokemon.types}
            abilities={pokemon.abilities}
            onClick={() => handleCardClick(pokemon)}
          />
        ))}
      </div>

      {/* El modal para detalles del Pokémon */}
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        {selectedPokemon && (
          <div className="pokemon-details">
            <h1>Nombre de esta belleza: {selectedPokemon.name}</h1>
            <img src={selectedPokemon.image} alt={selectedPokemon.name} />
            <h2>Number: {selectedPokemon.id}</h2>
            <h2>Height: {selectedPokemon.height}</h2>
            <h2>Weight: {selectedPokemon.weight}</h2>
            <h2>Types: {selectedPokemon.types.map(type => type.type.name).join(", ")}</h2>
            <h2>Abilities: {selectedPokemon.abilities.map(ability => ability.ability.name).join(", ")}</h2>
            {/* Aquí podrías mostrar los movimientos si tienes esa información */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
