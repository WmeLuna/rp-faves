import { Injector, types, webpack } from "replugged";
import { cfg, defaultSettings } from "./config";
import { menuPatch } from "./patch";
export const inject = new Injector();

export async function start(): Promise<void> {
  inject.after(
    //@ts-expect-error ugh
    webpack.getByProps("getUnreadPrivateChannelIds"),
    "getUnreadPrivateChannelIds",
    (_args, _res, _instance) => {
      const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
      if (cfg.get("unreadFirst", defaultSettings.unreadFirst))
        return [..._res, ...(userChannelIds as [])];
      return [...(userChannelIds as []), ..._res];
    },
  );
  inject.utils.addMenuItem(
    types.ContextMenuTypes.GdmContext,
    (data) => {
      return menuPatch(data);
    },
    4,
  );
  inject.utils.addMenuItem(
    types.ContextMenuTypes.UserContext,
    (data) => {
      return menuPatch(data);
    },
    4,
  );
}

export function stop(): void {
  inject.uninjectAll();
}

export { Settings } from "./Settings";
