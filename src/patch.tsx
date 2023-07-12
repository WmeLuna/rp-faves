/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable consistent-return */
import { common, components, util } from "replugged";
import { cfg, defaultSettings } from "./config";
import { updateServerList } from "./utils";

const { React } = common;
const {
  ContextMenu: { MenuItem },
} = components;

function move(input: any[], from: number, to: number) {
  const elm = input.splice(from, 1)[0];
  input.splice(to, 0, elm);
  updateServerList();
}

function moveUp(id: string) {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  const currentIndex = userChannelIds.indexOf(id);
  if (currentIndex === 0) return;
  const changedUserChannelIds: any = move(userChannelIds, currentIndex, currentIndex - 1);
  cfg.set("userChannelIds", changedUserChannelIds);
}

function moveDown(id: string) {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  const currentIndex = userChannelIds.indexOf(id);
  if (currentIndex >= userChannelIds.length - 1) return;
  const changedUserChannelIds: any = move(userChannelIds, currentIndex, currentIndex + 1);
  cfg.set("userChannelIds", changedUserChannelIds);
}

export function menuPatch(data: any, _menu: any): React.ReactElement {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  if (
    (!data?.channel?.isDM() && !data?.channel?.isGroupDM()) ||
    (data?.channel?.isGroupDM() && data?.user)
  )
    return <></>;

  if (!userChannelIds.includes(data.channel.id))
    return (
      <MenuItem
        label="Add To Favorite"
        id="add-to-favorite"
        action={() => {
          const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
          userChannelIds.push(data.channel.id);
          cfg.set("userChannelIds", userChannelIds);
          updateServerList();
        }}
      />
    );

  return (
    <MenuItem label="Favorite Utils" id="favorite-utils">
      <MenuItem
        label="Remove From Favorite"
        id="remove-from-favorite"
        action={() => {
          const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
          cfg.set(
            "userChannelIds",
            userChannelIds.filter((id) => id !== data.channel.id),
          );
          updateServerList();
        }}
      />
      <MenuItem label="Move Up" id="move-up" action={() => moveUp(data.channel.id)} />
      <MenuItem label="Move Down" id="move-down" action={() => moveDown(data.channel.id)} />
    </MenuItem>
  );
}
