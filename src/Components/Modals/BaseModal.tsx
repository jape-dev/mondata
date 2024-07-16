import "../../App.css";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent } from "monday-ui-react-core";

export interface FieldsRequiredModalProps {
  title: string;
  text: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const BaseModal: React.FC<FieldsRequiredModalProps> = ({
  title,
  text,
  showModal,
  setShowModal,
}) => {
  return (
    <div>
      <Modal title={title} onClose={() => setShowModal(false)} show={showModal}>
        <ModalContent>
          <p>{text}</p>
        </ModalContent>
      </Modal>
    </div>
  );
};
