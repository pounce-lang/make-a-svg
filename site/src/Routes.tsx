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
        <Route exact path="/oneof50" component={OneOfFifty} />
        <Route exact path="/simpletry" component={SimpleTry} />
        <Route exact path="/about" component={About} />
        <Route
          exact
          path="/"
          render={() => <div>root redirect - loading...</div>}
        />
        <Route render={() => "not found"} />
      </Switch>
    </MachineProvider>
  );
};

export default Routes;
