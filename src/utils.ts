import { util, webpack } from "replugged";
import { inject } from ".";
import { getStyles } from "./patch";

export const guildClasses = await webpack.waitForProps<{
  guilds: string;
  sidebar: string;
}>("guilds", "sidebar");

export function updateServerList(): void {
  util
    .waitFor(`.${guildClasses.guilds}`)
    .then(forceUpdate)
    .then(() => {
      removeCSSRule();
      addCSSRule(getStyles());
    })
    .catch(() => {});
}

export function forceUpdate(element: Element | null): void {
  if (!element) return;

  const instance = util.getOwnerInstance(element);
  if (instance) {
    const forceRerender = inject.instead(instance, "render", () => {
      forceRerender();
      return null;
    });
    instance.forceUpdate(() => instance.forceUpdate(() => {}));
  }
}

export function addCSSRule(rule: string | string[]): void {
  const styleId = "rp-faves"; // Unique ID for the style element
  if (typeof rule === "string") rule = [rule];
  if (!document.getElementById(styleId)) {
    const newStyleElement = document.createElement("style");
    newStyleElement.id = styleId;

    document.head.appendChild(newStyleElement);
  }

  const styleElement = document.getElementById(styleId) as HTMLStyleElement;

  rule.forEach((r) => {
    const ruleExists =
      styleElement?.sheet &&
      Array.from(styleElement.sheet.cssRules).find((existingRule) => existingRule.cssText === r);

    if (!ruleExists) {
      styleElement.sheet?.insertRule(r, styleElement.sheet?.cssRules.length);
    }
  });
}

export function removeCSSRule(): void {
  const styleId = "rp-faves"; // Unique ID for the style element

  if (!document.getElementById(styleId)) return;

  document.getElementById(styleId)?.remove();
}
