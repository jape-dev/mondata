import { useState, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Icon,
  Tooltip,
  TextField,
  Toggle,
  Dropdown,
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
  GoogleService,
} from "../api";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";
import { BaseModal } from "./Modals/BaseModal";
import { Option } from "../Utils/models";
import { BoardBlock } from "./FormBlocks/BoardBlock";
import { getImageUrl } from "../Utils/image";

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
  period: Option;
  step: Option;
  days: string[];
  startTime: string;
  timezone: Option;
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
  period,
  step,
  days,
  startTime,
  timezone,
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
  const [selectedGroupOption, setSelectedGroupOption] = useState<
    Option | undefined
  >({
    label: "Import into a new group",
    value: 999,
  });
  const [groupName, setGroupName] = useState<string>();
  const [firstColumnAsItemName, setFirstColumnAsItemName] =
    useState<boolean>(true);
  const [sheetNames, setSheetNames] = useState<Option[]>();
  const [selectedSheet, setSelectedSheet] = useState<Option>();

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

  useEffect(() => {
    if (url && sessionToken) {
      GoogleService.googleGetSheetsSheets(sessionToken, url)
        .then((sheets) => {
          console.log("sheets:", sheets);
          const sheetOptions = sheets.map((sheet) => ({
            label: sheet.label,
            value: sheet.value,
          }));
          console.log("sheetOptions:", sheetOptions);
          setSheetNames(sheetOptions);
        })
        .catch((error) => {
          console.error("Error fetching Google Sheets:", error);
        });
    }
  }, [url]);

  useEffect(() => {
    console.log("sheetNames:", sheetNames);
    if (selectedSheet) {
      console.log("Selected sheet:", selectedSheet);
    }
  }, [selectedSheet, sheetNames]);

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
      period: period.value,
      step: step.value,
      days: days,
      start_datetime: startTime,
      tz_offset: timezone.value,
    };
    if (url && (boardName || groupName) && sessionToken) {
      setLoading(true);
      const queryData: CustomAPIRequest = {
        method: "get",
        url: url,
        body: JSON.stringify({
          sheet_name: selectedSheet?.label,
          first_column: firstColumnAsItemName,
        }),
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
            <p className="font-bold text-gray-500 text-sm">
              * Google Sheets URL
            </p>
            <Tooltip
              content="Make sure the first row of the sheet contains the column headers."
              position={Tooltip.positions.TOP}
              title={"Google Sheet Url"}
              image={getImageUrl("google-sheets-import")}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="mb-3">
            <Tooltip
              content="Make sure the first row of the sheet contains the column headers."
              position={Tooltip.positions.BOTTOM}
              title={"Google Sheet Url"}
              image={getImageUrl("google-sheets-import")}
              immediateShowDelay={0}
            >
              <TextField
                value={url}
                placeholder="Url"
                size={TextField.sizes.MEDIUM}
                onChange={(e: string) => setUrl(e)}
              />
            </Tooltip>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <p className="font-bold text-gray-500 text-sm">* Sheet Name</p>
            <Tooltip
              content="Select the sheet you want to import from your Google Sheets document."
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <Dropdown
            isLoading={sheetNames === undefined || sheetNames.length === 0}
            loadingMessage={(inputValue: string) =>
              `Loading sheets. Please wait up to 10 seconds...`
            }
            placeholder="Select a sheet"
            value={selectedSheet}
            options={sheetNames}
            onChange={(option: Option) => setSelectedSheet(option)}
            className="mb-2"
          />
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              * First Column as Item Name
            </p>
            <Tooltip
              content="If selected, first column of the sheet will be used as the item name in your monday board/group."
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <Toggle
            isSelected={firstColumnAsItemName}
            onChange={() => setFirstColumnAsItemName(!firstColumnAsItemName)}
            className="mt-1"
          />
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
