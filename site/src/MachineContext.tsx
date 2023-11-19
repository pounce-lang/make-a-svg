import * as React from "react";

export const MachineContext = React.createContext({send:(msg: string)=>{console.log("sending", msg)}});

export const useMachine = () => React.useContext(MachineContext);
