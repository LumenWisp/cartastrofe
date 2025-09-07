export interface GameFieldItems {
    type: 'pile' | 'label',
    position: {x: number, y: number},
    nameIdentifier: string,
}