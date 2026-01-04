import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { CreateNoteData } from '../api/clientApi';

type NoteDraftStore = {
    draft: CreateNoteData;
    setDraft: (draft: CreateNoteData) => void;
    clearDraft: () => void;
}

const initialDraft: CreateNoteData = {
    title: '',
    content: '',
    tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(persist(
    (set) => ({
        draft: initialDraft,
        setDraft: (draft) => set({ draft }),
        clearDraft: () => set({ draft: initialDraft }),
    }),
    {
        name: 'note-draft',
        partialize: (state) => ({ draft: state.draft }),
    }
));