import { useReducer, useCallback, useRef } from "react";
import inputState from "@replit/clui-input";

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        ...action.updates,
      };
    default:
      return state;
  }
};

const useCluiInput = (options) => {
  const input = useRef(null);

  const [state, dispatch] = useReducer(reducer, {
    value: options.value || "",
    index: options.index || 0,
    options: [],
    loading: false,
    commands: [],
    exhausted: false,
  });

  if (!input.current) {
    input.current = inputState({
      command: options.command,
      value: options.value,
      index: options.index,
      onUpdate: (updates) => {
        dispatch({ type: "UPDATE", updates: { loading: false, ...updates } });
      },
    });
  }

  const update = useCallback(
    (updates) => {
      if (input.current) {
        const different = {};

        if (updates.value !== undefined && updates.value !== state.value) {
          different.value = updates.value;
        }

        if (updates.index !== undefined && updates.index !== state.index) {
          different.index = updates.index;
        }

        if (!Object.keys(different).length) {
          return;
        }

        input.current(different);
        dispatch({ type: "UPDATE", updates: { loading: true, ...different } });
      }
    },
    [dispatch, state.value, state.index]
  );

  return [state, update];
};

export default useCluiInput;
