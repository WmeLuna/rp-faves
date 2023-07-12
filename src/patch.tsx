import { common, components } from "replugged";
import { cfg, defaultSettings } from "./config";
import { updateServerList } from "./utils";

const { React } = common;
const {
  ContextMenu: { MenuItem, MenuSeparator },
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
  move(userChannelIds, currentIndex, currentIndex - 1);
  cfg.set("userChannelIds", userChannelIds);
}

function moveDown(id: string) {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  const currentIndex = userChannelIds.indexOf(id);
  if (currentIndex >= userChannelIds.length - 1) return;
  move(userChannelIds, currentIndex, currentIndex + 1);
  cfg.set("userChannelIds", userChannelIds);
}

export function menuPatch(data: any): React.ReactElement {
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
      <MenuItem label="Move Up" id="move-up" action={() => moveUp(data.channel.id)} />
      <MenuItem label="Move Down" id="move-down" action={() => moveDown(data.channel.id)} />
      <MenuSeparator></MenuSeparator>
      <MenuItem
        label="Remove From Favorite"
        id="remove-from-favorite"
        color="danger"
        action={() => {
          const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
          cfg.set(
            "userChannelIds",
            userChannelIds.filter((id) => id !== data.channel.id),
          );
          updateServerList();
        }}
      />
    </MenuItem>
  );
}

export function getStyles() : string[] {
  const userChannelIds = cfg.get("userChannelIds", defaultSettings.userChannelIds);
  const styles = userChannelIds.map(id => `[class^="wrapper-"][data-list-item-id="guildsnav___${id}"]::before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' role='img' width='14' height='14' viewBox='0 0 24 24'%3E%3Cpath fill='white' fill-rule='evenodd' clip-rule='evenodd' d='M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15096 9.87801V9.88001L5.73596 8.46501L4.32196 9.88001L8.56496 14.122L2.90796 19.778L4.32196 21.192L9.97896 15.536L14.222 19.778L15.636 18.364L14.222 16.95L19.171 12H19.172L20.586 13.414L22 12Z'%3E%3C/path%3E%3C/svg%3E");
    background-color: var(--background-accent);
    position: absolute;
    left: 0;
    top: 0;
    width: 14px;
    height: 14px;
    padding: 2px;
    transform: scaleX(-1);
    border-radius: 8px;
  }`);
  return styles;
}
