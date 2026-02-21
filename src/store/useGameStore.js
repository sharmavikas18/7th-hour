import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGameStore = create(
    persist(
        (set, get) => ({
            // core state
            currentChapter: 1,
            currentSceneId: 'intro',

            // alignments
            stability: 0,
            chaos: 0,
            knowledge: 0,

            // trust system
            characterTrust: {
                kael: 0,
                mira: 0,
                professor: 0
            },

            // progression
            unlockedSpells: ['Basic'], // Basic, Stabilize, Amplify, etc.
            flags: {},
            fractureLevel: 0,

            // Game flags
            gameEnded: false,
            endingId: null,
            isFractured: false,
            soundEnabled: true,

            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

            // history for 2D mode navigation
            past: [],
            future: [],

            // Actions
            updateAlignment: (type, amount) => set((state) => ({
                [type]: Math.max(0, Math.min(100, state[type] + amount)),
                isFractured: (state.chaos > 30 || state.fractureLevel > 3)
            })),

            updateTrust: (character, amount) => set((state) => ({
                characterTrust: {
                    ...state.characterTrust,
                    [character]: state.characterTrust[character] + amount
                }
            })),

            setFlag: (key, value) => set((state) => ({
                flags: { ...state.flags, [key]: value }
            })),

            incrementFracture: () => set((state) => ({
                fractureLevel: state.fractureLevel + 1
            })),

            makeChoice: (choice) => {
                const state = get();

                // save history
                const snapshot = {
                    currentSceneId: state.currentSceneId,
                    stability: state.stability,
                    chaos: state.chaos,
                    knowledge: state.knowledge,
                    fractureLevel: state.fractureLevel
                };

                // Apply effects
                if (choice.effects) {
                    if (choice.effects.stability) state.updateAlignment('stability', choice.effects.stability);
                    if (choice.effects.chaos) state.updateAlignment('chaos', choice.effects.chaos);
                    if (choice.effects.knowledge) state.updateAlignment('knowledge', choice.effects.knowledge);
                    if (choice.effects.trust) {
                        Object.entries(choice.effects.trust).forEach(([char, val]) => {
                            state.updateTrust(char, val);
                        });
                    }
                    if (choice.effects.flag) state.setFlag(choice.effects.flag.key, choice.effects.flag.value);
                }

                if (choice.nextScene) {
                    set({
                        currentSceneId: choice.nextScene,
                        past: [...state.past, snapshot],
                        future: []
                    });
                }

                if (choice.ending) {
                    set({ gameEnded: true, endingId: choice.ending });
                }
            },

            goBack: () => set((state) => {
                if (state.past.length === 0) return {};
                const previous = state.past[state.past.length - 1];
                const newPast = state.past.slice(0, -1);
                const current = {
                    currentSceneId: state.currentSceneId,
                    stability: state.stability,
                    chaos: state.chaos,
                    knowledge: state.knowledge,
                    fractureLevel: state.fractureLevel
                };
                return {
                    ...previous,
                    past: newPast,
                    future: [current, ...state.future]
                };
            }),

            goForward: () => set((state) => {
                if (state.future.length === 0) return {};
                const nextState = state.future[0];
                const newFuture = state.future.slice(1);
                const current = {
                    currentSceneId: state.currentSceneId,
                    stability: state.stability,
                    chaos: state.chaos,
                    knowledge: state.knowledge,
                    fractureLevel: state.fractureLevel
                };
                return {
                    ...nextState,
                    past: [...state.past, current],
                    future: newFuture
                };
            }),

            resetGame: () => set({
                currentChapter: 1,
                currentSceneId: 'intro',
                stability: 0,
                chaos: 0,
                knowledge: 0,
                characterTrust: { kael: 0, mira: 0, professor: 0 },
                unlockedSpells: ['Basic'],
                flags: {},
                fractureLevel: 0,
                gameEnded: false,
                endingId: null,
                isFractured: false,
                past: [],
                future: []
            })
        }),
        { name: '7th-hour-advanced-storage' }
    )
);
