import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ReadEventDTO } from '@/types/event.types';
import { getItem, setItem, deleteItemAsync } from 'expo-secure-store';

const BOOKMARK_KEY = 'event-bookmarks';

interface BookmarkState {
    bookmarkedEvents: Record<string, ReadEventDTO>;
    recentlyViewed: string[];
    isBookmarked: (eventId: string) => boolean;
    addBookmark: (event: ReadEventDTO) => void;
    removeBookmark: (eventId: string) => void;
    toggleBookmark: (event: ReadEventDTO) => void;
    clearAllBookmarks: () => void;
    getBookmarkedEvents: () => ReadEventDTO[];
    addToRecentlyViewed: (eventId: string) => void;
    getRecentlyViewedEvents: (limit?: number) => string[];
}

const secureStorage = {
    getItem: async (name: string) => {
        try {
            const value = await getItem(name);
            return value || null;
        } catch (error) {
            console.error('Error reading from secure storage:', error);
            return null;
        }
    },
    setItem: async (name: string, value: string) => {
        try {
            await setItem(name, value);
        } catch (error) {
            console.error('Error writing to secure storage:', error);
        }
    },
    removeItem: async (name: string) => {
        try {
            await deleteItemAsync(name);
        } catch (error) {
            console.error('Error removing from secure storage:', error);
        }
    }
};

export const useBookmarkStore = create<BookmarkState>()(
    persist(
        (set, get) => ({
            bookmarkedEvents: {},
            recentlyViewed: [],

            isBookmarked: (eventId: string) => {
                return !!get().bookmarkedEvents[eventId];
            },

            addBookmark: (event: ReadEventDTO) => {
                set((state) => ({
                    bookmarkedEvents: {
                        ...state.bookmarkedEvents,
                        [event.id]: event
                    }
                }));
            },

            removeBookmark: (eventId: string) => {
                set((state) => {
                    const newBookmarks = { ...state.bookmarkedEvents };
                    delete newBookmarks[eventId];
                    return { bookmarkedEvents: newBookmarks };
                });
            },

            toggleBookmark: (event: ReadEventDTO) => {
                const isCurrentlyBookmarked = get().isBookmarked(event.id);
                if (isCurrentlyBookmarked) {
                    get().removeBookmark(event.id);
                } else {
                    get().addBookmark(event);
                }
            },

            clearAllBookmarks: () => {
                set({ bookmarkedEvents: {} });
            },

            getBookmarkedEvents: () => {
                return Object.values(get().bookmarkedEvents);
            },

            addToRecentlyViewed: (eventId: string) => {
                set((state) => {
                    // Remove if already exists
                    const filtered = state.recentlyViewed.filter(id => id !== eventId);
                    // Add to beginning (most recent)
                    return { recentlyViewed: [eventId, ...filtered].slice(0, 10) }; // Keep last 10
                });
            },

            getRecentlyViewedEvents: (limit = 5) => {
                return get().recentlyViewed.slice(0, limit);
            }
        }),
        {
            name: BOOKMARK_KEY,
            storage: createJSONStorage(() => secureStorage),
        }
    )
);