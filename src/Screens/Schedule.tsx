import React, { useState, useEffect } from 'react';
import { Table, Button, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from 'monday-ui-react-core';
import { RunService, Schedule, UserPublic } from '../api';

interface ScheduleProps {
  sessionToken?: string;
  user?: UserPublic;
}

export const ScheduleTable: React.FC<ScheduleProps> = ({ sessionToken, user }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionToken) {
      fetchSchedules();
    }
  }, [sessionToken]);

  const fetchSchedules = async () => {
    try {
      if (sessionToken) {
        setLoading(true);
        const fetchedSchedules = await RunService.runGetUserSchedules(sessionToken);
        setSchedules(fetchedSchedules);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scheduleId: number) => {
    try {
      if (sessionToken) {
      await RunService.runDeleteSchedule(scheduleId, sessionToken);
      setSchedules(schedules.filter(schedule => schedule.id !== scheduleId));
      }
    } catch (err) {
      setError('Failed to delete schedule. Please try again.');
    }
  };

  const columns = [
    { title: 'Board', accessor: 'board_name' },
    { title: 'Connector', accessor: 'connector' },
    { title: 'Frequency', accessor: 'period' },
    { title: 'Next Run', accessor: 'start_datetime' },
  ];

  return (
    <div className="p-2">
      <Table
        dataState={{ isLoading: loading }}
        errorState={error ? <div>{error}</div> : null}
        emptyState={schedules.length === 0 ? <div>No schedules found</div> : null}
        columns={columns}
      >
        <TableHeader>
          {columns.map((headerCell, index) => (
            <TableHeaderCell key={index} title={headerCell.title} />
          ))}
        </TableHeader>
        <TableBody>
          {schedules.map(schedule => (
            <TableRow key={schedule.id}>
              <TableCell>{schedule.board_id}</TableCell>
              <TableCell>{schedule.connector}</TableCell>
              {/* <TableCell>{schedule.period}</TableCell>
              <TableCell>{schedule.start_datetime}</TableCell> */}
              <TableCell>
                <Button onClick={() => schedule.id && handleDelete(schedule.id)} kind="tertiary" color="negative">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};