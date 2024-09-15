import React from "react";

import {
  TextField,
  Box,
  Typography,
  Button,
  InputAdornment,
} from "@mui/material";
import { CopyIcon } from "./CopyIcon";
import { useNavigate } from "react-router-dom";

import { styles } from "./styles";

interface InviteCodeProps {
  join_code: string;
}

export const InviteCode: React.FC<InviteCodeProps> = ({ join_code }) => {
  const navigate = useNavigate();
  return (
    <Box sx={styles.centered} padding={10} marginBottom={10}>
      <Typography variant="h5">All set!</Typography>
      <TextField
        sx={styles.textField}
        defaultValue={join_code}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <CopyIcon {...{ toCopy: join_code }} />
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="h6" align="center">
        Share the invite code above with your students to have them access your
        project!
      </Typography>

      <Button
        variant="contained"
        sx={styles.navButton}
        onClick={() => {
          navigate("/projects");
        }}
      >
        Go Back to Your Projects
      </Button>
    </Box>
  );
};
