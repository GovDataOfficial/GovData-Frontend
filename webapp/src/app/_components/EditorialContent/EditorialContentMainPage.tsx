import { T3Page } from "@/types/types.typo3";
import { filterT3ContentElements } from "@/types/typeGuards";
import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";

type EditorialContent = {
  pageData: T3Page | null | undefined;
};

/**
 * Editoral Content for Main Page.
 */
export function EditorialContentMainPage({ pageData }: EditorialContent) {
  const elements = filterT3ContentElements(pageData, ["text", "html"]);

  if (!elements || elements.length === 0) {
    return null;
  }

  // mapping each element to its own section
  return elements.map((element) => {
    return (
      <ContainerSection
        key={element.id}
        modifier={[ContainerWrapperModifier.MARGIN_TOP]}
        headline={element.content.header}
        headlineLevel={"h2"}
        centerHeadline
        containerWidth="930"
      >
        <div
          key={element.id}
          dangerouslySetInnerHTML={{ __html: element.content.bodytext }}
        />
      </ContainerSection>
    );
  });
}
