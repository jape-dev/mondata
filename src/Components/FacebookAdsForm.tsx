import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Button } from "monday-ui-react-core";
import {
  FacebookService,
  User,
  MondayService,
  QueryData,
  ColumnData,
  MondayItem,
  Body_facebook_fetch_data,
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

export interface FacebookAdFormProps {
  user: User;
}

export const FacebookAdsForm: React.FC<FacebookAdFormProps> = ({ user }) => {
  const [accountOptions, setAccountOptions] = useState<Option[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Option>();
  const [fields, setFields] = useState<Option[]>([]);
  const [selectedFields, setSelectedFields] = useState<Option[]>([]);
  const [boards, setBoards] = useState<Option[]>([]);
  const [selectedBoardOption, setSelectedBoardOption] = useState<Option>();
  const [boardColumns, setBoardColumns] = useState<Option[]>([]);
  const [selectedColumnOption, setSelectedColumnOption] = useState<Option>();
  const [date, setDate] = useState<Option>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRunClick = () => {
    setLoading(true);
    if (
      user?.monday_token &&
      selectedBoardOption &&
      selectedColumnOption &&
      selectedAccount &&
      date
    ) {
      MondayService.mondayItems(
        user.monday_token,
        selectedBoardOption?.value,
        selectedColumnOption?.value
      ).then((items: MondayItem[]) => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - date.value);

        const queryData: QueryData = {
          monday_items: items,
          account_id: selectedAccount?.value,
          metrics: selectedFields.map((field) => field.value),
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
        };

        const body: Body_facebook_fetch_data = {
          query: queryData,
          user: user,
        };
        FacebookService.facebookFetchData(body).then((data: ColumnData[]) => {
          if (user.monday_token) {
            MondayService.mondayAddData(
              user?.monday_token,
              selectedBoardOption.value,
              data
            ).then(() => {
              setLoading(false);
              setSuccess(true);
            });
          }
        });
      });
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
      { value: 730, label: "Last 24 Months" },
    ],
    []
  );

  useEffect(() => {
    if (user?.facebook_token) {
      FacebookService.facebookAdAccounts(user.facebook_token).then(
        (accounts) => {
          const accountOptions: Option[] = accounts.map((account) => ({
            label: account.label,
            value: account.value,
          }));
          setAccountOptions(accountOptions);
        }
      );
      FacebookService.facebookFields().then((fields) => {
        const fieldOptions: Option[] = fields.map((field) => ({
          label: field.label,
          value: field.value,
        }));
        setFields(fieldOptions);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.monday_token) {
      MondayService.mondayBoards(user.monday_token).then((boards: Board[]) => {
        const boardOptions: Option[] = boards.map((board: Board) => ({
          value: board.id,
          label: board.name,
        }));
        setBoards(boardOptions);
      });
    }
  }, [user]);

  useEffect(() => {
    if (selectedBoardOption && user?.monday_token) {
      MondayService.mondayBoardColumns(
        selectedBoardOption.value,
        user.monday_token
      ).then((columns: BoardColumn[]) => {
        const columnOptions: Option[] = columns.map((column: BoardColumn) => ({
          value: column.id,
          label: column.title,
        }));
        setBoardColumns(columnOptions);
      });
    }
  }, [selectedBoardOption]);

  return (
    <div className="p-2">
      <div className="border-2 border-grey rounded-md p-5 mb-2">
        <p className="font-bold text-gray-500 text-sm">* Account</p>
        <Dropdown
          placeholder="Select an account"
          className="mb-2"
          options={accountOptions}
          onOptionSelect={(e: Option) => setSelectedAccount(e)}
        />
        <p className="font-bold text-gray-500 text-sm">* Fields</p>
        <Dropdown
          placeholder="Select fields"
          multi
          multiline
          options={fields}
          onOptionSelect={(e: Option) => handleFieldSelect(e)}
          onOptionRemove={(e: Option) => handleFieldDeselect(e)}
        />
      </div>
      <div className="border-2 border-gray rounded-md p-5">
        <p className="font-bold text-gray-500 text-sm">* Board</p>
        <Dropdown
          options={boards}
          placeholder="Select a board"
          className="mb-2"
          onOptionSelect={(e: Option) => setSelectedBoardOption(e)}
        />
        <p className="font-bold text-gray-500 text-sm">* Id Column</p>
        <Dropdown
          options={boardColumns}
          onOptionSelect={(e: Option) => setSelectedColumnOption(e)}
          placeholder="Select column"
          className="mb-2"
        />
        <p className="font-bold text-gray-500 text-sm">* Date</p>
        <Dropdown
          placeholder="Select a date range"
          options={dateOptions}
          className="mb-2"
          onOptionSelect={(e: Option) => setDate(e)}
        />
      </div>
      <Button
        onClick={handleRunClick}
        loading={loading}
        success={success}
        successText="Run Complete"
        className="mt-2"
      >
        Run
      </Button>
    </div>
  );
};
