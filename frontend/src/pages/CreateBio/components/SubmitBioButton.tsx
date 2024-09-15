import { Button } from "@mui/material";
import React from "react";

interface props {
  save: () => void;
}

export const SubmitBioButton: React.FC<props> = (props: props) => {
  return (
    <Button
      variant="contained"
      sx={{
        marginTop: 2,
        borderRadius: 5,
        marginBottom: 5,
      }}
      onClick={props.save}
    >
      Save Bio
    </Button>
  );
};
