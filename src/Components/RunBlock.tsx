import { useState, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import { Button } from "monday-ui-react-core";
import { UserPublic } from "../api";
import { Option } from "../Utils/models";

const monday = mondaySdk();

export interface RunBlockProps {
  sessionToken?: string;
  workspaceId: number;
  user: UserPublic;
  boardId: number;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  isScheduled: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  success: boolean;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  period: Option;
  step: Option;
  days: string[];
  startTime: string;
  timezone: Option;
}

export const RunBlock: React.FC<RunBlockProps> = ({
  sessionToken,
  workspaceId,
  user,
  boardId,
  setIsRunning,
  isScheduled,
  loading,
  setLoading,
  success,
  setSuccess,
  period,
  step,
  days,
  startTime,
  timezone,
}) => {
  const [subdomain, setSubdomain] = useState("");

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

  const handleSaveClick = () => {
    // Api call to add to the schedule table and return id
    // Api call to add celery task
  };

  const handleSaveAndScheduleClick = () => {
    // Api call to add to the schedule table and return id

    // Api call to add celery task.
    setIsRunning(true);
    setLoading(true);
  };

  const handleRunClick = () => {
    setIsRunning(true);
    setLoading(true);
  };

  const handleSuccessClick = () => {
    setSuccess(false);
    const boardUrl = `https://${subdomain}.monday.com/boards/${boardId}`;
    window.open(boardUrl, "_blank");
    return;
  };

  return (
    <div className="border-2 border-gray rounded-md p-5 mb-2 mt-2">
      {isScheduled ? (
        <div>
          <Button
            onClick={handleRunClick}
            loading={loading}
            success={success}
            className="mt-2"
          >
            Schedule & Run
          </Button>
          <Button
            onClick={handleRunClick}
            loading={loading}
            success={success}
            className="mt-2"
          >
            Schedule & Run
          </Button>
        </div>
      ) : (
        <>
          {success ? (
            <Button
              onClick={handleSuccessClick}
              loading={loading}
              className="mt-2 bg-green-500"
            >
              Run Complete - Go to Board
            </Button>
          ) : (
            <Button
              onClick={handleRunClick}
              loading={loading}
              success={success}
              className="mt-2"
            >
              Run
            </Button>
          )}
        </>
      )}
    </div>
  );
};
