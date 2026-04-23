import { ReactNode } from 'react';
import { DataEmojis } from '../dataUtils/DataTypes';
export declare function useEmojiVirtualization({ categoryEmojis, topOffset, onHeightReady, scrollTop, isCategoryVisible }: {
    categoryEmojis: DataEmojis;
    topOffset: number;
    onHeightReady: (height: number) => void;
    scrollTop: number;
    isCategoryVisible: boolean;
}): {
    virtualizedCounter: number;
    emojis: ReactNode[];
    dimensions: {
        categoryHeight: number;
        emojisPerRow: number;
        emojiSize: number;
    } | undefined;
};
