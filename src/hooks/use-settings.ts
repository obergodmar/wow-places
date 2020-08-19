import { useContext } from "react";
import SettingsContext, { SettingsContextType } from "../settings-context";

export const useSettings = (): SettingsContextType =>
  useContext(SettingsContext);
