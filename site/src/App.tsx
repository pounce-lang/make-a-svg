import { RefObject, useCallback, useRef, useState } from 'react'
import './App.css'
import { interpreter } from '@pounce-lang/core';

// attempt at timesi
// [dup 0 > [1 - [f n] [n f leap f n] pounce timesi] [drop drop] if-else] [timesi] compose
// [3 - abs  3 - abs ] 7 timesi

function App() {
  const [count, setCount] = useState(0)
  const svgRef: RefObject<HTMLDivElement> | null = useRef(null);

  const downloadSVG = useCallback((count: number) => {
    const svg = svgRef?.current?.innerHTML;
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      downloadBlob(blob, `loopy-${count + 1}-of-50.svg`);
    }
  }, []);
  
  const startPt = [30, 30]
  const columns = 1
  const rows = 5
  const interp = interpreter(`
  [3 -1 -1 1 1 -3] [3 3 -1 -1 1 -5]
   [1 1 1 1 1 -5] [1 3 3 -1 -1 -5]
   [1 1 3 -3 -1 -1]
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
      console.log(value.stack[x * rows + y])
      allPaths.push([translate(startPt, [x * 20 + 10, y * 20 + 10]), value.stack[x * rows + y]])
    }
  }
  //console.log(allPaths)
  return <>
  <div ref={svgRef}>
      <svg style={{ backgroundColor: "#ddd", strokeLinecap: "round",
    strokeLinejoin: "round" }} width="604" height="384" xmlns="http://www.w3.org/2000/svg">
        <g id="Layer_1" stroke="null">
          <title>Layer 1</title>
          {allPaths.map((p: any, i) => <path fill="none" strokeWidth="0.7" key={`path_${i}`} id={`path_${i}`} d={makeLoopyPathDString(p[0], p[1])} stroke="#000" />)}
        </g>
      </svg>
      </div>
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
      <button onClick={() => downloadSVG(count)} >dl_svg</button>
      {/* <a href={'data:application/octet-stream;base64,' + btoa(getSvg(svgEle))} download={`bespokeSvg${count + 1}-of-50.svg`} >download svg</a> */}
    </>
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

const makeLoopyPathDString = (start: number[], curves: number[]) => {
  const mkPtStr = (pt: number[], scale: number): string => pt.map((n) => n * scale).join(" ")
  const makePtsString = (jump: number) => {
    //console.log("jump", jump)
    const pta = [[0, 0], [0, 10], [10, 10], [0, 0], [10, 0], [10, -10], [20, -10], [20, 0]]
    return pta.map(pt => mkPtStr(pt, jump)).join(", ")
  }
  const allCurves = curves.map((c: number, i) => ` M${[start[0]+i*20, start[1]].join(" ")} c${makePtsString(c)}`)

  console.log(allCurves.join(" "))
  return allCurves.join(" ")
}

const makeLoopyPathDStringMock = (start: number[], curves: number[]) => {
  const mkPtStr = (pt: number[], scale: number): string => pt.map((n) => n * scale).join(",")
  const makePtsString = (jump: number) => {
    //console.log("jump", jump)
    const pta = [[0, 0], [0, 1], [1, 1], [1, 0]]
    return pta.map(pt => mkPtStr(pt, jump)).join(" ")
  }
  const allCurves = curves.map((c: number) => `c${makePtsString(c)}`)
  return `M${start.join(",")} C 70 80, 110 80, 110 60`
}

function downloadBlob(blob: Blob | MediaSource, filename: string) {
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}

export default App
