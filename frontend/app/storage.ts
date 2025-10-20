// Simple storage for game stats
export const recordGameResult = (winner: string, element: string) => {
  console.log(`Game result: ${winner} won with ${element}`);
};

export const getGameStats = () => {
  return {
    gamesPlayed: 0,
    wins: { fire: 0, water: 0, earth: 0, wind: 0 },
    currentStreak: 0
  };
};