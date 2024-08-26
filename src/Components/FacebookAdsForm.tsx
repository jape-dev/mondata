import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Button, Icon, TextField } from "monday-ui-react-core";
import { Tooltip } from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  FacebookService,
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

const monday = mondaySdk();

interface Board {
  id: string;
  name: string;
}

interface BoardColumn {
  id: string;
  title: string;
  type: string;
}

export interface FacebookAdFormProps {
  user: UserPublic;
  workspaceId: number;
  sessionToken?: string;
  isScheduled: boolean;
  isRunning: boolean;
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

export const FacebookAdsForm: React.FC<FacebookAdFormProps> = ({
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
  const [accountOptions, setAccountOptions] = useState<Option[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Option>();
  const [fields, setFields] = useState<Option[]>([]);
  const [selectedFields, setSelectedFields] = useState<Option[]>([]);
  const [boards, setBoards] = useState<Option[]>([]);
  const [selectedBoardOption, setSelectedBoardOption] = useState<Option>({
    label: "Import into a new board",
    value: 999,
  });
  const [boardColumns, setBoardColumns] = useState<Option[]>([]);
  const [selectedGrouping, setSelectedGrouping] = useState<Option>();
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [date, setDate] = useState<Option>({ value: 730, label: "All time" });
  const [showModal, setShowModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [boardName, setBoardName] = useState();
  const [showErrordModal, setShowErrorModal] = useState(false);

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

  const groupingOptions = useMemo(() => {
    return [
      { value: "campaign", label: "Campaign" },
      { value: "adset", label: "Adset" },
      { value: "ad", label: "Ad" },
    ];
  }, []);

  const getImageUrl = (imgPath: string) => {
    return require(`../Static/images/${imgPath}.png`);
  };

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
      connector: "facebook",
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
      selectedAccount &&
      date &&
      boardName
    ) {
      if (selectedColumnOption) {
        MondayService.mondayItems(
          selectedBoardOption?.value,
          selectedColumnOption?.value,
          sessionToken
        )
          .then((items: MondayItem[]) => {
            const queryData: QueryData = {
              monday_items: items,
              account_id: selectedAccount?.value,
              dimensions: selectedGrouping?.value,
              metrics: selectedFields.map((field) => field.value),
              start_date: startDate.toISOString().split("T")[0],
              end_date: endDate.toISOString().split("T")[0],
            };
            if (isScheduled) {
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
              })
              .catch((err) => {
                setLoading(false);
                setShowErrorModal(true);
                setIsRunning(false);
              });
          })
          .catch((err) => {
            setLoading(false);
            setShowErrorModal(true);
          });
      } else {
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
        if (isScheduled) {
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
        RunService.runRun(sessionToken, requestBody, boardName)
          .then((run: RunResponse) => {
            setBoardId(run.run.board_id);
            monday.execute("valueCreatedForUser");
            setLoading(false);
            setSuccess(true);
            setIsRunning(false);
          })
          .catch((err) => {
            setLoading(false);
            setShowErrorModal(true);
            setIsRunning(false);
          });
      }
    } else {
      setShowModal(true);
      setLoading(false);
      setSuccess(false);
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

  const handleBoardSelect = (selectedBoard: Option) => {
    setSelectedColumnOption(undefined);
    setSelectedGrouping(undefined);
    setSelectedBoardOption(selectedBoard);
    setBoardId(selectedBoard.value);
    setBoardName(undefined);
  };

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

  useEffect(() => {
    if (sessionToken) {
      try {
        FacebookService.facebookAdAccounts(sessionToken).then((accounts) => {
          const accountOptions: Option[] = accounts.map((account) => ({
            label: `${account.label} (${account.value})`,
            value: account.value,
          }));
          setAccountOptions(accountOptions);
        });
      } catch (error) {
        console.error(error);
      }
      FacebookService.facebookFields().then((fields) => {
        const fieldOptions: Option[] = fields.map((field) => ({
          label: field.label,
          value: field.value,
        }));
        setFields(fieldOptions);
      });
    }
  }, []);

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
  }, [user]);

  useEffect(() => {
    if (
      selectedBoardOption &&
      selectedBoardOption?.value !== 999 &&
      sessionToken
    ) {
      MondayService.mondayBoardColumns(selectedBoardOption.value, sessionToken)
        .then((columns: BoardColumn[]) => {
          const columnOptions: Option[] = columns.map(
            (column: BoardColumn) => ({
              value: column.id,
              label: column.title,
            })
          );
          setBoardColumns(columnOptions);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedBoardOption]);

  return (
    <div className="mt-2">
      <div className="border-2 border-grey rounded-md p-5 mb-2">
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Metrics</p>
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
          isLoading={fields.length === 0}
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
      <div className="border-2 border-gray rounded-md p-5">
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Board</p>
          <Tooltip
            content="The board to import metrics into. "
            position={Tooltip.positions.TOP}
          >
            <Icon icon={Info} className="text-gray-500" />
          </Tooltip>
        </div>
        <Dropdown
          value={selectedBoardOption}
          options={boards}
          placeholder="Select a board"
          className="mb-2"
          isLoading={boards.length === 0}
          onOptionSelect={(e: Option) => handleBoardSelect(e)}
        />
        {selectedBoardOption?.value === 999 ? (
          <>
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">* Account</p>
              <Tooltip
                content="The ad account to fetch data from."
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              placeholder="Select an account"
              className="mb-2"
              options={accountOptions}
              isLoading={accountOptions.length === 0}
              onOptionSelect={(e: Option) => setSelectedAccount(e)}
            />
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">* Split by</p>
              <Tooltip
                content="Choose whether metrics should be split by Facebook Ad Id, Adset Id or Campaign Id"
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              options={groupingOptions}
              value={selectedGrouping}
              onOptionSelect={(e: Option) => setSelectedGrouping(e)}
              placeholder="Select column"
              className="mb-2"
              menuPlacement={"top"}
            />
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
              onChange={(e: any) => setBoardName(e)}
              size={TextField.sizes.MEDIUM}
              placeholder="Enter name"
              className="mb-2 !text-sm"
            />
          </>
        ) : selectedBoardOption && selectedBoardOption?.value !== 999 ? (
          <>
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">* Account</p>
              <Tooltip
                content="The ad account to fetch data from."
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              placeholder="Select an account"
              className="mb-2"
              options={accountOptions}
              isLoading={accountOptions.length === 0}
              onOptionSelect={(e: Option) => setSelectedAccount(e)}
            />
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">
                * Split by Column
              </p>
              <Tooltip
                title="The column containing the Facebook Ad Id, Adset Id or Campaign Id to split metrics by."
                content="(Example above). Each row containing an id will have imported metrics for it. If you want to use post urls instead, select the Facebook Posts connector."
                position={Tooltip.positions.TOP}
                image={getImageUrl("ad-ids")}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              options={boardColumns}
              value={selectedColumnOption}
              onOptionSelect={(e: Option) => setSelectedColumnOption(e)}
              placeholder="Select column"
              className="mb-2"
              menuPlacement={"top"}
            />
          </>
        ) : null}
      </div>
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
    </div>
  );
};
