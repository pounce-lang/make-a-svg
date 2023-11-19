import { useState } from 'react'
import './App.css'
import { OneOfFifty } from "./OneOfFifty"
import { SimpleTry } from "./SimpleTry"

export function App() {
  const [page, setPage] = useState("b")

  return <div>
  <button onClick={()=>setPage("a")}>a</button>
  <button onClick={()=>setPage("b")}>b</button>
  <hr />
  {page === 'a' ? <OneOfFifty /> : <SimpleTry />}
  </div>
}

