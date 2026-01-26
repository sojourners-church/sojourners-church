import { Settings2, Undo2 } from "lucide-react";
import { type FC } from "react";

import Combobox from "@/components/Combobox";
import DatePicker from "@/components/DatePicker";
import Search from "@/components/Search";
import StyledText from "@/components/StyledText";
import { Button } from "@/components/ui/button";
import type {
  BlogData,
  PreacherData,
  SeriesData,
  SermonData,
} from "@/data/types";
import { getFilterTitle } from "@/utils/getFilterTitle";
import { useFilters } from "@/utils/useFilters";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
interface DisplayFiltersProps {
  allSermonData?: SermonData[];
  allSeriesData?: SeriesData[];
  allPreachersData?: PreacherData[];
  allBlogData?: BlogData[];
  allTags?: string[] | null;
}

/**
 * Component for filtering sermon and writing posts
 */
const DisplayFilters: FC<DisplayFiltersProps> = ({
  allSermonData,
  allSeriesData,
  allPreachersData,
  allBlogData,
  allTags,
}) => {
  const {
    filters,
    hasActiveFilters,
    isShowFilters,
    setIsShowFilters,
    resetFilters,
  } = useFilters();

  const normalizedFilters = {
    series: filters.series.value ?? undefined,
    preacher: filters.preacher.value ?? undefined,
    tag: filters.tag.value ?? undefined,
    from: filters.from.value ?? undefined,
    to: filters.to.value ?? undefined,
    sermonSearchTerm: filters.sermonSearchTerm.value ?? undefined,
    blogSearchTerm: filters.blogSearchTerm.value ?? undefined,
  };

  /* ------------------------------------------------------------------------ */
  /*                              Derived Values                              */
  /* ------------------------------------------------------------------------ */

  const type = allSermonData ? "sermons" : "blog";

  const titleText = getFilterTitle({
    ...normalizedFilters,
    allBlogData,
    allSeriesData,
    allPreachersData,
  });

  /* ------------------------------------------------------------------------ */
  /*                                   Render                                  */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="flex flex-col gap-4">
      <StyledText as="h2" variant="heading">
        {titleText}
      </StyledText>
      <div className="flex flex-col gap-4 md:flex-row">
        <Search className="bg-muted text-muted-foreground" type={type} />
        <div className="flex content-between justify-between self-end">
          <Button
            variant="link"
            onClick={() => setIsShowFilters(!isShowFilters)}
            className={isShowFilters ? "" : "text-muted-foreground"}
          >
            <Settings2 />
            {isShowFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="link"
              className="flex w-fit cursor-pointer items-center gap-1 px-0 py-0"
              onClick={resetFilters}
            >
              Reset Filters
              <Undo2 />
            </Button>
          )}
        </div>
      </div>
      {isShowFilters && (
        <div className="flex flex-col gap-x-8 gap-y-4 lg:grid lg:grid-cols-2">
          {allSeriesData && <Combobox data={allSeriesData} type="series" />}
          {allPreachersData && (
            <Combobox data={allPreachersData} type="preacher" />
          )}
          {allSermonData && <DatePicker data={allSermonData} type="from" />}
          {allSermonData && <DatePicker data={allSermonData} type="to" />}
          {allTags && <Combobox data={allTags} type="tag" />}
        </div>
      )}
    </div>
  );
};

export default DisplayFilters;
