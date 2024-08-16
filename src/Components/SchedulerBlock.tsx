import { useState, useMemo, useEffect } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css";
import {
  Dropdown,
  Tooltip,
  TextField,
  Button,
  Toggle,
  Icon,
} from "monday-ui-react-core";
import { UserPublic, Plan } from "../api";
import { Info } from "monday-ui-react-core/icons";
import { Option } from "../Utils/models";

export interface ScheduleFormProps {
  sessionToken?: string;
  workspaceId: number;
  user: UserPublic;
  isScheduled: boolean;
  setIsScheduled: React.Dispatch<React.SetStateAction<boolean>>;
  interval: Option;
  setInterval: React.Dispatch<React.SetStateAction<Option>>;
  every: Option;
  setEvery: React.Dispatch<React.SetStateAction<Option>>;
  days: string[];
  setDays: React.Dispatch<React.SetStateAction<string[]>>;
  startTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  timezone: Option;
  setTimezone: React.Dispatch<React.SetStateAction<Option>>;
}

export const SchedulerBlock: React.FC<ScheduleFormProps> = ({
  sessionToken,
  workspaceId,
  user,
  isScheduled,
  setIsScheduled,
  interval,
  setInterval,
  every,
  setEvery,
  days,
  setDays,
  startTime,
  setStartTime,
  timezone,
  setTimezone,
}) => {
  const [startTimeValue, setStartTimeValue] = useState<string>();

  const timezoneOptions = [
    { value: -12, label: "(UTC-12:00) International Date Line West" },
    { value: -11, label: "(UTC-11:00) Midway Island, Samoa" },
    { value: -10, label: "(UTC-10:00) Hawaii" },
    { value: -9, label: "(UTC-09:00) Alaska" },
    { value: -8, label: "(UTC-08:00) Pacific Time (US & Canada)" },
    { value: -7, label: "(UTC-07:00) Mountain Time (US & Canada)" },
    { value: -6, label: "(UTC-06:00) Central Time (US & Canada), Mexico City" },
    {
      value: -5,
      label: "(UTC-05:00) Eastern Time (US & Canada), Bogota, Lima",
    },
    { value: -4, label: "(UTC-04:00) Atlantic Time (Canada), Caracas, La Paz" },
    { value: -3.5, label: "(UTC-03:30) Newfoundland" },
    { value: -3, label: "(UTC-03:00) Brazil, Buenos Aires, Georgetown" },
    { value: -2, label: "(UTC-02:00) Mid-Atlantic" },
    { value: -1, label: "(UTC-01:00) Azores, Cape Verde Islands" },
    {
      value: 0,
      label: "(UTC+00:00) Western Europe Time, London, Lisbon, Casablanca",
    },
    { value: 1, label: "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris" },
    { value: 2, label: "(UTC+02:00) Kaliningrad, South Africa" },
    { value: 3, label: "(UTC+03:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
    { value: 3.5, label: "(UTC+03:30) Tehran" },
    { value: 4, label: "(UTC+04:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
    { value: 4.5, label: "(UTC+04:30) Kabul" },
    {
      value: 5,
      label: "(UTC+05:00) Ekaterinburg, Islamabad, Karachi, Tashkent",
    },
    { value: 5.5, label: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi" },
    { value: 5.75, label: "(UTC+05:45) Kathmandu" },
    { value: 6, label: "(UTC+06:00) Almaty, Dhaka, Colombo" },
    { value: 6.5, label: "(UTC+06:30) Yangon, Cocos Islands" },
    { value: 7, label: "(UTC+07:00) Bangkok, Hanoi, Jakarta" },
    { value: 8, label: "(UTC+08:00) Beijing, Perth, Singapore, Hong Kong" },
    { value: 9, label: "(UTC+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
    { value: 9.5, label: "(UTC+09:30) Adelaide, Darwin" },
    { value: 10, label: "(UTC+10:00) Eastern Australia, Guam, Vladivostok" },
    { value: 11, label: "(UTC+11:00) Magadan, Solomon Islands, New Caledonia" },
    { value: 12, label: "(UTC+12:00) Auckland, Wellington, Fiji, Kamchatka" },
    { value: 13, label: "(UTC+13:00) Nuku'alofa" },
    { value: 14, label: "(UTC+14:00) Line Islands" },
  ];

  const intervalOptions: Option[] = [
    { value: "hours", label: "Hourly" },
    { value: "days", label: "Daily" },
  ];

  const everyOptionsHours: Option[] = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
    { value: 11, label: "11" },
    { value: 12, label: "12" },
  ];

  const dayButtons: string[] = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const toggleDay = (day: string) => {
    setDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const handleStartTimeChange = (time: string) => {
    setStartTimeValue(time);
    // Get the current date
    const now = new Date();
    const currentDay = now.getDay();

    // Convert dayButtons to day indices (0 = Sunday, 1 = Monday, etc.)
    const dayIndices = days.map((day) => dayButtons.indexOf(day));

    // Find the closest day
    const closestDay = dayIndices.reduce((closest, day) => {
      const diff = (day - currentDay + 7) % 7;
      const closestDiff = (closest - currentDay + 7) % 7;
      return diff < closestDiff ? day : closest;
    }, dayIndices[0]);

    // Create a new date for the closest day
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + ((closestDay - currentDay + 7) % 7));

    // Set the time
    const [hours, minutes] = time.split(":");
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Build the datetime string
    const datetimeString = targetDate.toISOString();

    setStartTime(datetimeString);
  };

  return (
    <div className="border-2 border-gray rounded-md p-5 mb-2 mt-2">
      <div className="flex items-center gap-1">
        <p className="font-bold text-gray-500 text-sm">* Schedule</p>
        <Tooltip
          content="Scheduled requests run automatically, even if you are not logged
          into monday.com or do not have Data Importer open."
          position={Tooltip.positions.TOP}
        >
          <Icon icon={Info} className="text-gray-500" />
        </Tooltip>
      </div>
      <div className="mb-4">
        {user.plan === Plan.FREE ? (
          <>
            <Button>Upgrade</Button>
            <p className="text-sm text-gray-600 mb-4 flex items-center">
              Scheduled requests run automatically, even if you are not logged
              into monday.com or do not have Data Importer open.
            </p>
          </>
        ) : (
          <Toggle
            label="Schedule this request"
            isSelected={isScheduled}
            onChange={() => setIsScheduled(!isScheduled)}
          />
        )}
      </div>
      {isScheduled && (
        <div className="grid grid-cols-8 space-x-8">
          <div className="col-span-2">
            <Dropdown
              options={intervalOptions}
              value={interval}
              onChange={(e: Option) => setInterval(e)}
              clearable={false}
            />
          </div>
          {interval.value === "hours" && (
            <div className="flex items-center col-span-2 space-x-4">
              <span className="text-sm">Every</span>
              <Dropdown
                options={everyOptionsHours}
                value={every}
                onChange={(e: Option) => setEvery(e)}
                clearable={false}
              />
              <span className="text-sm">
                {interval.value === "hours" ? "hour(s)" : "day(s)"} on
              </span>
            </div>
          )}
          <div className="space-x-1 col-span-4">
            {dayButtons.map((day) => (
              <Button
                key={day}
                kind={days.includes(day) ? "primary" : "secondary"}
                onClick={() => toggleDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2 col-span-4 mt-4">
            <span className="text-sm">Starting</span>
            <TextField
              type="time"
              value={startTimeValue}
              onChange={(value: string) => handleStartTimeChange(value)}
              size={TextField.sizes.MEDIUM}
            />
          </div>
          <div className="col-span-4 mt-4">
            <Dropdown
              placeholder="Select timezone"
              value={timezone}
              onChange={(e: Option) => setTimezone(e)}
              options={timezoneOptions}
            />
          </div>
        </div>
      )}
    </div>
  );
};
