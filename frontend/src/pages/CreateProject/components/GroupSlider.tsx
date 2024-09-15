import React, { useState, Fragment } from "react";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { StateProps } from "./interfaces";

interface GroupSliderProps extends StateProps {}

export const INITIAL_MIN = 2;
export const INITIAL_MAX = 3;

export const GroupSlider: React.FC<GroupSliderProps> = ({
  projectRequest,
  setProjectRequest,
}) => {
  const [size, setSize] = useState<number>(INITIAL_MAX);

  // Due to change in business logic, API will always take 2 as min group size
  // Slider used to select two values

  const handleChange = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ): void => {
    const newSize = newValue as number;

    setSize(newSize);

    setProjectRequest({
      ...projectRequest,
      min_group_size: INITIAL_MIN,
      max_group_size: newSize,
    });
  };

  return (
    <Fragment>
      <Typography variant="body1">
        How many students are allowed per group?
      </Typography>
      <Slider
        value={size}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={2}
        max={10}
      />
      <Typography variant="body1">{size}</Typography>
    </Fragment>
  );
};
