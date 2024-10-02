type Truncate = {
  text: string;
  maxLength: number;
};

export function Truncate({ text, maxLength }: Truncate) {
  if (text.length < maxLength) {
    return text;
  }

  return <>{text.substring(0, maxLength)}&hellip;</>;
}
