import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { UserPronouns } from "api";
import React from "react";

interface props {
  changePronouns: (data: UserPronouns) => void;
  pronoun: UserPronouns;
}

export const PronounDropDown: React.FC<props> = (props: props) => {
  const handleChange = (e: SelectChangeEvent<UserPronouns>): void => {
    const value: UserPronouns = e.target.value as UserPronouns;
    props.changePronouns(value);
  };

  return (
    <FormControl required sx={{ m: 3, minWidth: 195 }}>
      <InputLabel>Pronouns</InputLabel>
      <Select
        defaultValue={props.pronoun}
        label="Pronouns"
        onChange={handleChange}
      >
        <MenuItem value={UserPronouns.they}>They/Them</MenuItem>
        <MenuItem value={UserPronouns.he}>He/Him</MenuItem>
        <MenuItem value={UserPronouns.she}>She/Her</MenuItem>
        <MenuItem value={UserPronouns.other}>Other</MenuItem>
      </Select>
    </FormControl>
  );
};
