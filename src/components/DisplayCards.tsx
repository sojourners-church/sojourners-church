import { useStore } from "@nanostores/react";
import * as React from "react";

import Card from "@/components/Card";
import { $allBlogData, $filteredBlog } from "@/data/nanostoreBlog";
import { $allSermonData, $filteredSermons } from "@/data/nanostoreSermons";
import {
  type BlogData,
  type SermonData,
  isBlogCollection,
  isSermonCollection,
} from "@/data/types";
import type { Paths } from "@/data/types";

interface DisplayCardsProps {
  data: SermonData[] | BlogData[];
  paths: Paths;
}

const DisplayCards: React.FC<DisplayCardsProps> = ({ data, paths }) => {
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
        <Card key={item.id} data={item} paths={paths} />
      ))}
    </div>
  );
};

export default DisplayCards;
