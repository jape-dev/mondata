import "../../App.css";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent } from "monday-ui-react-core";

export interface FieldsRequiredModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const FieldsRequiredModal: React.FC<FieldsRequiredModalProps> = ({
  showModal,
  setShowModal,
}) => {
  return (
    <div>
      <Modal
        title="Error: Required Fields"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <ModalContent>
          <p>Ensure all required options are selected before running.</p>
        </ModalContent>
      </Modal>
    </div>
  );
};
