# Mini Pokémon Blue – Browser Edition

A small browser recreation of the Pokémon Blue overworld, built with
plain HTML5 Canvas and vanilla JavaScript (no build step required).

## Features

- **Introduction story** – an opening narrative sequence (styled after
  Professor Oak's classic monologue) plays before the player takes control.
- **Pallet Town home space** – the starting map, rendered from
  `assets/maps/pallet-town.json`.
- **Grid-based player movement** – move with Arrow keys or WASD; the
  player character turns to face the pressed direction and steps one
  tile at a time, blocked by walls and NPCs per the map's collision layer.
- **NPC dialog** – press `Z` (or `Enter`/`Space`) while facing an NPC to
  read their dialog, defined per-NPC in the map data.

## Controls

| Action        | Keys                    |
|---------------|-------------------------|
| Move          | Arrow keys / `W A S D`  |
| Talk / Advance text | `Z`, `Enter`, or `Space` |

## Running locally

No build tools are required — it's plain ES modules loaded directly by
the browser. Serve the repo root with any static file server, e.g.:

```sh
python -m http.server 8000
# then open http://localhost:8000/index.html
```

## Project structure

```
index.html            Entry point, loads src/main.js as a module
src/main.js            Game bootstrap and main loop (state machine: intro → overworld → dialog)
src/story.js            Intro narrative text
src/engine/input.js      Keyboard input handling
src/engine/mapLoader.js  Fetches map/pokemon JSON data
src/engine/player.js     Player grid movement + collision
src/engine/npc.js        NPC data wrapper
src/engine/dialog.js     Paginated dialog box state
src/engine/renderer.js   Canvas rendering (map, player, NPCs, dialog box)
assets/maps/             Tile map definitions
assets/data/             Pokémon data
assets/sprites/          Tileset art (placeholder)
```
