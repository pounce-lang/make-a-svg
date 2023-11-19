import * as React from "react";
import { useHistory } from "react-router-dom";
import { useInterpret } from "@xstate/react";
import { assign } from "xstate";

import { useCreateMachine } from "./useCreateMachine";
import { MachineContext } from "./MachineContext";

export const MachineProvider = ({ children }) => {
  const history = useHistory();
  const machine = useCreateMachine();

  const service = useInterpret(machine, {
    actions: {
      goBack: () => {
        history.goBack();
      },
      // set machine context from the load context call below
      assignContext: assign((_, e) => {
        return e.data;
      })
    },
    services: {
      loadContext: () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ isNormalUser: false, isAltUser: true });
          }, 2000);
        });
      }
    }
  });

  React.useEffect(() => {
    service.onTransition((state, event) => {
      const shouldNavigate =
        state.changed &&
        state.value !== "_redirect_" &&
        event.type !== "back" &&
        event.type !== "redirect" &&
        event.type !== "syncState";
      const shouldReplaceState = state.transitions?.[0]?.meta?.replace;

      // history.push or history.replace fired when machine state changes.
      // this is the main integration point between the state machine and
      // react-router.
      if (shouldNavigate) {
        if (shouldReplaceState) {
          return history.replace(state.value, event.state);
        }

        history.push(state.value, event.state);
      }

      // when the machine starts an 'xstate.init' event is fired and
      // the 'syncState' action below gets the machine to the right
      // state in the case of navigation by URL or refresh
      if (event.type === "xstate.init" || event.type === "redirect") {
        // this updates the state when we send a 'redirect' event within
        // a component. looking for a better way to do this.
        if (event.type === "redirect") {
          history.replace(event.to);
        }

        service.send({
          type: "syncState",
          path: event.to ?? history.location.pathname
        });
      }
    });
  }, [history, service]);

  React.useEffect(() => {
    const unlisten = history.listen((location: { pathname: any; }, type: string) => {
      // for 'popstate' events, this gets the machine back in sync with the URL
      if (type === "POP") { // || type === "REPLACE"
        service.send({ type: "syncState", path: location.pathname });
      }
    });

    return unlisten;
  }, [history, service]);

  return (
    <MachineContext.Provider value={service}>
      {children}
    </MachineContext.Provider>
  );
};

export default MachineProvider;
