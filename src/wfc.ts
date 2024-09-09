import type { Cell, OuterGrid } from "./types.js";
import { getHorizontalLine, getInnerGrid, getVerticalLine, isCompleted } from "./logic.js";
interface CellCoord{
    outerX: number;
    outerY: number;
    innerX: number;
    innerY: number;
}

const possibleMovesSet = new Set<number>([1,2,3,4,5,6,7,8,9]);
const differenceOfMoves = (set: Cell): Cell => // It is on baseline 2024 but I don't trust browser compatibility
    new Set<number>([...possibleMovesSet].filter(n => !set.has(n)));
function removeChances(grid: OuterGrid, outerX: number, outerY: number, innerX: number, innerY: number){
    if(grid[outerY * 3 + outerX][innerY * 3 + innerX].size === 1)
        return;
    const innerGrid = getInnerGrid(grid, outerX, outerY);
    const horizontalGrid = getHorizontalLine(grid, outerY, innerY);
    const verticalGrid = getVerticalLine(grid, outerX, innerX);
    const set = new Set<number>([...innerGrid, ...horizontalGrid, ...verticalGrid]);
    const diff = differenceOfMoves(set);
    grid[outerY * 3 + outerX][innerY * 3 + innerX] = diff;
}
const getMinEntropy = (grid: OuterGrid): number =>
    Math.min(...grid.map(innerGrid => Math.min(...innerGrid.map(elements => elements.size <= 1 ? Infinity : elements.size))));
function getElementsWithEntropy(grid: OuterGrid, entropy: number){
    const result: CellCoord[] = [];
    for(let o=0;o<9;o++){
        const innerGrid = grid[o];
        for(let i=0;i<9;i++){
            const cell = innerGrid[i];
            if(cell.size === entropy){
                result.push({
                    outerX: o % 3,
                    outerY: Math.floor(o / 3),
                    innerX: i % 3,
                    innerY: Math.floor(i / 3)
                });
            }
        }
    }
    return result;
}
function randomCollapse(grid: OuterGrid){
    const minEntropy = getMinEntropy(grid);
    console.log(minEntropy);
    if(minEntropy < 1 || minEntropy === Infinity)
        throw new Error("Invalid game state");
    const elements = getElementsWithEntropy(grid, minEntropy);
    const element = elements[Math.floor(Math.random() * elements.length)];
    
    const gridCell = grid[element.outerY * 3 + element.outerX][element.innerY * 3 + element.innerX];
    const randomValue = Array.from(gridCell)[Math.floor(Math.random() * gridCell.size)];
    grid[element.outerY * 3 + element.outerX][element.innerY * 3 + element.innerX] = new Set<number>([randomValue]);
}
export function WFCStep(grid: OuterGrid){
    for(let oy=0;oy<3;oy++)
        for(let ox=0;ox<3;ox++)
            for(let iy=0;iy<3;iy++)
                for(let ix=0;ix<3;ix++)
                    removeChances(grid, ox, oy, ix, iy);
    if(isCompleted(grid))
        return;
    randomCollapse(grid);
}
export function isInvalid(grid: OuterGrid){
    for(const innerGrid of grid)
        for(const cell of innerGrid)
            if(cell.size === 0)
                return true;
    return false;
}