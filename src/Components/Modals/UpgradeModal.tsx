import "../../App.css";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent, Button } from "monday-ui-react-core";
import { Night } from "monday-ui-react-core/icons";
import { getImageUrl } from "Utils/image";
import mondaySdk from "monday-sdk-js";
import { useEffect, useState } from "react";

export interface ModalProps {
  title: string;
  text: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const monday = mondaySdk();

export const UpgradeModal: React.FC<ModalProps> = ({
  title,
  text,
  showModal,
  setShowModal,
}) => {
  const [accountSlug, setAccountSlug] = useState<string>();

  useEffect(() => {
    monday.get("location").then((res: any) => {
      if (res.data && res.data.href) {
        const url = new URL(res.data.href);
        const hostname = url.hostname;
        const parts = hostname.split(".");
        if (parts.length > 2) {
          setAccountSlug(`${parts[0]}.monday.com/marketplace/v2/app/installed`);
        }
      }
    });
  }, []);
  const handleClick = () => {
    const link = accountSlug
      ? `https://${accountSlug}`
      : "https://monday.com/marketplace/listing/10000557/data-importer";
    window.open(link, "_blank");
    setShowModal(false);
  };

  return (
    <div>
      <Modal title={title} onClose={() => setShowModal(false)} show={showModal}>
        <ModalContent className="mt-4">
          <p className="mb-5">{text}</p>
          <img src={getImageUrl("schedule")} className="mb-5" />
          <Button
            leftIcon={Night}
            onClick={handleClick}
            color={Button.colors.POSITIVE}
          >
            Upgrade
          </Button>
        </ModalContent>
      </Modal>
    </div>
  );
};
