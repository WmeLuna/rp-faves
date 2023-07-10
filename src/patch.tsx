import { common, components } from "replugged";
import { cfg, defaultSettings } from "./config";

const { React } = common;
const {
  ContextMenu: { MenuItem },
} = components;

export function menuPatch(data, menu) {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  console.log(data, menu);
  if (
    !data?.channel?.isDM() ||
    !data?.channel?.isGroupDM() ||
    (data?.channel?.isGroupDM() && data?.user)
  )
    return;

  if (!userChannelIds.includes(data.channel.id))
    return (
      <MenuItem
        label="Add To Favorite"
        id="add-to-favorite"
        action={() => {
          const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
          userChannelIds.push(data.channel.id);
          cfg.set("userChannelIds", userChannelIds);
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
        }}
      />
      <MenuItem label="Move Up" id="move-up" action={() => moveUp(data.channel.id)} />
      <MenuItem label="Move Down" id="move-down" action={() => moveDown(data.channel.id)} />
    </MenuItem>
  );
}

function move(input) {
  const elm = input.splice(from, 1)[0];
  input.splice(to, 0, elm);
}

function moveUp(id) {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  const currentIndex = userChannelIds.findIndex(id);
  if (currentIndex === 0) return;
  const changedUserChannelIds = move(userChannelIds, currentIndex, currentIndex - 1);
  cfg.set("userChannelIds", changedUserChannelIds);
}

function moveDown(id) {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  const currentIndex = userChannelIds.findIndex(id);
  if (currentIndex >= currentIndex.length - 1) return;
  const changedUserChannelIds = move(userChannelIds, currentIndex, currentIndex + 1);
  cfg.set("userChannelIds", changedUserChannelIds);
}
