//import * from "react";
import { Route, Switch } from "react-router-dom";

import { MachineProvider } from "./MachineProvider";

import {
  OneOfFifty,
  SimpleTry,
  About
} from "./routes";

const Routes = () => {
  return (
    <MachineProvider>
      <Switch>
        <Route path="/oneof50"><OneOfFifty /></Route>
        <Route path="/simpletry" ><SimpleTry /></Route>
        <Route path="/about" ><About /></Route>
        <Route
          path="/"
          ><div>root redirect - loading...</div>
          </Route>
        <Route><p>Not Foind</p></Route>
      </Switch>
    </MachineProvider>
  );
};

export default Routes;
