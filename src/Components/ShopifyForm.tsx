import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Tooltip, Icon } from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  ShopifyService,
  QueryData,
  RunService,
  UserPublic,
  ScheduleInput,
  Body_run_schedule,
  Body_run_run,
  RunResponse,
} from "../api";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";
import { BaseModal } from "./Modals/BaseModal";
import { Option } from "../Utils/models";
import { BoardBlock } from "./FormBlocks/BoardBlock";

const monday = mondaySdk();

interface BoardColumn {
  id: string;
  title: string;
  type: string;
}

export interface ShopifyFormProps {
  user: UserPublic;
  workspaceId: number;
  sessionToken?: string;
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

export const ShopifyForm: React.FC<ShopifyFormProps> = ({
  user,
  workspaceId,
  sessionToken,
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
  const [selectedResource, setSelectedResource] = useState<Option>();
  const [fields, setFields] = useState<Option[]>([]);
  const [selectedFields, setSelectedFields] = useState<Option[]>([]);
  const [boards, setBoards] = useState<Option[]>([]);
  const [selectedBoardOption, setSelectedBoardOption] = useState<Option>({
    label: "Import into a new board",
    value: 999,
  });
  const [selectedGroupOption, setSelectedGroupOption] = useState<
    Option | undefined
  >({
    label: "Import into a new group",
    value: 999,
  });
  const [selectedGrouping, setSelectedGrouping] = useState<Option>();
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [date, setDate] = useState<Option>({
    value: 60,
    label: "Last 60 days",
  });
  const [showModal, setShowModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [boardName, setBoardName] = useState<string>();
  const [groupName, setGroupName] = useState<string>();
  const [showErrordModal, setShowErrorModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNoValuesModal, setShowNoValuesModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

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

  const groupingOptions = useMemo(() => {
    return [
      { value: "order", label: "Order" },
      { value: "item", label: "Item" },
    ];
  }, []);

  useEffect(() => {
    if (isRunning === true) {
      handleRunClick();
    }
  }, [isRunning]);

  const handleRunClick = async () => {
    setLoading(true);
    const isValidName = checkBoardName();
    if (!isValidName) {
      setIsRunning(false);
      setLoading(false);
      return;
    }
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - date.value);

    const scheduleInput: ScheduleInput = {
      user_id: user.monday_user_id,
      board_id: boardId,
      account_id: user.monday_account_id,
      workspace_id: workspaceId,
      board_name: boardName,
      group_name: groupName,
      connector: "shopify",
      period: period.value,
      step: step.value,
      days: days,
      start_datetime: startTime,
      tz_offset: timezone.value,
    };
    if (
      sessionToken &&
      selectedFields.length > 0 &&
      selectedBoardOption &&
      date &&
      selectedGrouping &&
      (boardName || groupName)
    ) {
      const queryData: QueryData = {
        metrics: selectedFields.map((field) => field.value),
        dimensions: [selectedGrouping.value],
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        manager_id: user.shopify_store_url,
      };
      const requestBody: Body_run_run = {
        query: queryData,
        schedule: scheduleInput,
      };
      RunService.runRun(sessionToken, requestBody, boardName)
        .then((run: RunResponse) => {
          setSelectedBoardOption({
            value: run.run.board_id,
            label: boardName ?? `New Board ${run.run.board_id}`,
          });
          setBoardId(run.run.board_id);
          monday.execute("valueCreatedForUser");
          setLoading(false);
          setSuccess(true);
          setIsRunning(false);
          if (isScheduled) {
            scheduleInput.data = run.data;
            scheduleInput.board_id = run.run.board_id;
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
          if (error.body && error.body.detail) {
            const errorDetail = error.body.detail;
            console.log("Error detail:", errorDetail);
            if (errorDetail.includes("NO_SHOPIFY_VALUES")) {
              setShowNoValuesModal(true);
            } else {
              // Handle cases where there's no expected error structure
              console.log("Unexpected error structure:", error);
              setShowErrorModal(true);
            }
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

  const handleFieldSelect = (selectedField: Option) => {
    setSelectedFields((prevSelectedFields: Option[]) => {
      // Check if the option is already selected
      if (prevSelectedFields.some((field: Option) => field === selectedField)) {
        // If it is, remove it from the selection
        return prevSelectedFields.filter(
          (field: Option) => field !== selectedField
        );
      } else {
        // If it is not, add it to the selection
        return [...prevSelectedFields, selectedField];
      }
    });
  };

  const handleFieldDeselect = (deselectedField: Option) => {
    setSelectedFields((prevSelectedFields: Option[]) => {
      // Check if the option is already selected
      if (
        prevSelectedFields.some((field: Option) => field === deselectedField)
      ) {
        // If it is, remove it from the selection
        return prevSelectedFields.filter(
          (field: Option) => field !== deselectedField
        );
      } else {
        // If it is not, return the current selection as is
        return prevSelectedFields;
      }
    });
  };

  const dateOptions = useMemo(
    () => [
      { value: 1, label: "Last 1 Days" },
      { value: 7, label: "Last 7 Days" },
      { value: 30, label: "Last 30 Days" },
      { value: 90, label: "Last 60 days Days" },
    ],
    []
  );

  useEffect(() => {
    ShopifyService.shopifyFields()
      .then((fields) => {
        const fieldOptions: Option[] = fields.map((field) => ({
          label: field.label,
          value: field.value,
        }));
        setFields(fieldOptions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedResource]);

  return (
    <div className="mt-2">
      <div className="border-2 border-grey rounded-md p-5 mb-2">
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Fields</p>
          <Tooltip
            content="Fields to import. Each field will create a new column in your board."
            position={Tooltip.positions.TOP}
          >
            <Icon icon={Info} className="text-gray-500" />
          </Tooltip>
        </div>
        <Dropdown
          placeholder="Select fields"
          className="mb-2"
          multi
          multiline
          options={fields}
          isLoading={fields === undefined || fields.length === 0}
          onOptionSelect={(e: Option) => handleFieldSelect(e)}
          onOptionRemove={(e: Option) => handleFieldDeselect(e)}
        />
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Date range</p>
          <Tooltip
            content="Date range to calculate metrics over."
            position={Tooltip.positions.TOP}
          >
            <Icon icon={Info} className="text-gray-500" />
          </Tooltip>
        </div>
        <Dropdown
          placeholder="Select a date range"
          options={dateOptions}
          className="mb-2"
          onOptionSelect={(e: Option) => setDate(e)}
          menuPlacement={"top"}
          value={date}
        />
      </div>
      <BoardBlock
        sessionToken={sessionToken}
        workspaceId={workspaceId}
        user={user}
        boards={boards}
        setBoards={setBoards}
        boardId={boardId}
        setBoardId={setBoardId}
        connector="shopify"
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
        splitByGroupingOptions={groupingOptions}
        splitByGrouping={selectedGrouping}
        setSplitByGrouping={setSelectedGrouping}
      />
      <FieldsRequiredModal showModal={showModal} setShowModal={setShowModal} />
      <BaseModal
        title={"Error: invalid name"}
        text={"This board name already exists. Please choose a new name"}
        showModal={showNameModal}
        setShowModal={setShowNameModal}
      />
      <BaseModal
        title={"Error: could not fetch data. "}
        text={
          "There was an error trying to fetch your data. Please check your configuation and try again."
        }
        showModal={showErrordModal}
        setShowModal={setShowErrorModal}
      />
      <BaseModal
        title={"Error: schedule error"}
        text={"Was unable to schedule your import. Please try again."}
        showModal={showScheduleModal}
        setShowModal={setShowScheduleModal}
      />
      <BaseModal
        title={"Error: No Data Found"}
        text={
          "No data found for this Shopify shop in the date range you selected. Please check your configuration and try again. If you think this is an error, please contact support at james@dataimporter.co"
        }
        showModal={showNoValuesModal}
        setShowModal={setShowNoValuesModal}
      />
      <BaseModal
        title={"Shopify Error: Access Token Expired "}
        text={
          "Your Shopify access token has expired. Please press 'Connect to a different account to reauthenticate your access token."
        }
        showModal={showExpiredModal}
        setShowModal={setShowExpiredModal}
      />
    </div>
  );
};
