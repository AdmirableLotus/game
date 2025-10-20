import { StyleSheet } from 'react-native';

export const zeldaStyles = StyleSheet.create({
  // Main game container with Zelda-style borders
  gameContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderWidth: 4,
    borderColor: '#8B4513',
    borderRadius: 8,
  },
  
  // Status bars (health/mana) - classic Zelda style
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#2F4F2F',
    borderBottomWidth: 3,
    borderBottomColor: '#8B4513',
  },
  
  healthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  
  manaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00008B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Inventory panel - Zelda-style item grid
  inventoryPanel: {
    position: 'absolute',
    top: 80,
    right: 10,
    width: 120,
    backgroundColor: '#2F4F2F',
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 8,
  },
  
  panelTitle: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  itemSlot: {
    width: 32,
    height: 32,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#8B4513',
    borderRadius: 4,
    margin: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  itemText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Mini-map in classic Zelda style
  minimap: {
    position: 'absolute',
    top: 80,
    left: 10,
    width: 120,
    height: 120,
    backgroundColor: '#2F4F2F',
    borderWidth: 3,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 8,
  },
  
  minimapTitle: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  
  // Territory tiles with Zelda-style pixel art feel
  zeldaTile: {
    width: 48,
    height: 48,
    margin: 1,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  // Elemental realm styles
  fireRealm: {
    backgroundColor: '#FF4500',
    borderColor: '#8B0000',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  waterRealm: {
    backgroundColor: '#1E90FF',
    borderColor: '#00008B',
    shadowColor: '#00CED1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  earthRealm: {
    backgroundColor: '#228B22',
    borderColor: '#8B4513',
    shadowColor: '#32CD32',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  windRealm: {
    backgroundColor: '#87CEEB',
    borderColor: '#708090',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  // Guardian and special territory indicators
  guardianTile: {
    borderWidth: 4,
    borderColor: '#FFD700',
    backgroundColor: '#8B0000',
  },
  
  treasureTile: {
    borderWidth: 3,
    borderColor: '#FFD700',
    backgroundColor: '#DAA520',
  },
  
  // Hero avatar and army indicators
  heroAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#32CD32',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  armyCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  
  // Dialog boxes - classic Zelda text style
  dialogBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#2F4F2F',
    borderWidth: 4,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 16,
    minHeight: 80,
  },
  
  dialogText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace', // Retro font feel
  },
  
  // Action buttons with Zelda styling
  zeldaButton: {
    backgroundColor: '#4169E1',
    borderWidth: 3,
    borderColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  
  zeldaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  // Title screen with classic Zelda feel
  zeldaTitleContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(45deg, #2F4F2F, #0a0a0a)',
  },
  
  zeldaTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 2,
  },
  
  zeldaSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
    maxWidth: '80%',
    lineHeight: 24,
  },
});