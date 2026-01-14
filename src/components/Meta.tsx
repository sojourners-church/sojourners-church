// import formatOsis from "@/lib/bible-reference-formatter/en";
import osisToEn from "bible-reference-formatter";
import { format as datefnsFormat } from "date-fns";
import * as React from "react";
import slugify from "slugify";

import { Badge } from "@/components/ui/badge";
import useIsMobile from "@/lib/hooks/useIsMobile";

interface MetaProps {
  date?: Date;
  scripture?: string[];
  preacher?: string;
  series?: string;
  tags?: string[];
  variant?: "muted" | "outline";
  compact?: boolean;
  linked?: boolean;
}

type DynamicPath = {
  label: string;
  path: string;
};

type Paths = {
  blog: DynamicPath;
  sermons: DynamicPath;
  events: DynamicPath;
};

const getPaths = async (): Promise<Paths> => {
  const res = await fetch(
    `${import.meta.env.DEV ? "http://localhost:4321" : import.meta.env.SITE}/api/Paths.json`,
  );
  const data = await res.json();

  return data;
};

const Meta: React.FC<MetaProps> = ({
  date,
  scripture,
  preacher,
  series,
  tags,
  variant = "muted",
  compact = undefined,
  linked = false,
}) => {
  const isCompact = compact ?? useIsMobile();
  const [paths, setPaths] = React.useState<Paths | null>(null);

  React.useEffect(() => {
    getPaths().then(setPaths);
  }, []);

  if (!paths) return null;

  const formattedDate =
    date &&
    datefnsFormat(
      new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000),
      isCompact ? "MM/dd/yy" : "LLLL do, yyyy",
    );

  const metaItems: (string | React.JSX.Element)[] = [];

  if (formattedDate) metaItems.push(formattedDate);

  if (scripture)
    scripture.forEach((ref) =>
      metaItems.push(osisToEn(isCompact ? "esv-short" : "esv-long", ref)),
    );

  if (preacher)
    metaItems.push(
      linked ? (
        <a
          href={`/${paths?.sermons.path}/?preacher=${slugify(preacher, { strict: true }).toLowerCase()}`}
        >
          {preacher}
        </a>
      ) : (
        preacher
      ),
    );

  if (series)
    metaItems.push(
      linked ? (
        <a
          href={`/${paths?.sermons.path}/?series=${slugify(series, { strict: true }).toLowerCase()}`}
        >
          {series}
        </a>
      ) : (
        series
      ),
    );

  if (tags)
    tags.forEach((tag) =>
      metaItems.push(
        linked ? (
          <a
            href={`/${paths?.blog.path}/?tag=${tag}`}
            className="not-prose"
            key={tag}
          >
            {tag}
          </a>
        ) : (
          tag
        ),
      ),
    );

  return (
    <div className="flex flex-wrap gap-2">
      {metaItems.map((item, index) => (
        <Badge
          variant={variant}
          className={variant === "outline" ? "text-muted-foreground" : ""}
          key={index}
        >
          {item}
        </Badge>
      ))}
    </div>
  );
};

export default Meta;
