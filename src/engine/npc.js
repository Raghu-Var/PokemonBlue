// Simple wrapper around the plain NPC objects defined in map JSON
// (`{ x, y, sprite, dialog }`), giving them a name to look up sprite color
// and a helper to check whether the player is currently facing them.
export class NPC {
  constructor(def) {
    this.x = def.x;
    this.y = def.y;
    this.sprite = def.sprite;
    this.dialog = def.dialog ?? [];
  }

  isAt(x, y) {
    return this.x === x && this.y === y;
  }
}

export function loadNpcs(mapData) {
  return (mapData.npcs ?? []).map((def) => new NPC(def));
}
