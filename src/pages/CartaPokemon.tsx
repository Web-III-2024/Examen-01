// PokemonCard.tsx

import React from 'react';

interface PokemonCardProps {
  id: number;
  name: string;
  image: string;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string } }>;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps & { onClick: () => void }> = ({ id, name, image, types, abilities, onClick }) => {
  return (
    <div className="pokemon-card" onClick={onClick}>
      <img className="imagen" src={image} alt={name} />
      <h2 className="pokemon-name">{name}</h2>
      <div className="pokemon-types">
        {types.map(typeInfo => (  
          <span className="pokemon-type" key={typeInfo.type.name}>{typeInfo.type.name}</span>
        ))}
      </div>
      <div className="pokemon-abilities">
        <h4>Habilidades:</h4>
        {abilities.map(abilityInfo => (
          <span className="pokemon-ability" key={abilityInfo.ability.name}>{abilityInfo.ability.name}</span>
        ))}
      </div>
    </div>
  );
};


export default PokemonCard;