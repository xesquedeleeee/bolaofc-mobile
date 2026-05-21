import useThemeStore from "../store/themeStore";
import { DarkColors, LightColors } from "../../constants/theme";

export function useThemeColors() {
  const isDark = useThemeStore((s) => s.isDark);
  return isDark ? DarkColors : LightColors;
}
