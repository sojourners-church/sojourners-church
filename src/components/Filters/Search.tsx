import { useEffect, useRef, useState, type FC, type HTMLProps } from "react";
import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

import { useNanostoreURLSync } from "@/lib/hooks/useNanostoreURLSync";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useHotkeys } from "react-hotkeys-hook";

/* -------------------------------------------------------------------------- */
/*                                   Types                                     */
/* -------------------------------------------------------------------------- */
interface SearchProps {
  type: "sermons" | "writings";
}

/* -------------------------------------------------------------------------- */
/*                                Search Component                             */
/* -------------------------------------------------------------------------- */
const Search: FC<HTMLProps<HTMLDivElement> & SearchProps> = ({
  className,
  type,
}) => {
  const inputRef = useRef(null);

  useHotkeys("meta+k", () => {
    inputRef.current.focus();
  });

  // Determine the nanostore key based on type
  const storeKey =
    type === "sermons" ? "sermonSearchTerm" : "writingsSearchTerm";

  const { value: storeValue, setValue } = useNanostoreURLSync<string>(storeKey);

  // Local input state
  const [inputValue, setInputValue] = useState(storeValue ?? "");

  // Debounce the store value to avoid too many updates
  const debouncedValue = useDebounce(inputValue, 300);

  // Sync debounced value back to Nanostore + URL
  useEffect(() => {
    setValue(debouncedValue || undefined);
  }, [debouncedValue, setValue]);

  // Keep input in sync if URL/store changes externally
  useEffect(() => {
    setInputValue(storeValue ?? "");
  }, [storeValue]);

  const placeholder =
    type === "sermons" ? "Search sermons..." : "Search posts...";

  return (
    <InputGroup className={className}>
      <InputGroupInput
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        placeholder={placeholder}
        className="placeholder:text-muted-foreground text-foreground placeholder:italic"
        ref={inputRef}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Search;
