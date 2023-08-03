import { useState } from 'react'
import './App.css'
import { interpreter , unParse} from '@pounce-lang/core';

function App() {
  const [count, setCount] = useState(0)
  const startPt = [35, 168]

  const interp0 = interpreter(`${Math.floor(Math.random()*5000)} seedrandom random drop 
  [random 1200 * 300 - random 800 * 200 - random 400 * random 255 * random 255 * random 255 * random 2 / 0.25 + [] cons cons cons cons cons cons cons] 13 times `);
  const { value: value0 } = interp0.next();

  // const interp = interpreter(`[
  // [[1.85793 -1.78086] [2.71586 -1.78086] [3.57379 -2.56172]]
  // [[0.85793 -0.78086] [10.78116 -10.26291] [20.57379 -10.56173]]
  // [[10.12094 -0.4226] [10.45285 -10.13912] [20.57379 -10.56172]]]
  // #dup 
  // [[0 outAt ${count} + 0 inAt] map] map
  // # concat
  // `);
  // const { value } = interp.next();
  // console.log(value0.stack)

  // const allPaths = [[startPt, value.stack[0]]]

  return (
    <>
      <h2>circles</h2>
      <svg style={{ backgroundColor: "#ddd" }} width="604" height="384" xmlns="http://www.w3.org/2000/svg">
        <g id="Layer_1" stroke="null">
          <title>Layer 1</title>
          {value0.stack.map(e => <circle cx={e[0]} cy={e[1]} r={e[2]} fill={`rgb(${e[3]},${e[4]},${e[5]})`} stroke="none" fillOpacity={e[6]} />)}
          
          {/* {allPaths.map((p, i) => <path fill="none" strokeWidth="0.7" key={`path_${i}`} id={`path_${i}`} d={makePathDString(...p)} stroke="#000" />)} */}
        </g>
      </svg>
      <button onClick={() => setCount(count + 1)}>change</button>
    </>
  )
}
const makePathDString = (start: number[], curves: number[][][]) => {
  const mkPtStr = (pt: number[]): string => pt.join(",")
  const makePtsString = (pta: number[][]) => pta.map(pt => mkPtStr(pt)).join(" ")
  const allCurves = curves.map((c: number[][]) => `c${makePtsString(c)}`)
  return `m${start.join(",")} ${allCurves.join(" ")}`
}

export default App
