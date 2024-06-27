import { useState, useEffect, useCallback } from "react";
import "../../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Modal, ModalContent, Steps } from "monday-ui-react-core";
import { getImageUrl } from "Utils/image";

const monday = mondaySdk();

const steps = [<div />, <div />, <div />, <div />, <div />];

const titles = [
  "Welcome to Data Importer",
  "1) Set-up your board",
  "2) Select application ",
  "3) Choose options",
  "4) Run",
];

const content = [
  <div className="mt-2">Please view these steps to get started.</div>,
  <div className="mt-2">
    Add your items to the board, including a column for URLs or ids that you
    want metrics to be imported for.
  </div>,
  <div className="mt-2">
    2) Select an application and authenticate your account.
  </div>,
  <div className="mt-2">
    3) Choose your options, including the metrics you want to import.
  </div>,
  <div className="mt-2">
    4) Press run and you're good to go. Your metrics will start importing into
    your board.{" "}
  </div>,
];
const images = ["", "post-urls", "applications", "options", "run-complete"];

export interface OnboardingGuideModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export const Guide: React.FC<OnboardingGuideModalProps> = ({
  showModal,
  setShowModal,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const seenOnboarding = localStorage.getItem("seenOnboarding");
    if (seenOnboarding === "true") {
      setShowModal(false);
    }
  }, []);

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
