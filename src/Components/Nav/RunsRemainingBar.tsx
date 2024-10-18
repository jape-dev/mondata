import React, { useState, useEffect } from "react";
import { LinearProgressBar, Icon, Tooltip } from "monday-ui-react-core";
import { BillingService, UserPublic } from "../../api";
import { Info } from "monday-ui-react-core/icons";

interface RunsRemainingBarProps {
  sessionToken?: string;
  user: UserPublic | undefined;
  className?: string;
}

export const RunsRemainingBar: React.FC<RunsRemainingBarProps> = ({
  sessionToken,
  user,
  className,
}) => {
  const [remainingRuns, setRemainingRuns] = useState<number>(3);
  const [totalRuns, setTotalRuns] = useState<number>(3);

  useEffect(() => {
    if (sessionToken && user) {
      BillingService.billingRemainingRuns(user)
        .then((remaining) => {
          setRemainingRuns(Math.max(0, remaining));
        })
        .catch((error) => {
          console.error("Error fetching remaining runs:", error);
        });
    }
  }, [sessionToken, user]);

  const percentRemaining = (remainingRuns / totalRuns) * 100;

  return (
    <div>
      <div className="flex justify-between items-start w-full mb-1">
        <div className="text-sm flex items-center gap-1">
          Imports{" "}
          <Tooltip
            content="Remaining imports for the month. Upgrade to unlock unlimited imports."
            position={Tooltip.positions.BOTTOM}
          >
            <Icon icon={Info} className="text-gray-500" />
          </Tooltip>
        </div>
        <span className="text-sm">
          {remainingRuns}/{totalRuns}
        </span>
      </div>
      <LinearProgressBar
        value={percentRemaining}
        size={LinearProgressBar.sizes.MEDIUM}
        barStyle={
          remainingRuns <= 1
            ? LinearProgressBar.styles.NEGATIVE
            : remainingRuns === 2
            ? LinearProgressBar.styles.WARNING
            : LinearProgressBar.styles.POSITIVE
        }
        className={className}
      />
    </div>
  );
};
