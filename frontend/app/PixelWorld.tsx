import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

export const PixelWorld: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => setKeys(k => ({ ...k, [e.key]: true }));
    const handleUp = (e: KeyboardEvent) => setKeys(k => ({ ...k, [e.key]: false }));
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const tileSize = 32;
    const map = [
      [1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,2,0,0,3,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,2,0,0,0,0,0,0,3,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,3,0,0,0,0,2,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    const player = { x: 2, y: 2, dir: "down" as "up"|"down"|"left"|"right", frame: 0 };
    const territories = new Set<string>();
    const speed = 0.08;
    let lastTime = 0;

    const canMove = (nx: number, ny: number) =>
      map[Math.floor(ny)] && map[Math.floor(ny)][Math.floor(nx)] !== 1;

    const getTileColor = (tile: number) => {
      switch(tile) {
        case 0: return "#2d4a2d"; // grass
        case 1: return "#4a4a4a"; // wall
        case 2: return "#ff4d4d"; // fire
        case 3: return "#4d79ff"; // water
        default: return "#2d4a2d";
      }
    };

    function update(dt: number) {
      const oldX = player.x;
      const oldY = player.y;
      
      if (keys["ArrowUp"] && canMove(player.x, player.y - speed * dt)) {
        player.y -= speed * dt;
        player.dir = "up";
      }
      if (keys["ArrowDown"] && canMove(player.x, player.y + speed * dt)) {
        player.y += speed * dt;
        player.dir = "down";
      }
      if (keys["ArrowLeft"] && canMove(player.x - speed * dt, player.y)) {
        player.x -= speed * dt;
        player.dir = "left";
      }
      if (keys["ArrowRight"] && canMove(player.x + speed * dt, player.y)) {
        player.x += speed * dt;
        player.dir = "right";
      }
      
      // Check for territory capture
      const tileX = Math.floor(player.x);
      const tileY = Math.floor(player.y);
      const tileKey = `${tileX}-${tileY}`;
      
      if (map[tileY] && map[tileY][tileX] > 1 && !territories.has(tileKey)) {
        territories.add(tileKey);
      }
      
      if (oldX !== player.x || oldY !== player.y) {
        player.frame = (player.frame + dt * 0.01) % 4;
      }
    }

    function draw() {
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#0f0f1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw tiles
      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
          const tile = map[y][x];
          const tileKey = `${x}-${y}`;
          
          ctx.fillStyle = getTileColor(tile);
          ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          
          // Draw claimed territory overlay
          if (territories.has(tileKey)) {
            ctx.fillStyle = "rgba(255, 219, 88, 0.4)";
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          }
          
          // Draw tile borders
          ctx.strokeStyle = "#1a1a2e";
          ctx.lineWidth = 1;
          ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
          
          // Draw elemental icons
          if (tile === 2) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "16px Arial";
            ctx.fillText("🔥", x * tileSize + 8, y * tileSize + 20);
          } else if (tile === 3) {
            ctx.fillStyle = "#ffffff";
            ctx.font = "16px Arial";
            ctx.fillText("💧", x * tileSize + 8, y * tileSize + 20);
          }
        }
      }
      
      // Draw player
      ctx.fillStyle = "#ffff00";
      const px = player.x * tileSize + 4;
      const py = player.y * tileSize + 4;
      ctx.fillRect(px, py, tileSize - 8, tileSize - 8);
      
      // Player direction indicator
      ctx.fillStyle = "#ffffff";
      ctx.font = "20px Arial";
      ctx.fillText("🧙♂️", px, py + 16);
      
      // UI overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, canvas.width, 40);
      
      ctx.fillStyle = "#ffff00";
      ctx.font = "16px Arial";
      ctx.fillText(`Territories: ${territories.size}`, 10, 25);
      
      ctx.fillStyle = "#ffffff";
      ctx.fillText("Use arrow keys to move", canvas.width - 200, 25);
    }

    function loop(t: number) {
      const dt = t - lastTime;
      lastTime = t;
      update(dt);
      draw();
      requestAnimationFrame(loop);
    }
    
    requestAnimationFrame(loop);
  }, [keys]);

  return (
    <View style={styles.container}>
      <canvas 
        ref={canvasRef} 
        width={384} 
        height={256} 
        style={{ imageRendering: "pixelated" } as any}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
});