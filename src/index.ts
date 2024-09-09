import type { OuterGrid } from "./types.js";
import { initializeGrid, isHorizontalWrong, isInnerGridWrong, isVerticalWrong } from "./logic.js";
import { getSelected, initalizeControls, initializeRenderingGrid, onTriggerCollapse, registerClickEvent, setInvalidHorizontalLine, setInvalidInnerGrid, setInvalidVerticalLine, updateGrid } from "./rendering-input.js";
import { isInvalid, WFCStep } from "./wfc.js";

let grid = initializeGrid();
initializeRenderingGrid();
initalizeControls();

updateGrid(grid);

let interval: ReturnType<typeof setInterval> | void;
function toggleInterval(){
    if(interval){
        clearInterval(interval);
        interval = undefined;
        return;
    }
    interval = setInterval(() => {
        if(isInvalid(grid))
            grid = initializeGrid();
        WFCStep(grid);
        updateGrid(grid);
    }, 30);
}

function checkInvalid(grid: OuterGrid){
    for(let y=0;y<3;y++)
        for(let x=0;x<3;x++)
            setInvalidInnerGrid(x, y, isInnerGridWrong(grid, x, y));
    for(let ox=0;ox<3;ox++)
        for(let ix=0;ix<3;ix++)
            setInvalidVerticalLine(ox, ix, isVerticalWrong(grid, ox, ix));
    for(let oy=0;oy<3;oy++)
        for(let iy=0;iy<3;iy++)
            setInvalidHorizontalLine(oy, iy, isHorizontalWrong(grid, oy, iy));
}

registerClickEvent(function(outX, outY, innerX, innerY){
    const selected = getSelected();
    const elements = grid[outY * 3 + outX][innerY * 3 + innerX];
    if(selected === 0)
        return;
    if(elements.has(selected)){
        elements.delete(selected);
    }else{
        elements.add(selected);
    }
    updateGrid(grid);
    checkInvalid(grid);
});
onTriggerCollapse(function(isIntervalToggle){
    if(isIntervalToggle)
        return toggleInterval();
    WFCStep(grid);
    updateGrid(grid);
});