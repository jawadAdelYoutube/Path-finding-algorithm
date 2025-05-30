function heuristics (x,y, ending) {
    let x1 = ending.cell.getBoundingClientRect().x
    let y1 = ending.cell.getBoundingClientRect().y
    return Math.sqrt((Math.pow(x-x1,2)+Math.pow(y-y1,2)))
  }

export default heuristics