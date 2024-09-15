import React, { useState, Fragment } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Box, Typography, Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { endOfDay } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { StateProps } from "./interfaces";
import { useOnMount } from "hooks";

interface DatePickerProps extends StateProps {}

export const EndDatePicker: React.FC<DatePickerProps> = ({
  projectRequest,
  setProjectRequest,
}) => {
  const [value, setValue] = useState<Date | null>(new Date());

  // Because we need utc time; separate datePicker state and request state
  // So need to initialize request state on mount
  useOnMount(() => {
    if (value === null) return;
    setProjectRequestState(value);
  });

  const infoText =
    "We'll disable matching after this date and shuffle any remaining students into groups that have space.";

  const setProjectRequestState = (date: Date): void => {
    const utcTime = getUtcTime(date);
    setProjectRequest({ ...projectRequest, end_date: utcTime });
  };

  const getUtcTime = (date: Date): string => {
    // Matching will end on EOD of specified date
    const endDate = endOfDay(date);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // JS Date doesn't have tz info, so we need to pass origin tz to converter
    const utcTime = zonedTimeToUtc(endDate, timeZone);
    return utcTime.toISOString();
  };
  const handleChange = (
    value: Date | null,
    keyboardInputValue: string | undefined
  ): void => {
    setValue(value);

    if (value === null) return;
    setProjectRequestState(value);
  };

  return (
    <Fragment>
      <Box display="flex" flexDirection="row" p={1} alignItems="center">
        <Typography variant="body1">
          When should students form their groups by?
        </Typography>
        <Tooltip title={infoText}>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <DatePicker
        disablePast
        openTo="day"
        views={["year", "month", "day"]}
        value={value}
        onChange={handleChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </Fragment>
  );
};
