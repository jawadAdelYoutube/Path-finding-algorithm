import { useEffect, useRef, useState } from 'react'
import './App.css'
import heuristics from './utils/heuristics';
import dist from './utils/dist';

let cells = [];
const cellNumber = 126
for(let i = 0 ; i< cellNumber; i++){
  cells.push({i})
}
let cellDivs
let pathButton ;
let start 
let end

function App() {



  useEffect(()=>{
    cellDivs = document.querySelectorAll('.cell')
    for(let i = 0 ; i < cellNumber; i++){
      cells[i].cell = cellDivs[i]
    }
    start = cells[15]
    end = cells[53]
    start.cell.style.backgroundColor = 'blue'
    end.cell.style.backgroundColor = 'blue'
    EventHandler()
  },[])

  return (
  
    <>
      <h1>Search algorithm</h1>
      <button className="button" id="Astar" onClick={()=> {
        reset()
        aStar()
        }}>Find Path</button>
      <div className='container'>
        <div id="grid">
          {cells.map(cell => <div id={`cell ${cell.i}`} key={`cell ${cell.i}`} className='cell' onClick={()=>EventHandler(cell.i)}>
            
          </div>)}
         
        </div>
      </div>
    </>
  )
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
  console.log(path)
  for (let i=0; i<=path.length; i++) { 
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
  console.log(cell)
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
