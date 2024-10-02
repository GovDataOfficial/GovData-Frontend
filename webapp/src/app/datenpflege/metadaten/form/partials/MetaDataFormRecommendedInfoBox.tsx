import { InfoBox } from "@/app/_components/InfoBoxes/InfoBox";

export function MetaDataFormRecommendedInfoBox() {
  return (
    <InfoBox title="Es wurden noch nicht alle empfohlenen Felder ausgefüllt">
      <p className={"m-0"}>
        Um eine hohe Datenqualität sicherzustellen, wird nahegelegt, die im
        Metadatenformular empfohlenen Felder vollständig auszufüllen. Eine
        lückenhafte Eingabe kann zu einer verschlechterten Datenqualität führen
        und die Auffindbarkeit, Zugänglichkeit und Interoperabilität der Daten
        negativ beeinflussen.
      </p>
    </InfoBox>
  );
}
