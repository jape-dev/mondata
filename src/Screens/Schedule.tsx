import React, { useState, useEffect } from 'react';
import { Table, Button, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from 'monday-ui-react-core';
import { RunService, Schedule, UserPublic } from '../api';
import { getImageUrl } from '../Utils/image';

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
        console.log(fetchedSchedules);
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
    { title: 'Last Run', accessor: 'last_run_at' },
    { title: 'Action' },

  ];

  const getConnectorIcon = (connector: string) => {
    const iconMap: { [key: string]: string } = {
      'facebook': 'facebook-icon',
      'facebook_pages': 'facebook-icon',
      'instagram': 'instagram-icon',
      'google_ads': 'google-ads-icon',
      'custom_api': 'custom-api-icon'
    };

    const iconName = iconMap[connector] || 'default-icon';
    return getImageUrl(iconName);
  };

  const getConnectorName = (connector: string) => {
    const nameMap: { [key: string]: string } = {
      'facebook': 'Facebook Ads',
      'facebook_pages': 'Facebook Pages',
      'instagram': 'Instagram',
      'google_ads': 'Google Ads',
      'custom_api': 'Custom API'
    };

    return nameMap[connector] || 'Unknown Connector';
  };

  const cronToHuman = (cron: string | null | undefined, tz_offset: number | null | undefined) => {
    if (cron === null || cron === undefined || tz_offset === null || tz_offset === undefined) return '-';
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ');
    
    const frequency = getFrequency(minute, hour, dayOfMonth, dayOfWeek);
    const time = getTime(minute, hour, tz_offset);
    
    return `${frequency}${time ? ` at ${time}` : ''}`;
  }

  const getFrequency = (minute: string, hour: string, dayOfMonth: string, dayOfWeek: string) => {
    if (hour.includes('/')) return 'Hourly';
    if (minute !== '*' && hour !== '*') return 'Daily';
    if (dayOfWeek !== '*') return 'Weekly';
    if (dayOfMonth !== '*') return 'Monthly';
    return 'Custom';
  }

  const getTime = (minute: string, hour: string, tz_offset: number) => {
    if (hour.includes('/')) {
      return `every hour at ${minute.padStart(2, '0')} minutes`;
    }
    if (minute === '*' || hour === '*') return '';
    
    const utcHour = parseInt(hour);
    const localHour = (utcHour + tz_offset + 24) % 24;
    
    return `${localHour.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
  }

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
              <TableCell>{schedule.board_name || '-'}</TableCell>
              <TableCell>
                {schedule.connector ? (
                  <div className="flex items-center">
                    <img 
                      src={getConnectorIcon(schedule.connector)} 
                      alt={`${schedule.connector} icon`}
                      className="w-5 h-5 mr-2"
                    />
                    <p className="text-sm">{getConnectorName(schedule.connector)}</p>
                  </div>
                ) : '-'}
              </TableCell>
              <TableCell>{cronToHuman(schedule.cron, schedule.tz_offset)}</TableCell>
              <TableCell>{schedule.last_run_at || '-'}</TableCell>
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