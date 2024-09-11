import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Tooltip, Icon, TextField } from "monday-ui-react-core";
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
import { BoardBlock } from "./FormBlocks/BoardBlock";

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

export interface FacebookPagesFormProps {
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

export const FacebookPagesForm: React.FC<FacebookPagesFormProps> = ({
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
  const [boards, setBoards] = useState<Option[]>([]);
  const [selectedBoardOption, setSelectedBoardOption] = useState<Option>({
    label: "Import into a new board",
    value: 999,
  });
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [boardName, setBoardName] = useState<string | undefined>();
  const [showErrordModal, setShowErrorModal] = useState(false);
  const [selectedGroupOption, setSelectedGroupOption] = useState<Option | undefined>({
    label: "Import into a new group",
    value: 999,
  });
  const [groupName, setGroupName] = useState<string>();

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
      connector: "facebook_pages",
      period: period.value,
      step: step.value,
      days: days,
      start_datetime: startTime,
      tz_offset: timezone.value,
    };
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
        selectedGroupOption?.value,
      )
        .then((items: MondayItem[]) => {
          const queryData: QueryData = {
            monday_items: items,
            account_id: selectedAccount?.value,
            metrics: selectedFields.map((field) => field.value),
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
              setLoading(false);
              setShowErrorModal(true);
              setIsRunning(false);
            });
        })
        .catch((error) => {
          setShowErrorModal(true);
          setLoading(false);
        });
    } else if (sessionToken && selectedBoardOption &&  (boardName || groupName)) {
      const queryData: QueryData = {
        account_id: selectedAccount?.value,
        metrics: selectedFields.map((field) => field.value),
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
          setLoading(false);
          setShowErrorModal(true);
          setIsRunning(false);
        });
    } else {
      setShowFieldsModal(true);
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

  useEffect(() => {
    if (sessionToken) {
      try {
        FacebookService.facebookPages(sessionToken).then((pages) => {
          const accountOptions: Option[] = pages.map((page) => ({
            label: page.label,
            value: page.value,
            access_token: page.access_token,
          }));
          setPageOptions(accountOptions);
        });
      } catch (error) {
        console.error(error);
      }
      FacebookService.facebookPagesFields().then((fields) => {
        const fieldOptions: Option[] = fields.map((field) => ({
          label: field.label,
          value: field.value,
        }));
        setFields(fieldOptions);
      });
    }
  }, [user]);

  return (
    <div className="mt-2">
      <div className="border-2 border-grey rounded-md p-5 mb-2">
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Page</p>
          <Tooltip
            content="The Facebook page to fetch data from."
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
        <Dropdown
          placeholder="Select fields"
          multi
          multiline
          options={fields}
          isLoading={fields.length === 0}
          onOptionSelect={(e: Option) => handleFieldSelect(e)}
          onOptionRemove={(e: Option) => handleFieldDeselect(e)}
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
        connector="facebook_pages"
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
        columnTitle="Post Url Column"
        columnModalTitle="The column containing the url of post"
        columnModalDescription="(Example above). Each row containing a url will have imported metrics for it. If you want to use ad ids instead, select the Facebook Ads application."
        columnModalImage="post-urls"
      />
      <FieldsRequiredModal
        showModal={showFieldsModal}
        setShowModal={setShowFieldsModal}
      />
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
