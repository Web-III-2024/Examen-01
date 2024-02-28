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

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  height: number;
  weight: number;
  moves: Array<{ move: { name: string } }>;
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

const Home = () => {
  const [generation, setGeneration] = useState(1);
  const [tempGeneration, setTempGeneration] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showMoves, setShowMoves] = useState(false);
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
          moves: response.data.moves,
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

  const toggleShowMoves = () => {
    setShowMoves(!showMoves);
  };

  return (
    <div>
      <div className="filtros">
      <select className="selector" value={tempGeneration} onChange={(e) => setTempGeneration(Number(e.target.value))}>
        {Object.keys(generationRanges).map((gen) => (
          <option key={gen} value={gen}>
            Generación {gen}
          </option>
        ))}
      </select>

      <button onClick={applyFilters} className="btn">Aplicar Filtros</button>
      </div>
      <div className="pokemon-container">
        {pokemons.map((pokemon) => (
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

      <Modal isOpen={isModalOpen} closeModal={closeModal} >
        {selectedPokemon && (
          <div className="pokemon-details">
            <h1>{selectedPokemon.name}</h1>
            <img src={selectedPokemon.image} alt={selectedPokemon.name} />
            <h4>Número: {selectedPokemon.id}</h4>
            <h4>Altura: {selectedPokemon.height}</h4>
            <h4>Peso: {selectedPokemon.weight}</h4>
            <h4>Tipos: {selectedPokemon.types.map((type) => type.type.name).join(", ")}</h4>
            <h4>Habilidades: {selectedPokemon.abilities.map((ability) => ability.ability.name).join(", ")}</h4>
            <button className="botonzote" onClick={toggleShowMoves}>{showMoves ? "Ocultar Movimientos" : "Mostrar Movimientos"}</button>
            {showMoves && (
              <div className="contenedor-movimientos">
                <h2>Movimientos:</h2>
                <ul>
                  {selectedPokemon.moves.map((move) => (
                    <li key={move.move.name}>{move.move.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
