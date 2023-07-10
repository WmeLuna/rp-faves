import { settings } from "replugged";

interface Settings {
  userChannelIds?: string[];
  unreadFirst?: boolean;
}

export const defaultSettings = {
  userChannelIds: [],
  unreadFirst: true,
};

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "com.wmeluna.RP-Faves",
  defaultSettings,
);
