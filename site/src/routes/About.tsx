import * as React from "react";
import { useMachine } from "../MachineContext";

export const About = () => {
  const { send } = useMachine();
  return (
    <>
      <h2>about</h2>
      <button onClick={() => send("aevent")}>A</button>
      <button onClick={() => send("bevent")}>B</button>
    </>
  );
};
