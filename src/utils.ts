import { util, webpack } from "replugged";
import { inject } from ".";

export const guildClasses = await webpack.waitForProps<{
  guilds: string;
  sidebar: string;
}>("guilds", "sidebar");

export function updateServerList(): void {
  util
    .waitFor(`.${guildClasses.guilds}`)
    .then(forceUpdate)
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
