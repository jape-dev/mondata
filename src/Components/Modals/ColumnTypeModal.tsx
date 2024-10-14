import React, { useState } from "react";
import { Modal, ModalContent, Dropdown, Button } from "monday-ui-react-core";
import { ColumnData } from "api";
import { Option } from "../../Utils/models";

interface ColumnTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnData[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnData[]>>;
}

const mondayColumnTypes = [
  //   { value: "checkbox", label: "Checkbox" },
  //   { value: "color-picker", label: "Color Picker" },
  { value: "country", label: "Country" },
  { value: "date", label: "Date" },
  //   { value: "dropdown", label: "Dropdown" },
  { value: "email", label: "Email" },
  //   { value: "file", label: "File" },
  //   { value: "formula", label: "Formula" },
  { value: "link", label: "Link" },
  //   { value: "location", label: "Location" },
  { value: "long-text", label: "Long Text" },
  { value: "numbers", label: "Number" },
  //   { value: "people", label: "People" },
  { value: "phone", label: "Phone" },
  //   { value: "progress", label: "Progress" },
  //   { value: "rating", label: "Rating" },
  { value: "status", label: "Status" },
  //   { value: "tags", label: "Tags" },
  //   { value: "team", label: "Team" },
  { value: "text", label: "Text" },
  //   { value: "timeline", label: "Timeline" },
  //   { value: "vote", label: "Vote" },
  { value: "week", label: "Week" },
  //   { value: "world-clock", label: "World Clock" },
];

export const ColumnTypeModal: React.FC<ColumnTypeModalProps> = ({
  isOpen,
  onClose,
  columns,
  setColumns,
}) => {
  const [columnTypes, setColumnTypes] = useState<{
    [key: string]: string | undefined;
  }>(
    columns.reduce(
      (acc, column) => ({
        ...acc,
        [column.column_name]: column.column_type || undefined,
      }),
      {}
    )
  );

  const handleTypeChange = (column: string, type: string | undefined) => {
    setColumnTypes((prev) => ({ ...prev, [column]: type }));
  };

  const handleSave = () => {
    setColumns(
      columns.map((column) => ({
        ...column,
        column_type: columnTypes[column.column_name],
      }))
    );
    onClose();
  };

  return (
    <Modal title="Update Column Types" onClose={onClose} show={isOpen}>
      <ModalContent className="">
        <p className="text-sm text-gray-600 mb-4 mt-4">
          Optionally set monday.com column types to import as. If column type is
          left blank, it will import as the default type (text or number) based
          on the column content.
        </p>
        <div className="space-y-2 border-grey rounded-md p-5 mb-2 mt-5">
          {columns.map((column) => (
            <div
              key={column.column_name}
              className="flex items-center justify-between"
            >
              <span className="font-medium">{column.column_name}</span>
              <Dropdown
                className="w-48"
                value={{
                  value: columnTypes[column.column_name],
                  label: columnTypes[column.column_name],
                }}
                onChange={(option: Option | null) =>
                  handleTypeChange(
                    column.column_name,
                    option?.value || undefined
                  )
                }
                options={mondayColumnTypes}
                onClear={() => handleTypeChange(column.column_name, undefined)}
              />
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Button onClick={handleSave} color={Button.colors.PRIMARY}>
            Save Changes
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
};
