import { useState } from 'react'
import './App.css'
import { interpreter, unParse } from '@pounce-lang/core';

function App() {
  const [count, setCount] = useState(-1)
  // const [undo, setUndo] = useState([])
  // const [circles, setCircles] = useState(null)
  // let value0: { stack: [] } = { stack: []};
  // if (!circles && count >= 0) {
  //   const interp0 = interpreter(`${Math.floor(Math.random() * 5000)} seedrandom random drop 
  // [random 1200 * 300 -
  //  random 800 * 200 -
  //  random 400 * 
  //  random 255 * 
  //  random 255 * 
  //  random 255 * 
  //  random 2 / 0.25 + [] cons cons cons cons cons cons cons] 23 times `);
  //   value0 = interp0.next().value;
  //   // console.log(unParse(value0.stack))
  // }
  // const theseCircles = circles ? circles : value0.stack
  const startPt = [30, 30]
  const columns = 27
  const rows = 17
  const interp = interpreter(`${Math.floor(Math.random()*50)} seedrandom random drop 
  [random 12 * random .5 - 12 * [] cons cons] [rpt] compose
  [rpt rpt rpt [] cons cons cons] [rptset] compose
  [rptset rptset rptset [] cons cons cons] [squigle] compose
  [squigle] ${columns} ${rows} * times
  `);
  const { value } = interp.next();
  console.log(unParse(value.stack))
  //const allPaths = [[startPt, value.stack[0]], [translate(startPt, [30, 20]), value.stack[0]]]
  let allPaths = []
  for(let x = 0; x < columns; x++) {
    for(let y = 0; y < rows; y++) {
      allPaths.push([translate(startPt, [x*20, y*20]), value.stack[x*rows+y]])
    }  
  }
  return (
    <>
      <h2>{columns*rows} paths</h2>
      <svg style={{ backgroundColor: "#ddd" }} width="604" height="384" xmlns="http://www.w3.org/2000/svg">
        <g id="Layer_1" stroke="null">
          <title>Layer 1</title>
          {/* {theseCircles.map((e, i) =>
            <circle key={"random-circle-" + i} cx={e[0]} cy={e[1]} r={e[2]} fill={`rgb(${e[3]},${e[4]},${e[5]})`} stroke="none" fillOpacity={e[6]} />
          )} */}

          {allPaths.map((p, i) => <path fill="none" strokeWidth="0.7" key={`path_${i}`} id={`path_${i}`} d={makePathDString(...p)} stroke="#000" />)}
        </g>
      </svg>
      {/* <button disabled={count <= 0} onClick={
        () => {
          if (count >= 1) {
            console.log("back", count, undo)
            setCircles(undo[count-1])
            setCount(count - 1)
          }
        }
      }>back</button> */}
      {/* <button disabled={count >= undo.length} onClick={
        () => {
          console.log("forth", count, undo)
          setCircles(undo[count])
          setCount(count + 1)
        }
      }>forth</button> */}
      <button onClick={
        () => {
          setCount(count + 1)
        }
      }>new</button>
    </>
  )
}

const translate = (a, offset) => {
  return [a[0]+offset[0], a[1]+offset[1]]
}

const makePathDString = (start: number[], curves: number[][][]) => {
  const mkPtStr = (pt: number[]): string => pt.join(",")
  const makePtsString = (pta: number[][]) => pta.map(pt => mkPtStr(pt)).join(" ")
  const allCurves = curves.map((c: number[][]) => `c${makePtsString(c)}`)
  return `m${start.join(",")} ${allCurves.join(" ")}`
}

export default App
