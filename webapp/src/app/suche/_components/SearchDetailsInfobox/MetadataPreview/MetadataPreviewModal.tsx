"use client";

import { useState } from "react";

import { Button } from "@/app/_components/Button/Button";
import { Modal } from "@/app/_components/Modal/Modal";
import { MetadataPreviewModalContent } from "@/app/suche/_components/SearchDetailsInfobox/MetadataPreview/MetadataPreviewModalContent";
import { i18n } from "@/i18n";

export type MetadataPreviewModal = {
  metadataName: string;
};

export function MetadataPreviewModal({ metadataName }: MetadataPreviewModal) {
  const { t } = i18n;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button variant="a" onClick={openModal}>
        {t("search.details.infobox.metaDataDownload.button")}
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={t("search.details.infobox.metaDataDownload.modal.title")}
      >
        <MetadataPreviewModalContent metadataName={metadataName} />
      </Modal>
    </>
  );
}
