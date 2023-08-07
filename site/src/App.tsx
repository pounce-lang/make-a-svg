import { useState } from 'react'
import './App.css'
import { interpreter, unParse } from '@pounce-lang/core';

function App() {
  const [count, setCount] = useState(0)
  const startPt = [30, 30]
  const columns = 27
  const rows = 17
  const interp = interpreter(`${count % 50 + 11} seedrandom random drop 
  [dup 0 > [1 - swap dup dip2 swap timesi] [drop drop] if-else] [timesi] compose
  [random .5 - 10 * random .5 - 14 * [] cons cons] [rpt] compose
  [rpt rpt rpt rpt rpt rpt [] cons cons cons cons cons cons] [rptset] compose
  [rptset rptset rptset [] cons cons cons] [squigle] compose
  [squigle] ${columns} ${rows} * timesi
  `);
  const { value } = interp.next();
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
