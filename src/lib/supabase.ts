import { createClient } from '@supabase/supabase-js';
import { MindMapNode, MindMapEdge } from '../types';

// Default to empty strings to prevent runtime errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
const validateSupabaseConfig = () => {
  if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    console.error('Invalid or missing VITE_SUPABASE_URL');
    return false;
  }
  if (!supabaseKey) {
    console.error('Missing VITE_SUPABASE_ANON_KEY');
    return false;
  }
  return true;
};

// Create client only if config is valid
export const supabase = validateSupabaseConfig()
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export interface SavedMindMap {
  id: string;
  name: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  created_at: string;
  updated_at: string;
}

export const saveMindMap = async (name: string, nodes: MindMapNode[], edges: MindMapEdge[]) => {
  if (!supabase) throw new Error('Supabase client not initialized');
  
  const { data, error } = await supabase
    .from('mindmaps')
    .insert([{ name, nodes, edges }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const loadMindMap = async (id: string) => {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('mindmaps')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as SavedMindMap;
};

export const listMindMaps = async () => {
  if (!supabase) throw new Error('Supabase client not initialized');

  const { data, error } = await supabase
    .from('mindmaps')
    .select('id, name, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};