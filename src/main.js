import { Input, KEYS, anyPressed, anyDown } from "./engine/input.js";
import { loadMap } from "./engine/mapLoader.js";
import { Renderer, TILE_SIZE } from "./engine/renderer.js";
import { Player, DIRECTIONS } from "./engine/player.js";
import { loadNpcs } from "./engine/npc.js";
import { Dialog } from "./engine/dialog.js";
import { INTRO_STORY } from "./story.js";

const STATE = {
  INTRO: "intro",
  OVERWORLD: "overworld",
  DIALOG: "dialog",
};

const DIRECTION_KEYS = [
  [KEYS.UP, DIRECTIONS.UP],
  [KEYS.DOWN, DIRECTIONS.DOWN],
  [KEYS.LEFT, DIRECTIONS.LEFT],
  [KEYS.RIGHT, DIRECTIONS.RIGHT],
];

async function main() {
  const canvas = document.getElementById("game");
  const renderer = new Renderer(canvas);
  const input = new Input();
  const dialog = new Dialog();

  const map = await loadMap("./assets/maps/pallet-town.json");
  canvas.width = map.width * TILE_SIZE;
  canvas.height = map.height * TILE_SIZE;

  const npcs = loadNpcs(map);
  const player = new Player(map.playerStart.x, map.playerStart.y);

  let state = STATE.INTRO;
  dialog.start(INTRO_STORY, () => {
    state = STATE.OVERWORLD;
  });

  function handleOverworldInput(now) {
    for (const [keys, direction] of DIRECTION_KEYS) {
      if (anyDown(input, keys)) {
        player.tryMove(direction, map, npcs, now);
        break;
      }
    }

    if (anyPressed(input, KEYS.ACTION)) {
      const target = player.facingTile();
      const npc = npcs.find((n) => n.isAt(target.x, target.y));
      if (npc && npc.dialog.length > 0) {
        state = STATE.DIALOG;
        dialog.start(npc.dialog, () => {
          state = STATE.OVERWORLD;
        });
      }
    }
  }

  function handleDialogInput() {
    if (anyPressed(input, KEYS.ACTION)) {
      dialog.advance();
    }
  }

  function frame(now) {
    if (state === STATE.OVERWORLD) {
      handleOverworldInput(now);
    } else if (state === STATE.INTRO || state === STATE.DIALOG) {
      handleDialogInput();
    }

    renderer.clear();
    renderer.drawMap(map);
    renderer.drawNpcs(npcs);
    renderer.drawPlayer(player);

    if (dialog.active) {
      renderer.drawDialog(dialog.currentText);
    }

    input.endFrame();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

main().catch((err) => {
  console.error("Failed to start game:", err);
  document.body.innerHTML = `<pre style="color:#f55;padding:16px;">Failed to load game: ${err.message}</pre>`;
});
