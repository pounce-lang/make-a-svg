import { useState } from 'react'
import './App.css'
import { interpreter, unParse } from '@pounce-lang/core';

// attempt at timesi
// [dup 0 > [1 - [f n] [n f leap f n] pounce timesi] [drop drop] if-else] [timesi] compose
// [3 - abs  3 - abs ] 7 timesi

function App() {
  const [count, setCount] = useState(0)
  const startPt = [30, 30]
  const columns = 27
  const rows = 17
  const interp = interpreter(`${count % 50 + 11} seedrandom random drop 
  [dup 0 > [1 - [f n] [n f leap f n] pounce itimes] [drop drop] if-else] [itimes] compose
  [${columns} ${rows} + 2 / floor] [midway] compose
  [midway - abs -1 * midway +] [center] compose
  [[i] [random .5 - i center * 1 midway / * random .5 - i center * 1 midway / * [] cons cons] pounce] [rpt] compose
  [[i] [i rpt i rpt i rpt i rpt i rpt i rpt [] cons cons cons cons cons cons] pounce] [rptset] compose
  [[i] [i rptset i rptset i rptset [] cons cons cons] pounce] [squigle] compose
  [squigle] ${columns} ${rows} * itimes
  `);
  let result = interp.next();
  while (!result.done) {
    result = interp.next();
  }
  const value = result.value;
  // console.log(unParse(value.stack))
  let allPaths = []
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      allPaths.push([translate(startPt, [x * 20, y * 20]), value.stack[x * rows + y]])
    }
  }
  return (
    <>
      <svg style={{ backgroundColor: "#ddd", strokeLinecap: "round",
    strokeLinejoin: "round" }} width="604" height="384" xmlns="http://www.w3.org/2000/svg">
        <g id="Layer_1" stroke="null">
          <title>Layer 1</title>
          {allPaths.map((p, i) => <path fill="none" strokeWidth="0.7" key={`path_${i}`} id={`path_${i}`} d={makePathDString(...p)} stroke="#000" />)}
        </g>
      </svg>
      <div>
        <small style={{ paddingRight: 30 }}>{columns * rows} paths --  {count + 1} of 50</small>

        <button disabled={count <= 0} onClick={
        () => {
            setCount((count - 1) % 50)
        }
      }>back</button>
        <button onClick={
          () => {
            setCount((count + 1) % 50)
          }
        }
        >forth</button>
      </div>
    </>
  )
}

const translate = (a: number[], offset: number[]) => {
  return [a[0] + offset[0], a[1] + offset[1]]
}

const makePathDString = (start: number[], curves: number[][][]) => {
  const mkPtStr = (pt: number[]): string => pt.join(",")
  const makePtsString = (pta: number[][]) => pta.map(pt => mkPtStr(pt)).join(" ")
  const allCurves = curves.map((c: number[][]) => `c${makePtsString(c)}`)
  return `m${start.join(",")} ${allCurves.join(" ")}`
}

export default App
