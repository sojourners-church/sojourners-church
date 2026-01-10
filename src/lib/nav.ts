import slugify from "slugify";

import config from "@/_site-config.json";

export type ConfigMenuItem = {
  title: string;
  type?: string;
  subMenu?: ConfigMenuItem[];
};

export interface NavEntry {
  label: string;
  path: string;
  subMenu?: NavEntry[];
}

export type DynamicPath = {
  label: string;
  path: string;
};

const prepNavEntry = (item: ConfigMenuItem): NavEntry => {
  return item.subMenu
    ? {
        label: item.title,
        path: slugify(item.title, { lower: true, strict: true }),
        subMenu: item.subMenu.map((subItem: ConfigMenuItem) =>
          prepNavEntry(subItem),
        ),
      }
    : {
        label: item.title,
        path: slugify(item.title, { lower: true, strict: true }),
      };
};

export const navEntries: NavEntry[] = config.header.menu.map((item) =>
  prepNavEntry(item),
);

const findPathByType = (
  menuItemsArray: ConfigMenuItem[],
  targetType: string,
): DynamicPath | undefined => {
  const results: DynamicPath[] = [];

  for (const menuItem of menuItemsArray) {
    if (menuItem.type === targetType) {
      results.push({
        label: menuItem.title,
        path: slugify(menuItem.title, { lower: true, strict: true }),
      });
    }
    if (menuItem.subMenu && Array.isArray(menuItem.subMenu)) {
      const subMenuItems = findPathByType(menuItem.subMenu, targetType);
      if (subMenuItems) {
        results.push({
          label: subMenuItems.label,
          path: `${slugify(menuItem.title, { lower: true, strict: true })}/${subMenuItems.path}`,
        });
      }
    }
  }

  if (results.length > 1) {
    throw new Error(
      `Max one menu item with type "${targetType}" allowed! Found ${results.length} in configuration.`,
    );
  }

  return results[0];
};

export const eventsPath = findPathByType(config.header.menu, "Events");
export const blogPath = findPathByType(config.header.menu, "Blog");
export const sermonsPath = findPathByType(config.header.menu, "Sermons");
