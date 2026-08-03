const TILE_SIZE = 32;

// Basic color palette for tile ids until real tileset art is available
// (assets/sprites/tilesets/overworld.png is currently an empty placeholder).
const TILE_COLORS = {
  1: "#3b3b3b", // wall / border
  2: "#5fae4a", // grass / path
  3: "#3f8f3a", // tree / bush cluster (visual variety, still walkable per collision layer)
  4: "#8a6d3b", // house / special decoration
};

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  clear() {
    const { ctx, canvas } = this;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawMap(map) {
    const { ctx } = this;
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x];
        ctx.fillStyle = TILE_COLORS[tile] ?? "#222";
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  drawNpcs(npcs) {
    const { ctx } = this;
    for (const npc of npcs) {
      const cx = npc.x * TILE_SIZE + TILE_SIZE / 2;
      const cy = npc.y * TILE_SIZE + TILE_SIZE / 2;
      ctx.fillStyle = "#d64545";
      ctx.beginPath();
      ctx.arc(cx, cy, TILE_SIZE / 2 - 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlayer(player) {
    const { ctx } = this;
    const px = player.x * TILE_SIZE;
    const py = player.y * TILE_SIZE;

    ctx.fillStyle = "#f2d24b";
    ctx.beginPath();
    ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, TILE_SIZE / 2 - 4, 0, Math.PI * 2);
    ctx.fill();

    // Small directional indicator so the player's facing is always visible.
    ctx.fillStyle = "#1a1a1a";
    const cx = px + TILE_SIZE / 2;
    const cy = py + TILE_SIZE / 2;
    const r = 4;
    const offsets = {
      down: [0, r + 2],
      up: [0, -(r + 2)],
      left: [-(r + 2), 0],
      right: [r + 2, 0],
    };
    const [ox, oy] = offsets[player.direction] ?? offsets.down;
    ctx.beginPath();
    ctx.arc(cx + ox, cy + oy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  drawDialog(text) {
    const { ctx, canvas } = this;
    const boxHeight = 72;
    const y = canvas.height - boxHeight - 8;

    ctx.fillStyle = "rgba(10, 10, 20, 0.92)";
    ctx.fillRect(8, y, canvas.width - 16, boxHeight);
    ctx.strokeStyle = "#f2f2f2";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, y, canvas.width - 16, boxHeight);

    ctx.fillStyle = "#ffffff";
    ctx.font = "12px 'Courier New', monospace";
    wrapText(ctx, text, 20, y + 20, canvas.width - 40, 16);

    ctx.font = "10px 'Courier New', monospace";
    ctx.fillStyle = "#f2d24b";
    ctx.fillText("▼ Z", canvas.width - 40, canvas.height - 16);
  }
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
  }
}

export { TILE_SIZE };
