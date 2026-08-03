// Loads a tile map JSON definition (see assets/maps/pallet-town.json).
export async function loadMap(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load map at ${path}: ${res.status}`);
  }
  return res.json();
}

export async function loadPokemonData(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load pokemon data at ${path}: ${res.status}`);
  }
  return res.json();
}
