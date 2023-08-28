import { RefObject, useCallback, useRef, useState } from 'react'
import './App.css'
import { interpreter } from '@pounce-lang/core';

// attempt at timesi
// [dup 0 > [1 - [f n] [n f leap f n] pounce timesi] [drop drop] if-else] [timesi] compose
// [3 - abs  3 - abs ] 7 timesi

function App() {
  const [count, setCount] = useState(0)
  const [pounceCode, setPounceCode] = useState(`
  [[0 0][]]
  [[0 20][5 -1 -1 -1 -1 -1]]
  [[0 -30][1 1 1 1 1 -5]]
  [[0 15][3 -1 -1 1 1 -3]]
  [[0 -20][3 3 -1 -1 1 -5]]
  [[0 10][5 1 1 -3 -3 -1]]
  [[0 15][1 1 3 -3 -1 -1]]
  [[0 -20][1 3 3 -1 -1 -5]]
  [[0 10][5 -1 1 1 -3 -3]]
  `)
  const svgRef: RefObject<HTMLDivElement> | null = useRef(null);

  const downloadSVG = useCallback((count: number) => {
    const svg = svgRef?.current?.innerHTML;
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      downloadBlob(blob, `loopy-${count + 1}-of-50.svg`);
    }
  }, []);
  
  const startPt = [40, 50]
  const columns = 3
  const rows = 3
  const interp = interpreter(pounceCode);

  let result = interp.next();
  while (!result.done) {
    result = interp.next();
  }
  const value = result.value;
  // console.log(unParse(value.stack))
  let allPaths = []
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // console.log(translate(startPt, [x * 20, y * 20]))
      allPaths.push([translate(startPt, [x * 160, y * 130]), value.stack[x * rows + y]])
    }
  }
  //console.log(allPaths)
  return <>
    <textarea rows={10} cols={80} onChange={(e)=> e?.target?.value ? setPounceCode(e?.target?.value):null}>{pounceCode}</textarea>
    <div ref={svgRef}>
      <svg style={{ backgroundColor: "#ddd", strokeLinecap: "round",
    strokeLinejoin: "round" }} width="604" height="384" xmlns="http://www.w3.org/2000/svg">
        <g id="Layer_1" stroke="null">
          <title>Layer 1</title>
          {allPaths.map((p: any, i) => makeLoopyPathDString(p[0], p[1], i))}
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


const makeLoopyPathDString = (start: number[], curves: number[][], i: number) => {
  const mkPtStr = (pt: number[], scale: number): string => pt.map((n) => n * scale).join(" ")
  const makePtsString = (jump: number, top: boolean) => {
    //console.log("jump", jump)
    let pta = [[0, 20], [30, 20], [30, 0]]
    if (top? jump >0 : jump < 0) {
      pta = pta.map(p => ([p[0], p[1]*-1]))
    }
    return pta.map(pt => mkPtStr(pt, jump)).join(", ")
  }
  const allCurves = curves[1].map((c: number, j) => {
    const s = translate(translate(start, curves[0]), [j * 30, 0])
    return (
      <path fill="none" strokeWidth="0.7" key={`path_${i * 100 + j}`} id={`path_${i * 100 + j}`}
        d={` M${s.join(" ")} c${makePtsString(c, j % 2 === 0)}`} stroke="#000" />);
  })

  //console.log(allCurves)
  return <g key={"some_"+i}>{allCurves}</g>
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
