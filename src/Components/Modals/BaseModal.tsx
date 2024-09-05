import "../../App.css";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent } from "monday-ui-react-core";

export interface BaseModalProps {
  title: string;
  text: string | React.ReactNode;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  title,
  text,
  showModal,
  setShowModal,
}) => {
  return (
    <div>
      <Modal title={title} onClose={() => setShowModal(false)} show={showModal}>
        <ModalContent className="mt-4">
          {text}
        </ModalContent>
      </Modal>
    </div>
  );
};
