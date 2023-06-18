import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const startPt = [35, 168]
  const curveArr: number[][][] = [[[1.85793, -1.78086], [2.71586, -1.78086], [3.57379, -2.56172]],
  [[0.85793, -0.78086], [10.78116, -10.26291], [20.57379, -10.56173]],
  [[10.12094, -0.4226], [10.45285, -10.13912], [20.57379, -10.56172]]]
  const offset = [count + 10, -20]
  const offset2 = [count + 20, 1]

  const allPaths = [[startPt, curveArr, offset], [startPt, curveArr, offset2]]

  return (
    <>
      <div>
        <h2>make-a-svg</h2>
        <svg style={{ backgroundColor: "white" }} width="604" height="384" xmlns="http://www.w3.org/2000/svg">
          <g id="Layer_1" stroke="null">
            <title>Layer 1</title>
            {allPaths.map((p, i) => <path fill="none" strokeWidth="0.7" id={`path_${i}`} d={makePathDString(...p)} stroke="#000" />)}
          </g>
        </svg>
      </div>
      <button onClick={() => setCount(count + 1)}>click</button>
    </>
  )
}
const makePathDString = (start: number[], curves: number[][][], offset: number[]) => {
  const translate = (arr: number[]) => arr.map((d, i) => d + offset[i])
  const mkPtStr = (pt: number[]): string => translate(pt).join(",")
  const makePtsString = (pta: number[][]) => pta.map(pt => mkPtStr(pt)).join(" ")
  const allCurves = curves.map((c: number[][]) => `c${makePtsString(c)}`)
  return `m${translate(start).join(",")} ${allCurves.join(" ")}`
}

export default App
