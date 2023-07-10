import { Injector, Logger, webpack } from "replugged";
import { cfg, defaultSettings } from "./config";

const inject = new Injector();
const logger = Logger.plugin("RP-Faves");

export async function start(): Promise<void> {
  inject.after(
    //@ts-expect-error ugh
    webpack.getByProps("getUnreadPrivateChannelIds"),
    "getUnreadPrivateChannelIds",
    (args, res, instance) => {
      const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
      if (cfg.get("unreadFirst", defaultSettings.unreadFirst))
        return [...res, ...(userChannelIds as [])];
      return [...(userChannelIds as []), ...res];
    },
  );
}

export function stop(): void {
  inject.uninjectAll();
}

export { Settings } from "./Settings";
