import type { InnerGrid, OuterGrid } from "./types";

export function initializeGrid(){
    const grid: OuterGrid = [];
    for(let i=0;i<9;i++){
        const inner: InnerGrid = [];
        for(let j=0;j<9;j++){
            inner.push(new Set());
        }
        grid.push(inner);
    }
    return grid;
}

export function getInnerGrid(grid: OuterGrid, outerX: number, outerY: number){
    const result: number[] = [];
    const innerGrid = grid[outerY * 3 + outerX];
    for(let i=0;i<9;i++){
        const elements = innerGrid[i];
        if(elements.size === 1)
            result.push(Array.from(elements)[0]);
    }
    return result;
}
export function getHorizontalLine(grid: OuterGrid, outerY: number, innerY: number){
    const result: number[] = [];
    for(let ox=0;ox<3;ox++){
        const innerGrid = grid[outerY * 3 + ox];
        for(let ix=0;ix<3;ix++){
            const elements = innerGrid[innerY * 3 + ix];
            if(elements.size === 1)
                result.push(Array.from(elements)[0]);
        }
    }
    return result;
}
export function getVerticalLine(grid: OuterGrid, outerX: number, innerX: number){
    const result: number[] = [];
    for(let oy=0;oy<3;oy++){
        const innerGrid = grid[oy * 3 + outerX];
        for(let iy=0;iy<3;iy++){
            const elements = innerGrid[iy * 3 + innerX];
            if(elements.size === 1)
                result.push(Array.from(elements)[0]);
        }
    }
    return result;
}

function hasDuplicates(array: any[]){
    const set = new Set<any>();
    for(const value of array){
        if(set.has(value))
            return true;
        set.add(value);
    }
    return false;
}
export const isInnerGridWrong = (grid: OuterGrid, outX: number, outY: number) =>
    hasDuplicates(getInnerGrid(grid, outX, outY));
export const isHorizontalWrong = (grid: OuterGrid, outY: number, innerY: number) =>
    hasDuplicates(getHorizontalLine(grid, outY, innerY));
export const isVerticalWrong = (grid: OuterGrid, outX: number, innerX: number) =>
    hasDuplicates(getVerticalLine(grid, outX, innerX));

export function isCompleted(grid: OuterGrid){
    for(const innerGrid of grid)
        for(const cell of innerGrid)
            if(cell.size !== 1)
                return false;
    return true;
}