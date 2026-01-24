import * as React from "react";

import Meta from "@/components/Meta";
import { StyledText } from "@/components/StyledText";
import { Card, CardContent } from "@/lib/components/ui/card";
import {
  type BlogData,
  type SermonData,
  isBlog as isBlogTypeGuard,
  isSermon as isSermonTypeGuard,
} from "@/types";
import type { Paths } from "@/types";

interface CardCustomProps {
  data: SermonData | BlogData;
  paths: Paths;
}

const CardCustom: React.FC<CardCustomProps> = ({ data: inputData, paths }) => {
  const {
    id,
    data: { title, date },
  } = inputData;

  const isSermon = isSermonTypeGuard(inputData);
  const isBlog = isBlogTypeGuard(inputData);

  const baseUrl = isSermon
    ? paths["sermons"]?.path
    : isBlog
      ? paths["blog"]?.path
      : "";

  return (
    <Card className="bg-muted rounded-sm border-none py-0 shadow-sm outline-none">
      <CardContent className="flex flex-row p-0">
        <a
          href={`/${baseUrl}/${id}`}
          className="flex max-h-48 w-full flex-row rounded-sm"
        >
          {isSermon && inputData.series.data.image && (
            <img
              src={inputData.series.data.image}
              alt="series"
              className="my-4 ml-4 h-20 w-20 self-center rounded-sm object-cover object-center md:m-0 md:h-48 md:w-48 md:rounded-none md:rounded-l-sm"
            />
          )}
          <div className="flex flex-2/3 flex-col justify-center gap-2 p-4 md:p-8">
            <StyledText as="h3" variant="subheading">
              {title}
            </StyledText>
            <Meta
              date={date}
              scripture={
                isSermon && inputData.data.scripture
                  ? inputData.data.scripture
                  : undefined
              }
              preacher={
                isSermon && inputData.preacher.data.name
                  ? inputData.preacher.data.name
                  : undefined
              }
              tags={
                isBlog && inputData.data.tags ? inputData.data.tags : undefined
              }
              variant="outline"
              paths={paths}
            />
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export { CardCustom };
