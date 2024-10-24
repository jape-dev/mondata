import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Tooltip, Icon, TextField } from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  LinkedinService,
  UserPublic,
  MondayService,
  QueryData,
  MondayItem,
  RunService,
  Body_run_run,
  Body_run_schedule,
  ScheduleInput,
  RunResponse,
} from "../api";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";
import { BaseModal } from "./Modals/BaseModal";
import { Option } from "../Utils/models";
import { BoardBlock } from "./FormBlocks/BoardBlock";

const monday = mondaySdk();

export interface LinkedInFormProps {
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

export const LinkedInForm: React.FC<LinkedInFormProps> = ({
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
  const [pageOptions, setPageOptions] = useState<Option[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Option>();
  const [fields, setFields] = useState<Option[]>([]);
  const [selectedFields, setSelectedFields] = useState<Option[]>([]);
  const [selectedBoardOption, setSelectedBoardOption] = useState<Option>({
    label: "Import into a new board",
    value: 999,
  });
  const [boards, setBoards] = useState<Option[]>([]);
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [selectedGroupOption, setSelectedGroupOption] = useState<
    Option | undefined
  >({
    label: "Import into a new group",
    value: 999,
  });
  const [showModal, setShowModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [boardName, setBoardName] = useState<string>();
  const [groupName, setGroupName] = useState<string>();
  const [showErrordModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    "Could not fetch data from LinkedIn. Please check your configuration and try again."
  );
  const [date, setDate] = useState<Option>({ value: 730, label: "All time" });
  const [selectedGrouping, setSelectedGrouping] = useState<Option>();

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
      { value: "ACCOUNT", label: "Account" },
      { value: "CAMPAIGN", label: "Campaign" },
      { value: "CREATIVE", label: "Ad" },
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

    const scheduleInput: ScheduleInput = {
      user_id: user.monday_user_id,
      board_id: boardId,
      account_id: user.monday_account_id,
      workspace_id: workspaceId,
      board_name: boardName,
      group_name: groupName,
      connector: "linkedin_ads",
      period: period.value,
      step: step.value,
      days: days,
      start_datetime: startTime,
      tz_offset: timezone.value,
    };
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - date.value);
    if (
      sessionToken &&
      selectedBoardOption &&
      selectedColumnOption &&
      selectedAccount
    ) {
      MondayService.mondayItems(
        selectedBoardOption?.value,
        selectedColumnOption?.value,
        sessionToken,
        selectedGroupOption?.value
      )
        .then((items: MondayItem[]) => {
          const queryData: QueryData = {
            monday_items: items,
            dimensions: [selectedGrouping?.value],
            account_id: selectedAccount?.value,
            metrics: selectedFields.map((field) => field.value),
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          };
          const requestBody: Body_run_run = {
            query: queryData,
            schedule: scheduleInput,
          };
          RunService.runRun(sessionToken, requestBody)
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
            .catch((error) => {
              let errorMessage =
                "Could not fetch data from LinkedIn. Please check your configuration and try again.";
              if (error.body && error.body.detail) {
                const errorBody = error.body.detail;
                if (errorBody.message) {
                  errorMessage = errorBody.message;
                } else {
                  console.log(
                    "Could not parse error_user_msg Error body",
                    errorBody
                  );
                }
              }
              setErrorMessage(errorMessage);
              setLoading(false);
              setShowErrorModal(true);
              setIsRunning(false);
            });
        })
        .catch((err) => {
          setLoading(false);
          setShowErrorModal(true);
        });
    } else if (
      sessionToken &&
      selectedBoardOption &&
      selectedAccount &&
      (boardName || groupName)
    ) {
      const queryData: QueryData = {
        account_id: selectedAccount?.value,
        dimensions: [selectedGrouping?.value],
        metrics: selectedFields.map((field) => field.value),
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
      };
      const requestBody: Body_run_run = {
        query: queryData,
        schedule: scheduleInput,
      };

      RunService.runRun(sessionToken, requestBody, boardName)
        .then((run: RunResponse) => {
          if (boardName) {
            setSelectedBoardOption({
              value: run.run.board_id,
              label: boardName,
            });
          }
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
        .catch((error) => {
          let errorMessage =
            "Could not fetch data from LinkedIn. Please check your configuration and try again.";
          if (error.body && error.body.detail) {
            const errorBody = error.body.detail;
            console.log(errorBody);
            if (errorBody.message) {
              errorMessage = errorBody.message;
            } else {
              console.log(
                "Could not parse error_user_msg Error body",
                errorBody
              );
            }
          }
          setErrorMessage(errorMessage);
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

  const handleFieldSelect = (selectedField: Option) => {
    setSelectedFields((prevSelectedFields: Option[]) => {
      // Check if the option is already selected
      if (prevSelectedFields.some((field: Option) => field === selectedField)) {
        // If it is, remove it from the selection
        return prevSelectedFields.filter(
          (field: Option) => field !== selectedField
        );
      } else {
        // If it is not, add it to the selection if we have less than 19 fields
        if (prevSelectedFields.length < 19) {
          return [...prevSelectedFields, selectedField];
        } else {
          // If we already have 19 fields, don't add the new one
          return prevSelectedFields;
        }
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

  useEffect(() => {
    if (sessionToken) {
      try {
        LinkedinService.linkedinAccounts(sessionToken).then((pages) => {
          const accountOptions: Option[] = pages.map((page) => ({
            label: page.label,
            value: page.value,
          }));
          setPageOptions(accountOptions);
        });
      } catch (err) {
        console.log(err);
      }
      LinkedinService.linkedinFields().then((fields) => {
        const fieldOptions: Option[] = fields.map((field) => ({
          label: field.label,
          value: field.value,
        }));
        setFields(fieldOptions);
      });
    }
  }, [user]);

  const dateOptions = useMemo(
    () => [
      { value: 1, label: "Last 1 Days" },
      { value: 7, label: "Last 7 Days" },
      { value: 30, label: "Last 30 Days" },
      { value: 90, label: "Last 90 Days" },
      { value: 365, label: "Last 12 Months" },
      { value: 730, label: "All time" },
    ],
    []
  );

  return (
    <div className="mt-2">
      <div className="border-2 border-grey rounded-md p-5 mb-2">
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Account</p>
          <Tooltip
            content="The Instagram page to fetch data from."
            position={Tooltip.positions.TOP}
          >
            <Icon icon={Info} className="text-gray-500" />
          </Tooltip>
        </div>
        <Dropdown
          placeholder="Select a page"
          className="mb-2"
          options={pageOptions}
          isLoading={pageOptions.length === 0}
          loadingMessage={(inputValue: string) =>
            `Loading ad accounts. Please wait up to 10 seconds...`
          }
          onOptionSelect={(e: Option) => setSelectedAccount(e)}
        />
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Metrics</p>
          <Tooltip
            content="Fields to import. Each field will create a new column in your board."
            position={Tooltip.positions.TOP}
          >
            <Icon icon={Info} className="text-gray-500" />
          </Tooltip>
        </div>
        <p className="text-xs text-gray-400 mb-1">Max 19 metrics per import.</p>
        <Dropdown
          placeholder="Select fields"
          multi
          multiline
          options={fields}
          isLoading={fields.length === 0}
          onOptionSelect={(e: Option) => handleFieldSelect(e)}
          onOptionRemove={(e: Option) => handleFieldDeselect(e)}
          className="mb-2"
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
        connector="linkedin_ads"
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
        title={"Error: could not fetch data"}
        text={`${errorMessage}\n\nIf you need more support with this, please email james@dataimporter.co and include the above message in your email.`}
        showModal={showErrordModal}
        setShowModal={setShowErrorModal}
      />
      <BaseModal
        title={"Error: schedule error"}
        text={"Was unable to schedule your import. Please try again."}
        showModal={showScheduleModal}
        setShowModal={setShowScheduleModal}
      />
    </div>
  );
};
