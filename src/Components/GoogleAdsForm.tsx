import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Dropdown,
  Button,
  Tooltip,
  Icon,
  Modal,
  ModalContent,
} from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import {
  GoogleAdsService,
  User,
  MondayService,
  QueryData,
  ColumnData,
  MondayItem,
  Body_google_ads_fetch_all_data,
  RunService,
  RunBase,
} from "../api";

const monday = mondaySdk();

interface Board {
  id: string;
  name: string;
}

interface Option {
  value: any;
  label: string;
}

interface BoardColumn {
  id: string;
  title: string;
  type: string;
}

export interface GoogleAdsFormProps {
  user: User;
}

export const GoogleAdsForm: React.FC<GoogleAdsFormProps> = ({ user }) => {
  const [accountOptions, setAccountOptions] = useState<Option[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Option>();
  const [fields, setFields] = useState<Option[]>([]);
  const [selectedFields, setSelectedFields] = useState<Option[]>([]);
  const [boards, setBoards] = useState<Option[]>([
    {
      value: "new_board",
      label: "Import into a new board",
    },
  ]);
  const [selectedBoardOption, setSelectedBoardOption] = useState<Option>();
  const [boardColumns, setBoardColumns] = useState<Option[]>([]);
  const [selectedGrouping, setSelectedGrouping] = useState<Option>();
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [date, setDate] = useState<Option>({ value: 730, label: "All time" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const groupingOptions = useMemo(() => {
    return [
      { value: "campaign.name", label: "Campaign" },
      { value: "ad_group.name", label: "Ad Group" },
      { value: "ad_group_ad.ad.id", label: "Ad" },
    ];
  }, []);

  const getImageUrl = (imgPath: string) => {
    return require(`../Static/images/${imgPath}.png`);
  };

  const handleRunClick = () => {
    setLoading(true);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - date.value);
    if (user?.monday_token && selectedBoardOption && selectedAccount && date) {
      if (selectedColumnOption) {
        MondayService.mondayItems(
          user.monday_token,
          selectedBoardOption?.value,
          selectedColumnOption?.value
        ).then((items: MondayItem[]) => {
          const queryData: QueryData = {
            monday_items: items,
            account_id: selectedAccount?.value,
            dimensions: selectedGrouping?.value,
            metrics: selectedFields.map((field) => field.value),
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          };
          const body: Body_google_ads_fetch_all_data = {
            query: queryData,
            user: user,
          };
          console.log(body);
          GoogleAdsService.googleAdsFetchData(body)
            .then((data: ColumnData[]) => {
              if (user.monday_token) {
                MondayService.mondayAddData(
                  user?.monday_token,
                  selectedBoardOption.value,
                  data
                )
                  .then(() => {
                    if (user.id) {
                      const run: RunBase = {
                        user_id: user.id,
                        board_id: selectedBoardOption.value,
                      };
                      RunService.runRun(run);
                    }
                    // Send valueCreatedForUser event when data has been loaded into board
                    monday.execute("valueCreatedForUser");
                    setLoading(false);
                    setSuccess(true);
                  })
                  .catch(() => {
                    setLoading(false);
                    setSuccess(false);
                  });
              }
            })
            .catch(() => {
              setLoading(false);
              setSuccess(false);
            });
        });
      } else {
        const queryData: QueryData = {
          account_id: selectedAccount?.value,
          dimensions: [selectedGrouping?.value],
          metrics: selectedFields.map((field) => field.value),
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        };
        const body: Body_google_ads_fetch_all_data = {
          query: queryData,
          user: user,
        };
        console.log(body);
        GoogleAdsService.googleAdsFetchAllData(body).then(
          (data: ColumnData[]) => {
            if (user.monday_token) {
              MondayService.mondayCreateBoardWithData(
                user?.monday_token,
                "Google Ads",
                data
              )
                .then(() => {
                  // Send valueCreatedForUser event when data has been loaded into board
                  monday.execute("valueCreatedForUser");
                  setLoading(false);
                  setSuccess(true);
                })
                .catch(() => {
                  setLoading(false);
                  setSuccess(false);
                });
            }
          }
        );
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
    if (user?.google_token) {
      GoogleAdsService.googleAdsAdAccounts(user.google_token).then(
        (accounts) => {
          const accountOptions: Option[] = accounts.map((account) => ({
            label: account.label,
            value: account.value,
          }));
          console.log(accountOptions);
          setAccountOptions(accountOptions);
        }
      );
      GoogleAdsService.googleAdsFields().then((fields) => {
        const fieldOptions: Option[] = fields.map((field) => ({
          label: field.label,
          value: field.value,
        }));
        setFields(fieldOptions);
      });
    }
  }, [user]);

  // useEffect(() => {
  //   if (user?.monday_token) {
  //     MondayService.mondayBoards(user.monday_token).then((boards: Board[]) => {
  //       const boardOptions: Option[] = [
  //         {
  //           value: "new_board",
  //           label: "Import into a new board",
  //         },
  //       ];
  //       boards.forEach((board: Board) => {
  //         boardOptions.push({
  //           value: board.id,
  //           label: board.name,
  //         });
  //       });
  //       setBoards(boardOptions);
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    if (
      selectedBoardOption &&
      selectedBoardOption?.value !== "new_board" &&
      user?.monday_token
    ) {
      MondayService.mondayBoardColumns(
        selectedBoardOption.value,
        user.monday_token
      )
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
          sLoading={fields.length === 0}
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
          options={boards}
          sLoading={boards.length === 0}
          placeholder="Select a board"
          className="mb-2"
          onOptionSelect={(e: Option) => handleBoardSelect(e)}
        />
        {selectedBoardOption?.value === "new_board" ? (
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
              sLoading={accountOptions.length === 0}
              onOptionSelect={(e: Option) => setSelectedAccount(e)}
            />
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">* Split by</p>
              <Tooltip
                content="Choose whether metrics should be split by Google Ad Id, Adset Id or Campaign Id"
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
              sLoading={groupingOptions.length === 0}
              className="mb-2"
              menuPlacement={"top"}
            />
          </>
        ) : selectedBoardOption &&
          selectedBoardOption?.value !== "new_board" ? (
          <>
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">
                * Split by Column
              </p>
              <Tooltip
                title="The column containing the Google Ad Id, Adset Id or Campaign Id to split metrics by."
                content="(Example above). Each row containing an id will have imported metrics for it. If you want to use post urls instead, select the Google Posts connector."
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
      <Button
        onClick={handleRunClick}
        loading={loading}
        success={success}
        successText="Run Complete - Go to Board"
        className="mt-2"
      >
        Run
      </Button>
      <Modal
        title="Error: Required Fields"
        onClose={() => setShowModal(false)}
        show={showModal}
      >
        <ModalContent>
          <p>Ensure all required options are selected before running.</p>
        </ModalContent>
      </Modal>
    </div>
  );
};
