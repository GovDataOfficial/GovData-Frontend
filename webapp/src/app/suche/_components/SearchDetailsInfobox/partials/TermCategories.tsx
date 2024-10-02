import { CategoryImage } from "@/app/_components/Categories/CategoryImage";

type TermCategories = {
  categories?: string[];
  title: string;
};

export function TermCategories({ title, categories }: TermCategories) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <>
      <dt>{title}</dt>
      {categories.map((category) => (
        <dd key={category}>
          <CategoryImage type={category} />
        </dd>
      ))}
    </>
  );
}
