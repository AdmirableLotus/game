import AsyncStorage from '@react-native-async-storage/async-storage';

interface GameStats {
  gamesPlayed: number;
  wins: { [element: string]: number };
  totalWins: number;
  winStreak: number;
  bestWinStreak: number;
}

const STORAGE_KEY = 'elemental_conquest_stats';

const defaultStats: GameStats = {
  gamesPlayed: 0,
  wins: { fire: 0, water: 0, earth: 0, wind: 0 },
  totalWins: 0,
  winStreak: 0,
  bestWinStreak: 0,
};

export const getGameStats = async (): Promise<GameStats> => {
  try {
    const stats = await AsyncStorage.getItem(STORAGE_KEY);
    return stats ? JSON.parse(stats) : defaultStats;
  } catch {
    return defaultStats;
  }
};

export const recordGameResult = async (playerElement: string, won: boolean): Promise<void> => {
  try {
    const stats = await getGameStats();
    
    stats.gamesPlayed++;
    
    if (won) {
      stats.wins[playerElement] = (stats.wins[playerElement] || 0) + 1;
      stats.totalWins++;
      stats.winStreak++;
      stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.winStreak);
    } else {
      stats.winStreak = 0;
    }
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save game stats:', error);
  }
};

export const resetStats = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStats));
  } catch (error) {
    console.error('Failed to reset stats:', error);
  }
};