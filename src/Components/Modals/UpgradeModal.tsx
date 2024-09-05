import "../../App.css";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent, Button } from "monday-ui-react-core";
import { Night } from "monday-ui-react-core/icons";
import { getImageUrl } from "Utils/image";

export interface ModalProps {
  title: string;
  text: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const UpgradeModal: React.FC<ModalProps> = ({
  title,
  text,
  showModal,
  setShowModal,
}) => {
  const handleClick = () => {
    const link = "https://dataimporter.monday.com/apps/installed_apps/10150307";
    window.open(link, "_blank");
    setShowModal(false);
  };

  return (
    <div>
      <Modal title={title} onClose={() => setShowModal(false)} show={showModal}>
        <ModalContent className="mt-4">
          <p className="mb-5">{text}</p>
          <img src={getImageUrl("schedule")}  className="mb-5" />
          <Button leftIcon={Night} onClick={handleClick} color={Button.colors.POSITIVE}>
            Upgrade
          </Button>
        </ModalContent>
      </Modal>
    </div>
  );
};
