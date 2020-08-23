import "@babel/polyfill";
import * as React from "react";
import ReactDom from "react-dom";

import { SettingsProvider } from "./settings-context";
import { bootstrapSettings } from "./utils";
import App from "./app";

ReactDom.render(
  <SettingsProvider settings={bootstrapSettings()}>
    <App />
  </SettingsProvider>,
  document.getElementById("root")
);
