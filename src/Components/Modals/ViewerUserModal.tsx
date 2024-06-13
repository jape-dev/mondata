import { useState, useEffect } from "react";
import "../../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent, Steps } from "monday-ui-react-core";

const monday = mondaySdk();

export const ViewerModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    monday
      .get("context")
      .then((res: any) => {
        if (res.data?.user) {
          const isViewOnly = res.data.user.isViewOnly;
          if (isViewOnly === true) {
            setShowModal(true);
          }
        }
      })
      .catch((error: any) => {
        console.error("Error fetching context", error);
      });
  }, []);

  return (
    <div>
      <Modal
        title={"Viewer Access"}
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <ModalContent>
          <p>
            This application can be used by users who have member, admin or
            guest access. As a viewer, you are unable to use this app. Please
            contact your admin to request a different role.
          </p>
        </ModalContent>
      </Modal>
    </div>
  );
};
