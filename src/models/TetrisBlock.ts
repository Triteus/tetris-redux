export function createSquareBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
    };
}

export function createTBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 1, y: 0, isCenter: true },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
    };
}

export function createLBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 1, y: 0, isCenter: true },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
    };
}

export function createReverseLBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 0, isCenter: true },
        { x: 2, y: 0 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
    };
}

export function createZBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 1, y: 0, isCenter: true },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
    };
}

export function createReverseZBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 1 },
        { x: 1, y: 1, isCenter: true },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
    };
}


export function createIBlock(tileWidth: number, tileHeight: number) {
    const fields = [
        { x: 0, y: 0 },
        { x: 1, y: 0, isCenter: true },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
    ];
    return {
        fields: translateBlock(fields, tileWidth, tileHeight),
    };
}

function translateBlock(
    coords: { x: number; y: number }[],
    tileWidth: number,
    tileHeight: number,
) {
    return coords.map(coord => ({
        ...coord,
        x: coord.x * tileWidth,
        y: coord.y * tileHeight,
    }));
}

const blockFactories = [
    createSquareBlock, 
    createTBlock, 
    createIBlock, 
    createLBlock, 
    createReverseLBlock, 
    createZBlock, 
    createReverseZBlock
]

export function createRandomBlock(tileWidth: number, tileHeight: number) {
    const index = Math.floor(Math.random() * blockFactories.length);
    return blockFactories[index](tileWidth, tileHeight);
}