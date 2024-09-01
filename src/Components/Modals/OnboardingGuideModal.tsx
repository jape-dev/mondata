import { useState, useCallback, useEffect } from "react";
import "../../App.css";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent, Steps } from "monday-ui-react-core";
import { getImageUrl } from "Utils/image";

const steps = [<div />, <div />, <div />, <div />, <div />, <div />];

const titles = [
  "Welcome to Data Importer",
  "1) Select application ",
  "2) Choose options",
  "3) Set-up your board",
  "4) Run"
];

const content = [
  <div className="mt-2">Please view these steps to get started.</div>,
  <div className="mt-2">
    Select an application and authenticate your account.
  </div>,
  <div className="mt-2">
    Choose your options, including the metrics you want to import.
  </div>,
  <div className="mt-2">
    You can either import into a new board or import into an existing board. If
    importing into an existing board, you'll need to make sure that it contains
    a column that holds the post urls or ad ids for metrics to be imported. For
    tutorials on each application, you can visit our{" "}
    <a className="text-blue underline" href="https://dataimporter.co/blog">
      tutorials page.
    </a>
  </div>,
  <div className="mt-2">
    Press run and you're good to go. Your metrics will start importing into your
    board. If you have any questions or need support, please reach out at{" "}
    <a className="text-blue underline" href="mailto:james@dataimporter.co">
      james@dataimporter.co
    </a>
  </div>
];
const images = ["", "applications", "options", "post-urls", "run-complete", ""];

export interface OnboardingGuideModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const Guide: React.FC<OnboardingGuideModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const stepPrev = useCallback(() => {
    setActiveStepIndex((prevState) => prevState - 1);
  }, []);
  const stepNext = useCallback(() => {
    setActiveStepIndex((prevState) => prevState + 1);
  }, []);
  const onChangeActiveStep = useCallback(
    (_e: any, stepIndex: React.SetStateAction<number>) => {
      setActiveStepIndex(stepIndex);
    },
    []
  );

  const handleFinish = () => {
    setShowModal(false);
    localStorage.setItem("seenOnboarding", "true");
  };

  return (
    <div>
      <Modal
        title={titles[activeStepIndex]}
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <ModalContent>
          {content[activeStepIndex]}
          <img src={getImageUrl(images[activeStepIndex])}></img>
          <Steps
            steps={steps}
            isContentOnTop
            activeStepIndex={activeStepIndex}
            onChangeActiveStep={onChangeActiveStep}
            backButtonProps={{
              onClick: stepPrev,
            }}
            nextButtonProps={{
              onClick: stepNext,
            }}
            onFinish={handleFinish}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};
