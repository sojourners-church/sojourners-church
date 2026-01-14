import { useStore } from "@nanostores/react";
import * as React from "react";

import { CardCustom } from "@/components/Cards/CardCustom";
import { $allBlogData, $filteredBlog } from "@/lib/nanostoreBlog";
import { $allSermonData, $filteredSermons } from "@/lib/nanostoreSermons";
import {
  type BlogData,
  type SermonData,
  isBlogCollection,
  isSermonCollection,
} from "@/lib/types";
import type { Paths } from "@/lib/types";

interface CardDisplayProps {
  data: SermonData[] | BlogData[];
  paths: Paths;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ data, paths }) => {
  let filteredPosts;

  if (isSermonCollection(data)) {
    $allSermonData.set(data);
    filteredPosts = useStore($filteredSermons);
  }

  if (isBlogCollection(data)) {
    $allBlogData.set(data);
    filteredPosts = useStore($filteredBlog);
  }

  return (
    <div className="flex flex-col gap-8 pt-8 lg:grid lg:grid-cols-2">
      {filteredPosts?.map((item) => (
        <CardCustom key={item.id} data={item} paths={paths} />
      ))}
    </div>
  );
};

export { CardDisplay };
