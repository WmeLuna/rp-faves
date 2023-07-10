import { common, components, util } from "replugged";
import { cfg, defaultSettings } from "./config";

const { React } = common;
const { SwitchItem } = components;

export function Settings(): React.ReactElement {
  return (
    <SwitchItem {...util.useSetting(cfg, "unreadFirst", defaultSettings.unreadFirst)}>
      Show unread DMs first
    </SwitchItem>
  );
}
