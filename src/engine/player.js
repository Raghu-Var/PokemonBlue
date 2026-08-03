export const DIRECTIONS = {
  DOWN: "down",
  UP: "up",
  LEFT: "left",
  RIGHT: "right",
};

const MOVE_COOLDOWN_MS = 150;

// Grid-based player character. Moves exactly one tile per input, mirroring
// the classic Pokémon overworld feel, with simple collision checks against
// the map's collision layer and any NPCs occupying a tile.
export class Player {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.direction = DIRECTIONS.DOWN;
    this.lastMoveAt = 0;
  }

  facingTile() {
    switch (this.direction) {
      case DIRECTIONS.UP:
        return { x: this.x, y: this.y - 1 };
      case DIRECTIONS.DOWN:
        return { x: this.x, y: this.y + 1 };
      case DIRECTIONS.LEFT:
        return { x: this.x - 1, y: this.y };
      case DIRECTIONS.RIGHT:
        return { x: this.x + 1, y: this.y };
      default:
        return { x: this.x, y: this.y };
    }
  }

  canMove(now) {
    return now - this.lastMoveAt >= MOVE_COOLDOWN_MS;
  }

  // Attempts to move one tile in `direction`. Always updates facing so the
  // player turns to face a direction even when blocked, just like the
  // original games. Returns true if the player actually moved.
  tryMove(direction, map, npcs, now) {
    this.direction = direction;

    if (!this.canMove(now)) {
      return false;
    }

    let nextX = this.x;
    let nextY = this.y;
    switch (direction) {
      case DIRECTIONS.UP:
        nextY -= 1;
        break;
      case DIRECTIONS.DOWN:
        nextY += 1;
        break;
      case DIRECTIONS.LEFT:
        nextX -= 1;
        break;
      case DIRECTIONS.RIGHT:
        nextX += 1;
        break;
    }

    if (!isWalkable(map, nextX, nextY, npcs)) {
      return false;
    }

    this.x = nextX;
    this.y = nextY;
    this.lastMoveAt = now;
    return true;
  }
}

export function isWalkable(map, x, y, npcs = []) {
  if (y < 0 || y >= map.height || x < 0 || x >= map.width) {
    return false;
  }
  if (map.collision[y][x] !== 0) {
    return false;
  }
  if (npcs.some((npc) => npc.x === x && npc.y === y)) {
    return false;
  }
  return true;
}
