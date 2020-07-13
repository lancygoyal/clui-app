import React, { useState, useCallback, useEffect, useRef } from "react";
import classnames from "classnames";
import Downshift from "downshift";
import PromptIcon from "./PromptIcon";
import MatchSubString from "./MatchSubString";
import useCluiInput from "./useCluiInput";

const MenuItem = (props) => {
  const { item, highlighted } = props;

  return (
    <div className={classnames("root", { highlighted })}>
      <div className="value">
        {item.searchValue ? (
          <MatchSubString source={item.value} match={item.searchValue} />
        ) : (
          item.value
        )}
      </div>
      {item.data && item.data.description ? (
        <div className="description">{item.data.description}</div>
      ) : null}
      <style jsx>
        {`
          .root {
            word-break: break-word;
            color: white;
          }
          .value {
            flex: 0 0 auto;
          }
          .value :global(b) {
            opacity: 0.5;
          }
          .description {
            flex: 1 1 auto;
            font-size: 12px;
            padding: 5px 10px;
            font-family: sans-serif;
            opacity: 0.8;
            background-color: rgba(255, 255, 255, 0.1);
          }
          .highlighted {
            background-color: cornflowerblue;
            color: white;
          }
          .highlighted .description {
            background-color: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>
    </div>
  );
};

const Prompt = (props) => {
  const input = useRef > null;
  const ran = useRef(false);
  const [focused, setFocused] = useState(false);

  const [state, update] = useCluiInput({
    command: props.command,
    value: props.value || "",
    index: props.value ? props.value.length : 0,
  });

  const onKeyUp = useCallback(
    (e) => update({ index: e.target.selectionStart }),
    [update]
  );

  const run = useCallback(() => {
    if (!props.item || !state.run) {
      return;
    }

    ran.current = true;

    if (input.current) {
      input.current.blur();
    }

    props.item
      .insertAfter(state.run(), <Prompt {...props} autoRun={false} value="" />)
      .next();
  }, [props.item, state.run]);

  useEffect(() => {
    if (ran.current) {
      return;
    }

    if (props.autoRun && state.run) {
      run();
    }
  }, [props.autoRun, state.run, run]);

  useEffect(() => {
    if (input.current && props.autoFocus) {
      const { value } = input.current;
      input.current.focus();
      input.current.selectionStart = value.length;
    }
  }, [props.autoFocus, input.current]);

  const isLastSession =
    props.item && props.item.index === props.item.session.currentIndex;

  return (
    <Downshift
      defaultHighlightedIndex={0}
      initialHighlightedIndex={0}
      inputValue={state.value}
      onChange={(option) => {
        if (!option) {
          return;
        }

        update({
          value: `${option.inputValue} `,
          index: option.cursorTarget + 1,
        });
      }}
      itemToString={() => state.value}
    >
      {(ds) => {
        const inputProps = ds.getInputProps({
          autoFocus: true,
          spellCheck: false,
          autoComplete: "off",
          placeholder: "run a command",
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          onKeyUp,
          onChange: ({ currentTarget }) => {
            update({
              value: currentTarget.value,
              index: currentTarget.selectionStart || 0,
            });
          },
          onKeyDown: (event) => {
            if (event.key === "Enter") {
              if (state.run) {
                run();

                return;
              }

              if (ds.highlightedIndex !== undefined) {
                ds.selectHighlightedItem();
              }
            }

            if (event.key === "ArrowUp" && ds.highlightedIndex === 0) {
              // eslint-disable-next-line no-param-reassign
              event.nativeEvent.preventDownshiftDefault = true;
              event.preventDefault();
              ds.setState({ highlightedIndex: null });
            }
          },
        });

        return (
          <div
            className={classnames("prompt", {
              active: isLastSession || focused,
            })}
          >
            <PromptIcon />
            <div className="input">
              {(isLastSession || focused) && state.run ? (
                <div className="input-shadow">
                  <span>{state.value}</span>
                  <button type="button" onClick={run}>
                    run ↵
                  </button>
                </div>
              ) : null}
              <input ref={input} {...inputProps} />
              {focused ? (
                <div className="menu-anchor">
                  <div className="menu">
                    <div className="menu-offset">
                      {state.value.slice(0, state.nodeStart || 0)}
                    </div>
                    <ul {...ds.getMenuProps()}>
                      {state.options.map((item, index) => (
                        <li
                          {...ds.getItemProps({ item })}
                          key={item.value}
                          className={classnames("item", {
                            active: ds.highlightedIndex === index,
                          })}
                        >
                          <MenuItem
                            item={item}
                            highlighted={ds.highlightedIndex === index}
                            theme={props.theme}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </div>
            <style jsx>
              {`
                .prompt {
                  position: relative;
                  color: inherit;
                  display: flex;
                  cursor: text;
                  opacity: 0.8;
                }
                .prompt.active {
                  opacity: 1;
                }
                .prompt:focus-within > :global(div:first-child) {
                  color: cornflowerblue;
                }
                .input {
                  position: relative;
                  flex: 1 1 auto;
                }
                .input-shadow {
                  pointer-events: none;
                  position: absolute;
                  left: 0;
                  top: 0;
                }
                .input-shadow span {
                  visibility: hidden;
                }
                .input-shadow button {
                  margin-left: 5px;
                  pointer-events: all;
                  background-color: transparent;
                  border: 1px solid rgba(255, 2555, 255, 0.3);
                  color: rgba(255, 2555, 255, 0.8);
                  border-radius: 3px;
                  font-size: 14px;
                  text-transform: uppercase;
                  padding: 3px 8px;
                  font-size: 14px;
                  cursor: pointer;
                }
                .input-shadow button:hover {
                  background-color: cornflowerblue;
                }
                .input-shadow button:focus {
                  outline: 0 none;
                }
                input,
                .input-shadow,
                .menu-offset {
                  font-size: 16px;
                  font-family: inherit;
                }
                input {
                  color: inherit;
                  background-color: transparent;
                  border: 0 none;
                  display: block;
                  width: 100%;
                  flex: 1 1 auto;
                  padding: 0;
                  line-height: 24px;
                }
                ::placeholder {
                  color: gray;
                }
                input:focus {
                  outline: 0 none;
                }
                .menu-anchor {
                  position: absolute;
                  top: 100%;
                  display: flex;
                }
                .menu {
                  display: flex;
                }
                .menu-offset {
                  visibility: hidden;
                  white-space: pre;
                  flex: 0 0 auto;
                  height: 0;
                }
                ul {
                  padding: 0;
                  margin: 0;
                  list-style: none;
                  flex: 1 1 auto;
                  max-width: 400px;
                  background-color: black;
                  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }
                li {
                  cursor: pointer;
                }
              `}
            </style>
          </div>
        );
      }}
    </Downshift>
  );
};

export default Prompt;
