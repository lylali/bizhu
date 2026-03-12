import { create } from 'zustand';
import { Character, CharacterRelation } from '@shared';

interface CharacterState {
  characters: Character[];
  relations: CharacterRelation[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCharacters: (characters: Character[]) => void;
  setRelations: (relations: CharacterRelation[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
  characters: [],
  relations: [],
  isLoading: false,
  error: null,

  setCharacters: (characters) => set({ characters }),
  setRelations: (relations) => set({ relations }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearData: () => set({ characters: [], relations: [], error: null }),
}));