
import { MOCK_ARTWORKS } from '../constants';
import { Artwork } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ArtworkService = {
  /**
   * Fetch all artworks with a simulated network delay
   */
  getAllArtworks: async (): Promise<Artwork[]> => {
    await delay(800); // Simulate 800ms network latency
    return [...MOCK_ARTWORKS];
  },

  /**
   * Fetch artworks by filter criteria
   */
  getArtworksByFilter: async (category: string, query: string, aiFilter: 'all' | 'ai_only' | 'human_only'): Promise<Artwork[]> => {
    await delay(600); // Simulate search latency
    
    return MOCK_ARTWORKS.filter(art => {
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
  }
};
