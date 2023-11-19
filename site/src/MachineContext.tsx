import * as React from "react";

export const MachineContext = React.createContext({});

export const useMachine = () => React.useContext(MachineContext);
