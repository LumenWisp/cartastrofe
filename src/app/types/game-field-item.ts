export interface GameFieldItem {
    type: 'pile' | 'label' | 'passPhase',
    position: {x: number, y: number},
    nameIdentifier: string,
}