import * as React from "react";
import ReactDom from "react-dom";

import { Settings, SettingsProvider } from "./settings-context";
import App from "./app";

import ru from "./locales/ru.json";
import en from "./locales/en.json";

const defaultSettings: Settings = {
  language: ru,
  musicVolume: 1.0,
  currentLanguage: ru["ui.language"],
  uiLanguage: [ru["ui.language"], en["ui.language"]],
  uiSound: true,
};

ReactDom.render(
  <SettingsProvider settings={defaultSettings}>
    <App />
  </SettingsProvider>,
  document.getElementById("root")
);
