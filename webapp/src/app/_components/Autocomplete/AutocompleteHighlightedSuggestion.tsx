export type AutocompleteHighlightedSuggestion = {
  suggestion: string;
  inputValue?: string;
};
export function AutocompleteHighlightedSuggestion({
  inputValue,
  suggestion,
}: AutocompleteHighlightedSuggestion) {
  if (!inputValue) {
    return <>{suggestion}</>;
  }

  // Splittet inputValue in einzelne Wörter und erstellt ein kombiniertes Pattern
  const words = inputValue.split(/\s+/).filter((word) => word.length > 0);
  const pattern = words.map((word) => `\\b(${word})`).join("|");
  const parts = suggestion.split(new RegExp(pattern, "gi"));

  return (
    <>
      {parts.map((part, i) => {
        // Prüft ob der Teil einem der input-Wörter entspricht
        const isMatch = words.some(
          (word) => word.toLowerCase() === part?.toLowerCase(),
        );
        return isMatch ? <strong key={i}>{part}</strong> : part;
      })}
    </>
  );
}
