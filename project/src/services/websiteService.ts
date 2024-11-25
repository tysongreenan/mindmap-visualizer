import axios from 'axios';
import { MindMapNode, MindMapEdge } from '../types';

const API_URL = 'http://localhost:3001';

export interface WebsiteData {
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

export const processWebsite = async (url: string): Promise<WebsiteData> => {
  try {
    const response = await axios.post(`${API_URL}/scrape`, { url });
    return response.data;
  } catch (error) {
    console.error('Error processing website:', error);
    throw new Error('Failed to process website. Please check the URL and try again.');
  }
};