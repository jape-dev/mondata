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
  Button,
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
  ColumnData,
} from "../api";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";
import { BaseModal } from "./Modals/BaseModal";
import { Option } from "../Utils/models";
import { BoardBlock } from "./FormBlocks/BoardBlock";
import { getImageUrl } from "../Utils/image";
import { ColumnTypeModal } from "./Modals/ColumnTypeModal";

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
  const [showColumnTypesModal, setShowColumnTypesModal] = useState(false);
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
  const [sheetHeaders, setSheetHeaders] = useState<ColumnData[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<Option>();
  const [errorMessage, setErrorMessage] = useState<string>(
    "There was an error trying to fetch your data. The developer (james@dataimporter.co) has been notified to investigate and will be in touch shortly."
  );

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
          const sheetOptions = sheets.map((sheet) => ({
            label: sheet.label,
            value: sheet.value,
          }));
          setSheetNames(sheetOptions);
        })
        .catch((error) => {
          console.error("Error fetching Google Sheets:", error);
        });
    }
  }, [url]);

  const handleSheetNameSelect = (option: Option) => {
    setSelectedSheet(option);
    if (url && sessionToken) {
      GoogleService.googleGetSheetHeaders(sessionToken, url, option.label)
        .then((headers: string[]) => {
          const columnHeaders: ColumnData[] = headers.map((header) => ({
            column_name: header,
            items: [],
          }));
          setSheetHeaders(columnHeaders);
        })
        .catch((error) => {
          console.error("Error fetching Google Sheets headers:", error.body);
        });
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
        columns: sheetHeaders,
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
            scheduleInput.board_id = run.run.board_id;
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
        .catch((error: any) => {
          console.log(error.body.detail);
          let errorMessage =
            "There was an error trying to fetch your data. Please check your configuration and try again.";
          if (error.body && error.body.detail) {
            try {
              const errorDetail = error.body.detail;
              if (errorDetail.error && errorDetail.error.message) {
                errorMessage = errorDetail.error.message;
              }
            } catch (parseError) {
              console.error("Error parsing error detail:", parseError);
            }
            setErrorMessage(errorMessage);
            setShowErrorModal(true);
          } else {
            console.log("Unexpected error structure:", error);
            setShowErrorModal(true);
          }
          setLoading(false);
          setIsRunning(false);
        });
    } else {
      setShowModal(true);
      setLoading(false);
      setSuccess(false);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    console.log(sheetHeaders);
  }, [sheetHeaders]);

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
          <div className="flex items-center gap-1">
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
            onChange={(option: Option) => handleSheetNameSelect(option)}
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
            className="mt-1 mb-2"
          />
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              Update column types
            </p>
            <Tooltip
              content="Map the column types from your Google Sheet to the corresponding column types in your Monday board."
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <Button
            disabled={sheetHeaders === undefined || sheetHeaders.length === 0}
            onClick={() => setShowColumnTypesModal(true)}
            size={Button.sizes.SMALL}
            kind={Button.kinds.SECONDARY}
            className="mt-1"
          >
            Column Types
          </Button>
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
        title={"Error: could not fetch data"}
        text={`${errorMessage}\n\n. If you need more support with this, please email james@dataimporter.co and add the above message to the email body.`}
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
      <ColumnTypeModal
        isOpen={showColumnTypesModal}
        onClose={() => setShowColumnTypesModal(false)}
        columns={sheetHeaders}
        setColumns={setSheetHeaders}
      />
    </>
  );
};
