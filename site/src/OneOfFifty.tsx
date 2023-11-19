import { RefObject, useCallback, useRef, useState } from 'react'
import './App.css'
import { interpreter, unParse } from '@pounce-lang/core';

// attempt at timesi
// [dup 0 > [1 - [f n] [n f leap f n] pounce timesi] [drop drop] if-else] [timesi] compose
// [3 - abs  3 - abs ] 7 timesi

export function OneOfFifty() {
  const [count, setCount] = useState(0)
  const [cols, setCols] = useState(3)
   const [rows, setRows] = useState(2)
  const [pounceCode, setPounceCode] = useState(`
 seedrandom random drop
 [${cols}][cols]compose
 [${rows}][rows]compose
 [] cons [height] compose
[[0 [0 0 0 0 0 0 0 0 0 0 0 0 0 0] 
[[13 11 9 7 5 3 1 ]
[11 9 7 5 3 1 -1][11 9 7 5 3 1 -1]
[9 7 5 3 1 -1 -3][9 7 5 3 1 -1 -3]
[7 5 3 1 -1 -3 -5][7 5 3 1 -1 -3 -5]
[5 3 1 -1 -3 -5 -7][5 3 1 -1 -3 -5 -7]
[3 1 -1 -3 -5 -7 -9][3 1 -1 -3 -5 -7 -9]
[1 -1 -3 -5 -7 -9 -11][1 -1 -3 -5 -7 -9 -11]
[-1 -3 -5 -7 -9 -11 -13]]
]] [base] compose

[
  # pick one of two lowest 
  [size 1 <=] [] [uncons [abs [abs]dip >=] split] [concat] binrec
  [size 1 >][random 0.5 + floor outAt][0 outAt] ifte

  swap [dup] dip swap [!=] cons filter][uncons-random-item] compose

[[[i choi pos]] [[i choi pos] choi false [0 == ||] reduce ! i 0 == &&] pounce][done?]compose

[[[i choi pos]] [[i choi pos] i choi swap outAt swap drop 0 ==] pounce]
[possible?]compose

[[[i choi pos]] [pop drop pos push] pounce]
[erase]compose

[[[i choi pos]] [[i choi pos] pos i outAt
uncons-random-item swap i swap [inAt] dip
i swap dup [+] dip
choi swap i inAt [] cons cons swap push  
] pounce]
[do-move]compose

[[done?][][do-move done? [possible?] dip || [][erase] if-else][] linrec
[[drop] depth 2 - times] dip pop drop pop swap drop][mk-sequence] compose
base mk-sequence [] cons
[[base mk-sequence] dip cons] cols rows * 1 - times 
[drop]dip
[] cons
cyan swap cons
[base mk-sequence [] cons
[[base mk-sequence] dip cons] cols rows * 1 - times 
[drop]dip
[] cons
magenta swap cons]dip
[base mk-sequence [] cons
[[base mk-sequence] dip cons] cols rows * 1 - times 
[drop]dip
[] cons
"#fd0" swap cons]dip2
`)
  const svgRef: RefObject<HTMLDivElement> | null = useRef(null);

  const downloadSVG = useCallback((count: number) => {
    // since React will not do namespaced attributes (e.g. inkscape:label="0-Yellow"), so....
    svgRef?.current?.getElementsByTagName("svg")[0]?.setAttribute("xmlns:inkscape", "http://www.inkscape.org/namespaces/inkscape");
    const g = Array.from(svgRef?.current?.getElementsByTagName("g") as ArrayLike<SVGGElement>);
    g?.map(gn => {
      const attVal = gn.getAttribute("id");
      if (attVal) {
        gn?.setAttribute("inkscape:groupmode", "layer");
        gn?.setAttribute("inkscape:label", attVal ?? '');
      }
    });

    const svg = svgRef?.current?.innerHTML;
    if (svg) {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      downloadBlob(blob, `ymc_${cols}_${rows}_${points}-${count + 1}-of-50.svg`);
    }
  }, []);

  const startPt = [40, 100]
  const points = 14
  const interp = interpreter(`${count+1} ${pounceCode}`);

  let result = interp.next();
  while (!result.done) {
    result = interp.next();
  }
  const value = result.value;
  console.log(unParse(value.stack))
  const mkAllPaths = (startPt: number[], stack: any[]) => {
    let allPaths = []
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        // console.log(translate(startPt, [x * 20, y * 20]))
        allPaths.push([translate(startPt, [x * 180, y * 180]), stack[x * rows + y]])
      }
    }
    return allPaths;
  }

  return <>
    <textarea rows={10} cols={80} onChange={(e) => e?.target?.value ? setPounceCode(e?.target?.value) : null} value={`${count+1} ${pounceCode}`} ></textarea>
    <div ref={svgRef}>
      <svg style={{
        backgroundColor: "#fff", strokeLinecap: "round",
        strokeLinejoin: "round"
      }} width="604" height="384" xmlns="http://www.w3.org/2000/svg">
        {
          value.stack.map((layer: any, l: number) => {
            return <g id={`${l}-${layer[0]}`} key={`${l}-${layer[0]}`}
              stroke={layer[0]} style={{ mixBlendMode: "multiply" }} >
              <title>Layer {l} is for {layer[0]} of ycmk</title>
              {mkAllPaths(startPt, layer[1]).map((p: any, i: number) => makeLoopyPathDString(p[0], p[1], i))}
            </g>;
          })
        }
      </svg>
    </div>
    <div>
      <small style={{ paddingRight: 30 }}>{cols * rows} paths --  {count + 1} of 50</small>

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


const makeLoopyPathDString = (start: number[], curves: number[], i: number) => {
  const diameter = 12
  const scaled_d = diameter * 2 / 3
  const mkPtStr = (pt: number[], scale: number): string => pt.map((n) => n * scale).join(" ")
  const makePtsString = (jump: number, top: boolean) => {
    //console.log("jump", jump)
    let pta = [[0, scaled_d], [diameter, scaled_d], [diameter, 0]]
    if (top ? jump > 0 : jump < 0) {
      pta = pta.map(p => ([p[0], p[1] * -1]))
    }
    return pta.map(pt => mkPtStr(pt, jump)).join(", ")
  }
  const allCurves = curves.map((c: number, j) => {
    // console.log(c, i, j);
    const s = translate(start, [j * diameter, 0])
    return (
      <path fill="none" strokeWidth="3" key={`path_${i * 100 + j}`} id={`path_${i * 100 + j}`}
        d={` M${s.join(" ")} c${makePtsString(c, j % 2 === 0)}`} />);
  })

  //console.log(allCurves)
  return <>{allCurves}</>
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

// export default App

// # sort by magnitude then pick one of the first two
// 94 seedrandom random drop
// [5 3 1 -1 -3 -5 -7]
// [size 1 <=] [] [uncons [abs [abs]dip >=] split] [concat] binrec
// [size 1 >][random 0.5 + floor outAt][0 outAt] ifte
// TBD pick the most centrus or random amoung abs =

// # rm inside a loop
// 462 seedrandom random drop
// 1
// [[13 11 9 7 5 3 1 ]
// [11 9 7 5 3 1 -1][11 9 7 5 3 1 -1]
// [9 7 5 3 1 -1 -3][9 7 5 3 1 -1 -3]
// [7 5 3 1 -1 -3 -5][7 5 3 1 -1 -3 -5]
// [5 3 1 -1 -3 -5 -7][5 3 1 -1 -3 -5 -7]
// [3 1 -1 -3 -5 -7 -9][3 1 -1 -3 -5 -7 -9]
// [1 -1 -3 -5 -7 -9 -11][1 -1 -3 -5 -7 -9 -11]
// [-1 -3 -5 -7 -9 -11 -13]]
// swap dup [swap] dip outAt size random * floor outAt [drop] dip 
// #[uncons swap drop [] swap cons] dip
// [ii poss jmp]
// [ii jmp +  poss ii
// [[pos i][pos i outAt [uncons swap drop] jmp times i inAt i 1 +]pounce] jmp times drop]pounce