import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { UserYear } from "api";

interface props {
  changeYear: (data: UserYear) => void;
  year: UserYear;
}

export const YearDropDown: React.FC<props> = (props: props) => {
  const handleChange = (e: SelectChangeEvent<UserYear>): void => {
    const value: UserYear = e.target.value as UserYear;
    props.changeYear(value);
  };

  return (
    <FormControl required sx={{ m: 3, minWidth: 195 }}>
      <InputLabel>Year</InputLabel>
      <Select defaultValue={props.year} label="Year" onChange={handleChange}>
        <MenuItem value={UserYear.first}>1</MenuItem>
        <MenuItem value={UserYear.second}>2</MenuItem>
        <MenuItem value={UserYear.third}>3</MenuItem>
        <MenuItem value={UserYear.fourth}>4</MenuItem>
        <MenuItem value={UserYear.other}>4+</MenuItem>
      </Select>
    </FormControl>
  );
};
