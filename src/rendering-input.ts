import { InnerGrid, OuterGrid } from "./types";

const sudokuTable = document.querySelector("#sudokuTable") as HTMLDivElement;
const controls = document.querySelector("#controls") as HTMLDivElement;
const controlsArray: HTMLButtonElement[] = [];
let selected: HTMLButtonElement | void;

type ClickEventFunction = (outerX: number, outerY: number, innerX: number, innerY: number) => unknown;
type CollapseEventFunction = () => unknown;
const clickEventsRegistered: ClickEventFunction[] = [];
const collapseEventsRegistered: CollapseEventFunction[] = [];
export function registerClickEvent(func: ClickEventFunction){
    clickEventsRegistered.push(func);
}
export function getSelected(){
    return controlsArray.findIndex(btn => btn === selected) + 1;
}
export function onTriggerCollapse(func: CollapseEventFunction){
    collapseEventsRegistered.push(func);
}

function initializeInnerGrid(innerTable: HTMLDivElement, outX: number, outY: number){
    const innerTableHolder = document.createElement("div");
    innerTableHolder.classList.add("innerTable");
    for(let y=0;y<3;y++){
        const row = document.createElement("div");
        for(let x=0;x<3;x++){
            const num = document.createElement("span");
            num.textContent = `${y * 3 + x + 1}`;
            num.addEventListener("click", e => {
                e.preventDefault();
                clickEventsRegistered.forEach(f => f(outX, outY, x, y));
            });
            row.append(num);
        }
        innerTableHolder.append(row);
    }
    innerTable.append(innerTableHolder);
}
export function initializeRenderingGrid(){
    for(let y=0;y<3;y++){
        const row = document.createElement("div");
        for(let x=0;x<3;x++){
            const innerTable = document.createElement("div");
            initializeInnerGrid(innerTable, x, y);
            row.append(innerTable);
        }
        sudokuTable.append(row);
    }
}
function updateInnerGrid(innerGrid: InnerGrid, innerDivQuery: string){
    for(let y=0;y<3;y++){
        for(let x=0;x<3;x++){
            const elements = innerGrid[y * 3 + x];
            const span = document.querySelector(`${innerDivQuery} > .innerTable > :nth-child(${y + 1}) > :nth-child(${x + 1})`) as HTMLSpanElement;
            if(elements.size < 1){
                span.classList.remove("help-cursor");
                span.innerText = `.`;
            }else if(elements.size === 1){
                span.classList.remove("help-cursor");
                span.title = "";
                span.innerText = `${Array.from(elements.values())[0]}`;
            }else{
                span.classList.add("help-cursor");
                span.title = Array.from(elements).map(e => e.toString()).join(", ");
                span.innerText = `X`;
            }
        }
    }
}
export function updateGrid(grid: OuterGrid){
    for(let y=0;y<3;y++)
        for(let x=0;x<3;x++)
            updateInnerGrid(grid[y * 3 + x], `#sudokuTable > :nth-child(${y + 1}) > :nth-child(${x + 1})`);
}
export function initalizeControls(){
    for(let i=0;i<9;i++){
        const button = document.createElement("button");
        button.textContent = `${i + 1}`;
        button.addEventListener("click", e => {
            e.preventDefault();
            if(selected){
                selected.classList.remove("selected");
            }
            if(selected == button){
                sudokuTable.classList.remove("cursor-pointer");
                selected = undefined;
                return;
            }
            sudokuTable.classList.add("cursor-pointer");
            selected = button;
            button.classList.add("selected");
        });
        controls.append(button);
        controlsArray.push(button);
    }
    window.addEventListener("keydown", e => {
        const numKey = parseInt(e.key);
        if(isNaN(numKey) || numKey > 9 || numKey < 1)
            return;
        const button = controlsArray[numKey - 1];
        if(selected){
            selected.classList.remove("selected");
        }
        if(selected == button){
            sudokuTable.classList.remove("cursor-pointer");
            selected = undefined;
            return;
        }
        sudokuTable.classList.add("cursor-pointer");
        selected = button;
        button.classList.add("selected");
    });
    const collapseButton = document.createElement("button");
    collapseButton.innerText = "COLLAPSE";
    collapseButton.addEventListener("click", e => {
        e.preventDefault();
        collapseEventsRegistered.forEach(f => f());
    });
    controls.append(collapseButton);
}

export function setInvalidInnerGrid(outerX: number, outerY: number, value: boolean){
    const inner = document.querySelector(`#sudokuTable > :nth-child(${outerY + 1}) > :nth-child(${outerX + 1})`) as HTMLDivElement;
    if(value){
        inner.classList.add("wrong-grid");
    }else{
        inner.classList.remove("wrong-grid");
    }
}
export function setInvalidHorizontalLine(outerY: number, innerY: number, value: boolean){
    for(let ox=0;ox<3;ox++){
        const outerQuery = `#sudokuTable > :nth-child(${outerY + 1}) > :nth-child(${ox + 1}) > .innerTable`;
        for(let ix=0;ix<3;ix++){
            const span = document.querySelector(`${outerQuery} > :nth-child(${innerY + 1}) > :nth-child(${ix + 1})`) as HTMLSpanElement;
            if(value){
                span.classList.add("wrong-h");
            }else{
                span.classList.remove("wrong-h");
            }
        }
    }
}
export function setInvalidVerticalLine(outerX: number, innerX: number, value: boolean){
    for(let oy=0;oy<3;oy++){
        const outerQuery = `#sudokuTable > :nth-child(${oy + 1}) > :nth-child(${outerX + 1}) > .innerTable`;
        for(let iy=0;iy<3;iy++){
            const span = document.querySelector(`${outerQuery} > :nth-child(${iy + 1}) > :nth-child(${innerX + 1})`) as HTMLSpanElement;
            if(value){
                span.classList.add("wrong-v");
            }else{
                span.classList.remove("wrong-v");
            }
        }
    }
}