import { useState, useEffect } from "react";
import "monday-ui-react-core/dist/main.css";
import { Dropdown, Tooltip, Icon, TextField } from "monday-ui-react-core";
import { Info } from "monday-ui-react-core/icons";
import { UserPublic, MondayService } from "../../api";
import { Option } from "../../Utils/models";
import { getImageUrl } from "../../Utils/image";

interface Board {
  id: string;
  name: string;
}

interface BoardColumn {
    id: string;
    title: string;
    type: string;
  }

export interface BoardBlockProps {
  sessionToken?: string;
  workspaceId: number;
  user: UserPublic;
  boardId: number;
  setBoardId: React.Dispatch<React.SetStateAction<number>>;
  boards: Option[];
  setBoards: React.Dispatch<React.SetStateAction<Option[]>>;
  connector: string;
  selectedBoardOption: Option;
  setSelectedBoardOption: React.Dispatch<React.SetStateAction<Option>>;
  selectedColumnOption?: Option;
  setSelectedColumnOption: React.Dispatch<React.SetStateAction<Option | undefined>>;
  boardName?: string;
  setBoardName: React.Dispatch<React.SetStateAction<string | undefined>>;
  groupName?: string;
  setGroupName: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedGroupOption?: Option;
  setSelectedGroupOption: React.Dispatch<React.SetStateAction<Option | undefined>>;
  columnTitle?: string;
  columnModalTitle?: string;
  columnModalDescription?: string;
  columnModalImage?: string;
  splitByGroupingOptions?: Option[];
  splitByGrouping?: Option;
  setSplitByGrouping?: React.Dispatch<React.SetStateAction<Option | undefined>>;
}

export const BoardBlock: React.FC<BoardBlockProps> = ({
  sessionToken,
  workspaceId,
  user,
  boardId,
  setBoardId,
  boards,
  setBoards,
  connector,
  selectedBoardOption,
  setSelectedBoardOption,
  selectedColumnOption,
  setSelectedColumnOption,
  boardName,
  setBoardName,
  groupName,
  setGroupName,
  selectedGroupOption,
  setSelectedGroupOption,
  columnTitle,
  columnModalTitle,
  columnModalDescription,
  columnModalImage,
  splitByGroupingOptions,
  splitByGrouping,
  setSplitByGrouping,
}) => {
  const [boardGroups, setBoardGroups] = useState<Option[]>([{
    label: "Import into a new group",
    value: 999,
  }]);
  const [boardColumns, setBoardColumns] = useState<Option[]>([]);

  const handleBoardSelect = (selectedBoard: Option) => {
    setBoardName(undefined);
    setSelectedBoardOption(selectedBoard);
    setBoardId(selectedBoard.value);
    setSelectedColumnOption(undefined);
    setSelectedGroupOption(undefined);
    setGroupName(undefined);
  };

  const handleGroupSelect = (selectedGroup: Option) => {
    setSelectedGroupOption(selectedGroup);
    setGroupName(undefined);
  };


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
        .catch((error: any) => {
          console.log(error);
        });
      
      if (!['google_ads', 'google_analytics', 'custom_api', 'google_sheets'].includes(connector)) {
        MondayService.mondayGroups(sessionToken, selectedBoardOption.value)
          .then((groups: any) => {
            const groupOptions: Option[] = [
              {
                value: 999,
                label: "Import into a new group",
              },
              {
                value: 998,
                label: "Import into all groups",
              },
            ];
            groups.forEach((group: any) => {
              groupOptions.push({
                value: group.id,
                label: group.title,
              });
            });
            setBoardGroups(groupOptions);
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
    }
  }, [selectedBoardOption]);


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

  return (
    <>
    <div className="border-2 border-gray rounded-md p-5">
        <div className="flex items-center gap-1">
          <p className="font-bold text-gray-500 text-sm">* Board</p>
          <Tooltip
            content="The board to import metrics into."
            position={Tooltip.positions.TOP_START}
          >
            <Icon icon={Info} className="text-gray-500" />
          </Tooltip>
        </div>
        <Dropdown
          value={selectedBoardOption}
          options={boards}
          sLoading={boards.length === 0}
          placeholder="Select a board"
          className="mb-2"
          onOptionSelect={(e: Option) => handleBoardSelect(e)}
        />
        {selectedBoardOption?.value && selectedBoardOption.value !== 999 ? (
          <>
            <div className="flex items-center gap-1">
              <p className="font-bold text-gray-500 text-sm">
                * Group
              </p>
              <Tooltip
                title={columnModalTitle}
                content={columnModalDescription}
                image={columnModalImage ? getImageUrl(columnModalImage) : undefined}
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              options={boardGroups}
              value={selectedGroupOption}
              isLoading={boardGroups.length === 0 && !['google_ads', 'google_analytics', 'custom_api', 'google_sheets'].includes(connector)}
              onOptionSelect={(e: Option) => handleGroupSelect(e)}
              placeholder="Select group"
              className="mb-2"
              menuPlacement={"bottom"}
            />
            {selectedGroupOption?.value && selectedGroupOption.value !== 999 && columnModalTitle && columnModalDescription && columnModalImage ? (
                <>
                    <div className="flex items-center gap-1">
                        <p className="font-bold text-gray-500 text-sm">
                            * {columnTitle}
                        </p>
                        <Tooltip
                            title={columnModalTitle}
                            content={columnModalDescription}
                            image={getImageUrl(columnModalImage)}
                        >
                        <Icon icon={Info} className="text-gray-500" />
                        </Tooltip>  
                  </div>
                  <Tooltip
                  title={columnModalTitle}
                  content={columnModalDescription}
                  image={getImageUrl(columnModalImage)}
                position={Tooltip.positions.TOP_START}
              >
                  <Dropdown
                    options={boardColumns}
                    isLoading={boardColumns.length === 0}
                    onOptionSelect={(e: Option) => setSelectedColumnOption(e)}
                    placeholder="Select column"
                    className="mb-2"
                    menuPlacement={"bottom"}
                    />
                    </Tooltip>
                </>
            ) : selectedGroupOption?.value && selectedGroupOption.value === 999 ? (
                <>
                <div className="flex items-center gap-1">
                <p className="font-bold text-gray-500 text-sm">
                    * Group Name
                </p>
                <Tooltip
                    content={"Name of new group to be created."}
                    position={Tooltip.positions.TOP}
                >
                <Icon icon={Info} className="text-gray-500" />
                </Tooltip>
                </div>
                <TextField
                    onChange={(e: any) => setGroupName(e)}
                    size={TextField.sizes.MEDIUM}s
                    placeholder="Enter name"
                    className="mb-2 !text-sm"
                />
                </>
            ) : (
                <></>
            )
        }
        {['google_ads', 'google_analytics', 'facebook'].includes(connector) && selectedGroupOption?.value === 999  && setSplitByGrouping && (
          <>
            <div className="flex items-center gap-1 mt-2">
              <p className="font-bold text-gray-500 text-sm">* Split by</p>
              <Tooltip
                content="Choose whether metrics should be split by Facebook Ad Id, Adset Id or Campaign Id"
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              options={splitByGroupingOptions}
              value={splitByGrouping}
              onOptionSelect={(e: Option) => setSplitByGrouping(e)}  
              placeholder="Select column"
              className="mb-2"
              menuPlacement={"top"}
            />
          </>
        )}
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
            {['google_ads', 'google_analytics', 'facebook'].includes(connector) && setSplitByGrouping && (
          <>
            <div className="flex items-center gap-1 mt-2">
              <p className="font-bold text-gray-500 text-sm">* Split by</p>
              <Tooltip
                content="Choose whether metrics should be split by Facebook Ad Id, Adset Id or Campaign Id"
                position={Tooltip.positions.TOP}
              >
                <Icon icon={Info} className="text-gray-500" />
              </Tooltip>
            </div>
            <Dropdown
              options={splitByGroupingOptions}
              value={splitByGrouping}
              onOptionSelect={(e: Option) => setSplitByGrouping(e)}  
              placeholder="Select column"
              className="mb-2"
              menuPlacement={"top"}
            />
          </>
        )}
          </>
        )}
      </div>
    </>
  );
};
