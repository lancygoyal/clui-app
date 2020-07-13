import React, { Component } from "react";
import { Session } from "@replit/clui-session";
import Prompt from "./Prompt";
import commands from "./commands";

export default class CLUI extends Component {
  render() {
    return (
      <div className="clui">
        <Session>
          <Prompt command={commands} />
        </Session>
      </div>
    );
  }
}
