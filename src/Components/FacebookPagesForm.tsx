import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Dropdown,
  Button,
  Tooltip,
  Icon,
  TextField,
} from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  BillingService,
  FacebookService,
  UserPublic,
  MondayService,
  QueryData,
  MondayItem,
  RunService,
  Body_run_run,
  ScheduleInput,
  Run,
} from "../api";
import { FieldsRequiredModal } from "./Modals/FieldsRequiredModal";
import { handleSuccessClick } from "../Utils/monday";
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

export interface FacebookPagesFormProps {
  user: UserPublic;
  workspaceId: number;
  sessionToken?: string;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: number;
  setBoardId: React.Dispatch<React.SetStateAction<number>>;
}

export const FacebookPagesForm: React.FC<FacebookPagesFormProps> = ({
  user,
  workspaceId,
  sessionToken,
  isRunning,
  setIsRunning,
  setLoading,
  setSuccess,
  boardId,
  setBoardId,
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
  const [boardColumns, setBoardColumns] = useState<Option[]>([]);
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [subdomain, setSubdomain] = useState("");
  const [showFieldsModal, setShowFieldsModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [boardName, setBoardName] = useState();
  const [showErrordModal, setShowErrorModal] = useState(false);

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

  const getImageUrl = (imgPath: string) => {
    return require(`../Static/images/${imgPath}.png`);
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
      connector: "facebook_pages",
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
        sessionToken
      )
        .then((items: MondayItem[]) => {
          const queryData: QueryData = {
            monday_items: items,
            account_id: selectedAccount?.value,
            metrics: selectedFields.map((field) => field.value),
          };
          const requestBody: Body_run_run = {
            query: queryData,
            schedule_input: scheduleInput,
          };
          RunService.runRun(sessionToken, requestBody)
            .then((run: Run) => {
              setBoardId(run.board_id);
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
        .catch((error) => {
          setShowErrorModal(true);
          setLoading(false);
        });
    } else if (sessionToken && selectedBoardOption && boardName) {
      const queryData: QueryData = {
        account_id: selectedAccount?.value,
        metrics: selectedFields.map((field) => field.value),
      };
      const requestBody: Body_run_run = {
        query: queryData,
        schedule_input: scheduleInput,
      };
      RunService.runRun(sessionToken, requestBody, boardName)
        .then((run: Run) => {
          setBoardId(run.board_id);
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
    } else {
      setShowFieldsModal(true);
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

  useEffect(() => {
    const getSubdomain = () => {
      monday
        .get("location")
        .then((res) => {
          if (res.data && res.data.href) {
            const url = new URL(res.data.href);
            const hostnameParts = url.hostname.split(".");

            if (hostnameParts.length > 2 && hostnameParts[0] !== "www") {
              setSubdomain(hostnameParts[0]);
            } else if (hostnameParts.length > 2) {
              setSubdomain(hostnameParts[1]);
            } else {
              console.error("Unable to determine subdomain");
            }
          } else {
            console.error("Invalid location data");
          }
        })
        .catch((error) => {
          console.error("Error getting location:", error);
        });
    };

    getSubdomain();
  }, []);

  const handleBoardSelect = (selectedBoard: Option) => {
    setSelectedBoardOption(selectedBoard);
    setSelectedColumnOption(undefined);
    setBoardId(selectedBoard.value);
    setBoardName(undefined);
  };

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
          sLoading={fields.length === 0}
          onOptionSelect={(e: Option) => handleFieldSelect(e)}
          onOptionRemove={(e: Option) => handleFieldDeselect(e)}
        />
      </div>
      <div className="border-2 border-gray rounded-md p-5">
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Board</p>
          <Tooltip
            content="The board to import metrics into."
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
        {selectedBoardOption?.value && selectedBoardOption.value !== 999 ? (
          <>
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">
                * Post Url Column
              </p>
              <Tooltip
                title="The column containing the url of post"
                content="(Example above). Each row containing a url will have imported metrics for it. If you want to use ad ids instead, select the Facebook Ads application."
                position={Tooltip.positions.TOP}
                image={getImageUrl("post-urls")}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              options={boardColumns}
              onOptionSelect={(e: Option) => setSelectedColumnOption(e)}
              placeholder="Select column"
              className="mb-2"
            />
          </>
        ) : (
          <>
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
        )}
      </div>
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
    </div>
  );
};
