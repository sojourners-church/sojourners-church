import type { APIRoute } from "astro";

import { blogPath, eventsPath, menu, sermonsPath } from "@/lib/getMenuItems";

const data = {
  Nav: menu,
  Paths: {
    sermons: sermonsPath,
    events: eventsPath,
    blog: blogPath,
  },
} as const;

type DataKey = keyof typeof data;

export const GET: APIRoute = ({ params }) => {
  const type = params.navType as DataKey;

  // Add validation to handle invalid types
  if (!type || !(type in data)) {
    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify(data[type]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export function getStaticPaths() {
  return Object.keys(data).map((navType) => ({ params: { navType } }));
}
