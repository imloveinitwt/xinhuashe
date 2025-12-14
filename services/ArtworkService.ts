
import { DB } from './db'; // Use DB instead of direct constants
import { Artwork } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ArtworkService = {
  /**
   * Fetch all artworks with a simulated network delay
   */
  getAllArtworks: async (): Promise<Artwork[]> => {
    await delay(800); // Simulate 800ms network latency
    return DB.artworks.getAll();
  },

  /**
   * Fetch artworks by filter criteria
   */
  getArtworksByFilter: async (category: string, query: string, aiFilter: 'all' | 'ai_only' | 'human_only'): Promise<Artwork[]> => {
    await delay(600); // Simulate search latency
    
    // Get fresh data from DB
    const allArtworks = DB.artworks.getAll();

    return allArtworks.filter(art => {
      const matchCategory = category === '全部' || art.tags.includes(category);
      const matchSearch = 
        art.title.toLowerCase().includes(query.toLowerCase()) || 
        art.artist.toLowerCase().includes(query.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      const matchAi = 
        aiFilter === 'all' ? true :
        aiFilter === 'ai_only' ? art.isAiGenerated :
        !art.isAiGenerated;

      return matchCategory && matchSearch && matchAi;
    });
  },

  /**
   * Fetch single artwork details by ID
   */
  getArtworkById: async (id: string): Promise<Artwork | undefined> => {
    await delay(400); // Simulate fetch latency
    // Get fresh data from DB
    const artwork = DB.artworks.findById(id);
    
    if (artwork) {
      // Enrich with mock details if missing (DB might only store basic info for now)
      return {
        ...artwork,
        description: artwork.description || "这是一幅令人惊叹的数字艺术作品，探索了光影与构图的极致。创作灵感来源于日常生活中的瞬间，结合了现代数字绘画技术与传统美学理念。作品旨在传达一种独特的情感氛围，让观众在视觉的冲击下产生深刻的共鸣。",
        publishDate: artwork.publishDate || "2023-10-24",
        tools: artwork.tools || ["Photoshop", "Blender", "Procreate"],
        resolution: artwork.resolution || "4096 x 2160 px"
      };
    }
    return undefined;
  }
};
