export declare function shouldVirtualize({ scrollTop, clientHeight, topOffset, style, dimensions }: {
    scrollTop: number;
    clientHeight: number;
    topOffset: number;
    style: {
        top: number;
    } | undefined;
    dimensions: Dimensions;
}): boolean;
export declare function getEmojiPositionStyle(dimensions: Dimensions, index: number): {
    top: number;
    left: number;
} | undefined;
export declare type Dimensions = {
    emojiSize: number;
    emojisPerRow: number;
    categoryHeight: number;
} | undefined;
