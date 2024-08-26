import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Dropdown,
  Icon,
  Tooltip,
  TextField,
  TextArea,
} from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  CustomAPIRequest,
  MondayService,
  PairValue,
  RunService,
  UserPublic,
  ScheduleInput,
  Body_run_run,
  Body_run_schedule,
  RunResponse,
} from "../api";
import { PairValueComponent } from "./PairValue";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";
import { BaseModal } from "./Modals/BaseModal";
import { Option } from "../Utils/models";

const monday = mondaySdk();

interface Board {
  id: string;
  name: string;
}

export interface CustomApiFormProps {
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

export const CustomApiForm: React.FC<CustomApiFormProps> = ({
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
  const [method, setMethod] = useState<Option>({ value: "get", label: "GET" });
  const [url, setUrl] = useState<string>();
  const [authMethod, setAuthMethod] = useState<Option>({
    value: "none",
    label: "None",
  });
  const [authValue, setAuthValue] = useState<string>();
  const [body, setBody] = useState<string>();
  const [paramaters, setParameters] = useState<PairValue[]>([]);
  const [headers, setHeaders] = useState<PairValue[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [boardName, setBoardName] = useState();
  const [boards, setBoards] = useState<Option[]>([]);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("customApiFormData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setMethod(parsedData.method || { value: "get", label: "GET" });
      setUrl(parsedData.url || "");
      setAuthMethod(parsedData.authMethod || { value: "none", label: "None" });
      setAuthValue(parsedData.authValue || "");
      setBody(parsedData.body || "");
      setParameters(parsedData.paramaters || []);
      setHeaders(parsedData.headers || []);
      setBoardId(parsedData.boardId || 999);
      setBoardName(parsedData.boardName || "");
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage
    const dataToStore = {
      method,
      url,
      authMethod,
      authValue,
      body,
      paramaters,
      headers,
      boardId,
      boardName,
    };
    localStorage.setItem("customApiFormData", JSON.stringify(dataToStore));
  }, [
    method,
    url,
    authMethod,
    authValue,
    body,
    paramaters,
    headers,
    boardId,
    boardName,
  ]);

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

  const methodOptions = useMemo(() => {
    return [
      { value: "get", label: "GET" },
      { value: "post", label: "POST" },
    ];
  }, []);

  const authOptions = useMemo(() => {
    return [
      { value: "none", label: "None" },
      { value: "token", label: "Bearer Token" },
    ];
  }, []);

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
      connector: "custom_api",
      period: period.value,
      step: step.value,
      days: days,
      start_datetime: startTime,
      tz_offset: timezone.value,
    };
    if (url && boardName && sessionToken) {
      setLoading(true);
      const queryData: CustomAPIRequest = {
        method: method.value,
        url: url,
        auth: authValue,
        body: body,
        params: paramaters,
        headers: headers,
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
                setLoading(false);
                setShowScheduleModal(true);
                setIsRunning(false);
              }
            );
          }
        })
        .catch((err) => {
          setLoading(false);
          setShowErrorModal(true);
          setIsRunning(false);
        });
    } else {
      setShowModal(true);
      setLoading(false);
      setSuccess(false);
    }
  };

  useEffect(() => {
    if (sessionToken) {
      MondayService.mondayBoards(sessionToken).then((boards: Board[]) => {
        const boardOptions: Option[] = [
          {
            value: 999,
            label: "Import into a new board",
          },
        ];
        boards.forEach((board: Board) => {
          boardOptions.push({
            value: board.id,
            label: board.name,
          });
        });
        setBoards(boardOptions);
      });
    }
  }, []);

  return (
    <>
      <div className="mt-2">
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">* Method & Url.</p>
            <Tooltip
              content="Method for your API call and API url. Choose POST request if your API requires a body to
              be submitted."
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="col-span-1 w-full">
              <Dropdown
                placeholder="Select Method"
                value={method}
                options={methodOptions}
                onOptionSelect={(e: Option) => setMethod(e)}
              />
            </div>
            <div className="col-span-7 -full">
              <TextField
                value={url}
                placeholder="Url"
                size={TextField.sizes.MEDIUM}
                onChange={(e: string) => setUrl(e)}
              />
            </div>
          </div>
        </div>
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              Auhorization (optional){" "}
            </p>
            <Tooltip
              content="Auhtorization type"
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <Dropdown
            placeholder="Select Authorization type"
            className="mb-2"
            value={authMethod}
            options={authOptions}
            onOptionSelect={(e: Option) => setAuthMethod(e)}
          />
          {authMethod.value === "token" && (
            <TextField
              value={authValue}
              placeholder="Token"
              className="mb-2"
              size={TextField.sizes.MEDIUM}
              onChange={(e: string) => setAuthValue(e)}
            />
          )}
        </div>
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              Headers (optional)
            </p>
            <Tooltip content="API Headers" position={Tooltip.positions.TOP}>
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <PairValueComponent pairs={headers} setPairs={setHeaders} />
        </div>
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">
              Parameters (optional)
            </p>
            <Tooltip content="API Parameters" position={Tooltip.positions.TOP}>
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <PairValueComponent pairs={paramaters} setPairs={setParameters} />
        </div>
        {method.value === "post" && (
          <div className="border-2 border-grey rounded-md p-5 mb-2">
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">Body (optional)</p>
              <Tooltip
                content="JSON Body for your API call"
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <TextArea
              placeholder="Body"
              className="mb-2"
              onChange={(e: any) => setBody(e.target.value)}
            />
          </div>
        )}
        <div className="border-2 border-grey rounded-md p-5 mb-2">
          <div className="flex items-center gap-1">
            <p className="font-bold text-gray-500 text-sm">* Board Name</p>
            <Tooltip
              content="The name of your newly created board"
              position={Tooltip.positions.TOP}
            >
              <Icon icon={Info} className="text-gray-500" />
            </Tooltip>
          </div>
          <TextField
            value={boardName}
            onChange={(e: any) => setBoardName(e)}
            size={TextField.sizes.MEDIUM}
            placeholder="Enter name"
            className="mb-2 !text-sm"
          />
        </div>
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
