import React, { useMemo } from "react";
import { TextField, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { GroupSlider } from "./GroupSlider";
import { EndDatePicker } from "./EndDatePicker";
import { CreateProjectRequest } from "api";
import { StateProps } from "./interfaces";
import { LoadingButton } from "@mui/lab";
import { styles } from "./styles";

interface CreateProjectFormProps extends StateProps {
  mutate: (request: CreateProjectRequest) => void;
  isLoading: boolean;
}

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  projectRequest,
  setProjectRequest,
  mutate,
  isLoading,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setProjectRequest((prevState: CreateProjectRequest) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const isIncomplete = useMemo((): boolean => {
    const req = projectRequest;
    return !(
      req.project_name.length > 0 &&
      req.description.length > 0 &&
      req.min_group_size > 0 &&
      req.max_group_size > 0 &&
      req.end_date.length > 0
    );
  }, [projectRequest]);

  return (
    <Box display="flex" justifyContent="center" padding={10} marginBottom={10}>
      <Grid container maxWidth={1000} spacing={5}>
        <Grid xs={12} sx={styles.centered}>
          <Typography variant="h5">
            Give us some details about your project to get started
          </Typography>
        </Grid>
        <Grid xs={6} sx={styles.centered}>
          <TextField
            required
            name="project_name"
            inputProps={{ maxLength: 250 }}
            type={"text"}
            variant="outlined"
            placeholder="What's the project called?"
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={6} sx={styles.centered}>
          <GroupSlider {...{ projectRequest, setProjectRequest }} />
        </Grid>
        <Grid xs={6} sx={styles.centered}>
          <TextField
            required
            multiline
            minRows={5}
            maxRows={5}
            inputProps={{ maxLength: 250 }}
            name="description"
            type={"text"}
            variant="outlined"
            onChange={handleChange}
            placeholder="Describe the project; students will see this when they join."
          />
        </Grid>
        <Grid xs={12} md={6} sx={styles.centered}>
          <EndDatePicker {...{ setProjectRequest, projectRequest }} />
        </Grid>
        <Grid xs={12} sx={styles.centered}>
          <LoadingButton
            onClick={() => {
              mutate(projectRequest);
            }}
            disabled={isIncomplete}
            variant="contained"
            loading={isLoading}
            sx={styles.button}
          >
            <Typography variant="button">Set Up My Project!</Typography>
          </LoadingButton>
        </Grid>
      </Grid>
    </Box>
  );
};
