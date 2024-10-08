import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Tooltip, Icon, TextField } from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  GoogleAdsService,
  MondayService,
  QueryData,
  MondayItem,
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

export interface GoogleAdsFormProps {
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

export const GoogleAdsForm: React.FC<GoogleAdsFormProps> = ({
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
  const [showFieldsRequiredModal, setShowFieldsRequiredModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [boardName, setBoardName] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>(
    "Could not fetch data from Google Ads API. Please check your configuration and try again."
  );
  const [showErrordModal, setShowErrorModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [show2StepModal, setShow2StepModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [groupName, setGroupName] = useState<string>();
  const [selectedGroupOption, setSelectedGroupOption] = useState<
    Option | undefined
  >({
    label: "Import into a new group",
    value: 999,
  });

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
      { value: "campaign.name", label: "Campaign" },
      { value: "ad_group.name", label: "Ad Group" },
      { value: "ad_group_ad.ad.id", label: "Ad" },
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
      connector: "google_ads",
      period: period.value,
      step: step.value,
      days: days,
      start_datetime: startTime,
      tz_offset: timezone.value,
    };
    if (
      sessionToken &&
      selectedBoardOption &&
      selectedGrouping &&
      selectedAccount &&
      date &&
      selectedColumnOption
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
            account_id: selectedAccount?.value,
            dimensions: selectedGrouping?.value,
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
            .catch((error) => {
              if (error.body && error.body.detail) {
                let errorMessage =
                  "Could not fetch data from Google Ads API. Please check your configuration and try again.";
                try {
                  const errorDetail = error.body.detail;
                  if (Array.isArray(errorDetail) && errorDetail.length > 0) {
                    const firstError = errorDetail[0];
                    if (
                      firstError.error &&
                      firstError.error.details &&
                      firstError.error.details.length > 0
                    ) {
                      const googleAdsFailure = firstError.error.details[0];
                      if (
                        googleAdsFailure.errors &&
                        googleAdsFailure.errors.length > 0
                      ) {
                        errorMessage = googleAdsFailure.errors[0].message;
                      }
                    }
                  }
                } catch (parseError) {
                  console.error("Error parsing error detail:", parseError);
                }
                setErrorMessage(errorMessage);
                setShowErrorModal(true);
              } else {
                // Handle cases where there's no expected error structure
                console.log("Unexpected error structure:", error);
                setShowErrorModal(true);
              }
              setLoading(false);
              setIsRunning(false);
            });
        })
        .catch(() => {
          setShowErrorModal(true);
          setLoading(false);
          setSuccess(false);
        });
    } else if (
      sessionToken &&
      selectedBoardOption &&
      selectedAccount &&
      selectedGrouping &&
      date &&
      (boardName || groupName)
    ) {
      const queryData: QueryData = {
        account_id: selectedAccount.value,
        dimensions: selectedGrouping ? [selectedGrouping.value] : [],
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
          if (error.body && error.body.detail) {
            let errorMessage =
              "Could not fetch data from Google Ads API. Please check your configuration and try again.";
            try {
              const errorDetail = error.body.detail;
              if (Array.isArray(errorDetail) && errorDetail.length > 0) {
                const firstError = errorDetail[0];
                if (
                  firstError.error &&
                  firstError.error.details &&
                  firstError.error.details.length > 0
                ) {
                  const googleAdsFailure = firstError.error.details[0];
                  if (
                    googleAdsFailure.errors &&
                    googleAdsFailure.errors.length > 0
                  ) {
                    errorMessage = googleAdsFailure.errors[0].message;
                  }
                }
              }
            } catch (parseError) {
              console.error("Error parsing error detail:", parseError);
            }
            setErrorMessage(errorMessage);
            setShowErrorModal(true);
          } else {
            // Handle cases where there's no expected error structure
            console.log("Unexpected error structure:", error);
            setShowErrorModal(true);
          }
          setLoading(false);
          setIsRunning(false);
        });
    } else {
      setShowFieldsRequiredModal(true);
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
      { value: 90, label: "Last 90 Days" },
      { value: 365, label: "Last 12 Months" },
      { value: 730, label: "All time" },
    ],
    []
  );

  useEffect(() => {
    if (sessionToken) {
      GoogleAdsService.googleAdsAdAccounts(sessionToken)
        .then((accounts) => {
          const accountOptions: Option[] = accounts.map((account) => ({
            label: account.label,
            value: account.value,
          }));
          setAccountOptions(accountOptions);
        })
        .catch((error: any) => {
          if (error.body && error.body.detail) {
            const errorDetail = error.body.detail;
            console.log("Error detail:", errorDetail);

            if (
              errorDetail.error.includes("TWO_STEP_VERIFICATION_NOT_ENROLLED")
            ) {
              setShow2StepModal(true);
            } else if (errorDetail.error.includes("PERMISSION_DENIED")) {
              // Handle permission denied error
              console.log("Permission denied error");
              // You might want to show a different modal or message for this
            } else if (errorDetail.error.includes("invalid_grant")) {
              // Handle invalid grant error
              setShowExpiredModal(true);
              // You might want to show a different modal or message for this
            } else {
              // setErrorMessage(errorMessage);
              setShowErrorModal(true);
              // Handle other specific error messages here
              console.log("Unhandled error type");
            }
          } else {
            // Handle cases where there's no expected error structure
            console.log("Unexpected error structure:", error);
          }
        });
      GoogleAdsService.googleAdsFields().then((fields) => {
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
          isLoading={accountOptions.length === 0 ? true : false}
          loadingMessage={(inputValue: string) =>
            `Loading accounts. Please wait up to 10 seconds...`
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
      <BoardBlock
        sessionToken={sessionToken}
        workspaceId={workspaceId}
        user={user}
        boards={boards}
        setBoards={setBoards}
        boardId={boardId}
        setBoardId={setBoardId}
        connector="google_ads"
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
      <FieldsRequiredModal
        showModal={showFieldsRequiredModal}
        setShowModal={setShowFieldsRequiredModal}
      />
      <BaseModal
        title={"Error: invalid name"}
        text={"This board name already exists. Please choose a new name"}
        showModal={showNameModal}
        setShowModal={setShowNameModal}
      />
      <BaseModal
        title={"Google Ads Error: 2 step verification not enrolled"}
        text={
          <>
            Google Ads requires 2 step verification to be enabled on your
            account in order to use their API. If you don't see any accounts in
            the drop down menu, please{" "}
            <a
              href="https://support.google.com/google-ads/answer/12864186"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              enable 2 step verification
            </a>{" "}
            and try again.
          </>
        }
        showModal={show2StepModal}
        setShowModal={setShow2StepModal}
      />
      <BaseModal
        title={"Error: schedule error"}
        text={"Was unable to schedule your import. Please try again."}
        showModal={showScheduleModal}
        setShowModal={setShowScheduleModal}
      />
      <BaseModal
        title={"Google Error: Access Token Expired "}
        text={
          "Your Google access token has expired. Please press 'Connect to a different account to reauthenticate your access token."
        }
        showModal={showExpiredModal}
        setShowModal={setShowExpiredModal}
      />
      <BaseModal
        title={"Google Error: Could not fetch data"}
        text={`${errorMessage}\n\nIf you need more support with this, please email james@dataimporter.co and add the above message to the email body.`}
        showModal={showErrordModal}
        setShowModal={setShowErrorModal}
      />
    </div>
  );
};
