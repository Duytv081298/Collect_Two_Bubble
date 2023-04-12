

export enum SCENE {
    game = "game",
    home = "home"
};
export enum SIZE {
    widthDot = 79,
    heightDot = 82,
    beginX = -237.5,
    beginY = 235.6,
    spaceX = 95,
    spaceY = 95.3
};
export enum BOOSTER {
    rocket = 0,
    bomb = 1,
    reverse = 2,
    hammer = 3

};
export const TOTAL_BALL = 36;
export const MAX_MOVE = 2;
export const GOLD_DEFAULT = 300;
export const GOLD_USE_BOOSTER = 300;
export const MAXCOLUMNBOARD = 6;
export const MAXROWBOARD = 6;
export const DEFAULT_MAP = [
    [0, 3, 1, 0, 4, 4],
    [0, 4, 1, 0, 2, 2],
    [0, 2, 4, 4, 3, 0],
    [3, 0, 1, 2, 2, 4],
    [3, 0, 1, 2, 2, 4],
    [3, 3, 3, 3, 3, 3]
]