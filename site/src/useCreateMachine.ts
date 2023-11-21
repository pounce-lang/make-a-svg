import * as React from "react";
import { createMachine } from "xstate";

// machine states correspond to routes in the app (with the
// exception of '_redirect_')
const states = {
  "_redirect_": {
    // this conditional logic serves as the root redirect on
    // start of the machine
    always: [
      {
        target: "/simpletry",
        cond: "isNormalUser",
        meta: { replace: true }
      },
      {
        target: "/about",
        cond: "isAltUser",
        meta: { replace: true }
      },
      {
        target: "/oneof50",
        meta: { replace: true }
      }
    ]
  },
  // initial machine state, invokes api call to get necessary context values
  "/": {
    invoke: {
      src: "loadContext",
      onDone: {
        actions: "assignContext",
        target: "_redirect_"
      }
    }
  },
  "/about": {
    on: {
        aevent: "/oneof50",
        bevent: "/simpletry",
        cevent: "/try2",
    }
  },
  "/simpletry": {},
  "/try2": {},
  "/oneof50": {},
};

const routes = Object.keys(states).filter((route) => route !== "_redirect_");

export const useCreateMachine = () => {
  return React.useMemo(
    () =>
      createMachine(
        {
          id: "routing",
          initial: "/",
          on: {
            // used to machine state to URL in the case of
            // popstate events, refresh, navigation by url, redirects
            syncState: routes.map((path) => ({
              target: path,
              cond: (_, e: any) => (e.path === path)
            }))
          },
          states,
          context: () => ({
            isNormalUser: undefined,
            isAltUser: undefined
          }),
          predictableActionArguments: true
        },
        {
          guards: {
            isNormalUser: (ctx: any) => ctx.isNormalUser,
            isAltUser: (ctx: any) => ctx.isAltUser,
            isOptionA: (_, e: any) => e.option === "a",
            isOptionB: (_, e: any) => e.option === "b"
          }
        }
      ),
    []
  );
};
