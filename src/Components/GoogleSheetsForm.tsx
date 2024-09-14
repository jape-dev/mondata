import { useState, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Icon,
  Tooltip,
  TextField,
} from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  CustomAPIRequest,
  RunService,
  UserPublic,
  ScheduleInput,
  Body_run_run,
  Body_run_schedule,
  RunResponse,
} from "../api";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";
import { BaseModal } from "./Modals/BaseModal";
import { Option } from "../Utils/models";
import { BoardBlock } from "./FormBlocks/BoardBlock";

const monday = mondaySdk();

export interface GoogleSheetsFormProps {
  sessionToken?: string;
  workspaceId: number;
  user: UserPublic;
  isRunning: boolean;
  isScheduled: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: number;
  setBoardId: React.Dispatch<React.SetStateAction<number>>;
}

export const GoogleSheetsForm: React.FC<GoogleSheetsFormProps> = ({
  sessionToken,
  workspaceId,
  user,
  isScheduled,
  isRunning,
  setIsRunning,
  setLoading,
  setSuccess,
  boardId,
  setBoardId,
}) => {
  const [url, setUrl] = useState<string>();
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [boardName, setBoardName] = useState<string>();
  const [boards, setBoards] = useState<Option[]>([]);
  const [selectedBoardOption, setSelectedBoardOption] = useState<Option>({
    label: "Import into a new board",
    value: 999,
  });
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [selectedGroupOption, setSelectedGroupOption] = useState<Option | undefined>({
    label: "Import into a new group",
    value: 999,
  });
  const [groupName, setGroupName] = useState<string>();

  useEffect(() => {
    if (isRunning === true) {
      handleRunClick();
    }
  }, [isRunning]);

  const checkBoardName = () => {
    const currentNames = boards.map((board) => board.label);
    if (boardName && currentNames.includes(boardName)) {
      setShowNameModal(true);
      setLoading(false);
      setSuccess(false);
      return false;
    } else {
      return true;
    }
  };

  const handleRunClick = async () => {
    const isValidName = checkBoardName();
    if (!isValidName) {
      setIsRunning(false);
      setLoading(false);
      return;
    }
    const scheduleInput: ScheduleInput = {
      user_id: user.monday_user_id,
      board_id: boardId,
      account_id: user.monday_account_id,
      workspace_id: workspaceId,
      board_name: boardName,
      group_name: groupName,
      connector: "google_sheets",
    };
    if (url && (boardName || groupName) && sessionToken) {
      setLoading(true);
      const queryData: CustomAPIRequest = {
        method: "get",
        url: url,
      };
      const requestBody: Body_run_run = {
        query: queryData,
        schedule: scheduleInput,
      };
      RunService.runRun(sessionToken, requestBody, boardName)
        .then((run: RunResponse) => {
          setBoardId(run.run.board_id);
          monday.execute("valueCreatedForUser");
          setLoading(false);
          setSuccess(true);
          setIsRunning(false);
          if (isScheduled) {
            scheduleInput.data = run.data;
            const scheduleRequestBody: Body_run_schedule = {
              query: queryData,
              schedule_input: scheduleInput,
            };
            RunService.runSchedule(sessionToken, scheduleRequestBody).catch(
              (err) => {
                console.log(err);
                setLoading(false);
                setShowScheduleModal(true);
                setIsRunning(false);
              }
            );
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setShowErrorModal(true);
          setIsRunning(false);
        });
    } else {
      setShowModal(true);
      setLoading(false);
      setSuccess(false);
      setIsRunning(false);
    }
  };

  return (
    <>
      <div className="mt-2">
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">* Google Sheets URL</p>
            <Tooltip
              content="The url of the Google Sheet you want to import data from. Make sure public access is enabled for the sheet."
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="mb-2">
            <TextField
              value={url}
              placeholder="Url"
              size={TextField.sizes.MEDIUM}
              onChange={(e: string) => setUrl(e)}
            />
          </div>
        </div>
        <BoardBlock
          sessionToken={sessionToken}
          workspaceId={workspaceId}
          user={user}
          boardId={boardId}
          setBoardId={setBoardId}
          boards={boards}
          setBoards={setBoards}
          connector="google_sheets"
          selectedBoardOption={selectedBoardOption}
          setSelectedBoardOption={setSelectedBoardOption}
          selectedColumnOption={selectedColumnOption}
          setSelectedColumnOption={setSelectedColumnOption}
          boardName={boardName}
          setBoardName={setBoardName}
          groupName={groupName}
          setGroupName={setGroupName}
          selectedGroupOption={selectedGroupOption}
          setSelectedGroupOption={setSelectedGroupOption}
        />
      </div>
      <FieldsRequiredModal showModal={showModal} setShowModal={setShowModal} />
      <BaseModal
        title="Error: Invalid Request"
        text={
          "Could not fetch any data from this API. Please check your configuration and try again."
        }
        showModal={showErrorModal}
        setShowModal={setShowErrorModal}
      />
      <BaseModal
        title={"Error: invalid name"}
        text={"This board name already exists. Please choose a new name"}
        showModal={showNameModal}
        setShowModal={setShowNameModal}
      />
      <BaseModal
        title={"Error: schedule error"}
        text={"Was unable to schedule your import. Please try again."}
        showModal={showScheduleModal}
        setShowModal={setShowScheduleModal}
      />
    </>
  );
};
