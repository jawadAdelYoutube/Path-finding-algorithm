import { useEffect, useRef, useState } from 'react'
import './App.css'
import heuristics from './utils/heuristics';
import dist from './utils/dist';
import { Droppable } from './component/Droppable';
import { DndContext, useDraggable } from '@dnd-kit/core';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FlagIcon from '@mui/icons-material/Flag';

let cells = [];
const cellNumber = 126
for(let i = 0 ; i< cellNumber; i++){
  cells.push({i})
}
let cellDivs
let pathButton ;
let start 
let end

function DraggableComponent(props){
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: props.id,
    });
    const style = transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          width: "50px",
          height: "50px",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          margin: "4"
        }
      : {
        width: "50px",
        height: "50px",
        
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        margin: "4"
      };

    return (
      <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
        {props.children}
       
      </button>
    );
}
function App() {
  const [startparent, setstartParent] = useState(null);
  const [endparent, setendParent] = useState(null);
  const [startNode, setStartNode] = useState(0);
  const [endNode, setEndNode ] = useState(53)
  const draggableMarkup = (
    <DraggableComponent id="draggable"><ArrowForwardIosIcon style={{marginLeft: "-5px"}}/></DraggableComponent>
  );
  const draggableMarkupEnd = (
    <DraggableComponent id="draggable-end"><FlagIcon style={{marginLeft: "-5px"}}/></DraggableComponent>
  );


  useEffect(()=>{
    cellDivs = document.querySelectorAll('.cell')
    for(let i = 0 ; i < cellNumber; i++){
      cells[i].cell = cellDivs[i]
    }
    start = cells[startNode]
    end = cells[endNode]
    EventHandler()
  },[])
  useEffect(() => {
      start = cells[startNode]
      end = cells[endNode]}
    , [startparent, endparent])

  return (
  
    <DndContext onDragEnd={handleDragEnd}>
      <h1>Search Algorithm</h1>
      <button className="button" id="Astar" onClick={()=> {
        reset()
        aStar()
        }}>Find Path</button>
        <div style={{margin: "10px", display: "flex", alignItems: "center", textAlign: "center", justifyContent: "center"}}>
          <div style={{margin: "10px"}}>
            {startparent === null ? draggableMarkup : null}
          </div>
          <div style={{margin: "10px"}}>
            {endparent === null ? draggableMarkupEnd: null}
          </div>
        </div>
        
      <div className='container'>
        <div id="grid">
          {cells.map(cell => <Droppable key={cell.i} id={cell.i}><div id={`cell ${cell.i}`} key={`cell ${cell.i}`} className='cell' onClick={()=>EventHandler(cell.i)}>
            {startparent === cell.i ? draggableMarkup : null}
            {endparent == cell.i ? draggableMarkupEnd: null}
          </div></Droppable>)}
         
        </div>
      </div>
    </DndContext>
  )
  function handleDragEnd(event) {
    const {active , over} = event;
    const target = document.getElementById(`cell ${over.id}`)
    

    // If the item is dropped over a container, set it as the parent
    // otherwise reset the parent to `null`
    if(active.id == "draggable"){
      setstartParent(over ? over.id : null);
      setStartNode(over.id)
    
    }else{
      setendParent(over ? over.id : null)
      setEndNode(over.id)
    }
    
  }
}
function aStar (){
  let opened = [];
  let closed = [];
  let path = []
  opened.push(start)
  start.g = 0;
  start.h = heuristics(start.cell.getBoundingClientRect().x,start.cell.getBoundingClientRect().y,end)
  start.f = start.g + start.h;
  start.parent = null;
  
  while(opened.length > 0){
      
      let lowestF = opened.reduce((lowest, cell) => {
          return (!lowest || cell.f < lowest.f) ? cell : lowest;
      }, null);

      let current = lowestF

      if(current == end){
          path = recontructPath(current)
      }
      opened = opened.filter(cell => cell !== current);
      closed.push(current)

      let neigbors = cells.filter(cell =>
          Math.floor(dist(
          cell.cell.getBoundingClientRect().x, 
          cell.cell.getBoundingClientRect().y,
          current.cell.getBoundingClientRect().x,
          current.cell.getBoundingClientRect().y
      )) <= (101) && Math.floor(dist(
          cell.cell.getBoundingClientRect().x, 
          cell.cell.getBoundingClientRect().y,
          current.cell.getBoundingClientRect().x,
          current.cell.getBoundingClientRect().y
      )) > 0)
      neigbors = neigbors.filter(cell => !(cell.b == 'b'))

      neigbors.forEach(neigbor=>{
          if(!closed.includes(neigbor)){
              let gtemp = dist(
                  current.cell.getBoundingClientRect().x,
                  current.cell.getBoundingClientRect().y,
                  neigbor.cell.getBoundingClientRect().x,
                  neigbor.cell.getBoundingClientRect().y
              )
              let tentativeG = current.g + gtemp

              if(!opened.includes(neigbor)){
                  opened.push(neigbor)
              }
              
              if (tentativeG < neigbor.g || neigbor.g === undefined) {
                  neigbor.parent = current
                  neigbor.g = tentativeG
                  neigbor.h = heuristics(
                      neigbor.cell.getBoundingClientRect().x,
                      neigbor.cell.getBoundingClientRect().y,
                      end
                  )
                  neigbor.f = neigbor.g + neigbor.h
              }
          }
      })
      
  }
  
  for (let i=0; i<path.length; i++) { 
      task(i); 
  } 
      
  function task(i) { 
  setTimeout(function() { 
      if(path[i] != start && path[i] != end)
       
        path[i].cell.style.backgroundColor = 'yellow'  
        
  }, 50 * i); 
  } 
}
function EventHandler(parentID){
  let cell
  cell = cells.find(cell => cell.i == parentID)
  if(cell != undefined){
    if(cell.b == 'b'){
      cell.b = undefined
      cell.cell.style.backgroundColor = 'white'
    }else{
      cell.b = 'b'
      cell.cell.style.backgroundColor = 'black'
    }
  }
  
}
function recontructPath(current){
  let path = [];
  while (current != null){
      path.unshift(current)
      current = current.parent
  }
  return path
}

function reset(){
  cells.forEach(cell =>{
    cell.g = undefined;
    cell.f = undefined;
    cell.g = undefined;
    cell.parent = undefined
    if(cell.cell.style.backgroundColor == 'yellow'){
        cell.cell.style.backgroundColor = 'white'
    }
})
}

export default App
