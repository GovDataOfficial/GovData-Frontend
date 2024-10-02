export type AutocompleteHighlightedSuggestion = {
  suggestion: string;
  inputValue?: string;
};
export function AutocompleteHighlightedSuggestion({
  inputValue,
  suggestion,
}: AutocompleteHighlightedSuggestion) {
  const parts = suggestion.split(new RegExp(`(${inputValue})`, "gi"));

  return (
    <>
      {parts.map((part, i) => {
        const isEqual = part.toLowerCase() === inputValue?.toLowerCase();
        return isEqual ? <strong key={i}>{part}</strong> : part;
      })}
    </>
  );
}
