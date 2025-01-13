import {
  ContainerSection,
  ContainerWrapperModifier,
} from "@/app/_components/Container";
import { DesignBox } from "@/app/_components/DesignBox/DesignBox";
import { filterT3ContentElements } from "@/types/typeGuards";
import { T3Page } from "@/types/types.typo3";

type EditorialContent = {
  pageData: T3Page | null | undefined;
};

export function EditorialContent({ pageData }: EditorialContent) {
  const elements = filterT3ContentElements(pageData, ["text", "html"]);

  if (!elements || elements.length === 0) {
    return null;
  }

  return (
    <ContainerSection
      headline={pageData?.meta.title}
      centerHeadline
      containerWidth="lg"
      modifier={[ContainerWrapperModifier.PADDING_Y]}
    >
      <DesignBox>
        {elements.map((element) => (
          <div
            className="editoral-content"
            key={element.id}
            dangerouslySetInnerHTML={{ __html: element.content.bodytext }}
          />
        ))}
      </DesignBox>
    </ContainerSection>
  );
}
