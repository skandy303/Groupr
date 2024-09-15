import React, { Fragment, useState } from "react";
import { getCandidate, decideOnCandidate, InteractionResponse } from "api";
import { SingleCandidatePage } from "./components/SingleCandidatePage";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useOnMount } from "hooks";
import { NoCandidates } from "./components/NoCandidates";
import { CandidateSlider } from "./components/CandidateSlider";
import { CandidateDecision } from "./components/CandidateDecision";
import { Matched } from "./components/Matched";
import {
  Box,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { styles } from "./components/styles";
import { PROJECT_COLORS } from "../../constants";
import seedrandom from "seedrandom";

export const MatchingPage: React.FC = () => {
  const {
    isLoading: candidateLoading,
    isError,
    data: candidateResponse,
    mutate,
  } = useMutation(getCandidate);

  const {
    data: didMatch,
    mutate: decide,
    isLoading: didMatchLoading,
  } = useMutation(decideOnCandidate, {
    onSuccess: (data: InteractionResponse) => {
      if (!data.matched) fetchCandidate();
    },
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const project_id = searchParams.get("project_id");

  const rng = seedrandom(project_id || "");
  const color = PROJECT_COLORS[Math.round(rng() * (PROJECT_COLORS.length - 1))];
  const theme = createTheme({
    palette: {
      primary: {
        main: color,
        contrastText: "white",
      },
    },
  });

  const fetchCandidate = (): void => {
    if (project_id !== null) mutate({ project_id });
  };

  useOnMount(() => {
    if (project_id === null || project_id === "") {
      navigate("/projects/");
    }
    fetchCandidate();
  });

  if (candidateLoading || didMatchLoading) {
    return (
      <Box sx={styles.topLevelBox}>
        <CircularProgress />
      </Box>
    );
  }

  // Project doesn't exist
  if (isError) navigate("/projects/");

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (project_id !== null && candidateResponse?.candidates) {
    if (candidateResponse.no_candidates) {
      return (
        <Fragment>
          <NoCandidates {...{ project_id }} />
        </Fragment>
      );
    }

    // Unpack depending on if we have a group or single candidate
    const { candidates, group } = candidateResponse;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const uuid = group?.uuid || candidates[0].student.uuid;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const name = group?.group_name || candidates[0].student.name;

    const makeDecision = (liked: boolean): void => {
      decide({ liked, project_id, uuid });
    };

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (didMatch?.matched) {
      return (
        <ThemeProvider theme={theme}>
          <Matched {...{ name, project_id }} />
        </ThemeProvider>
      );
    }

    return candidateResponse.candidates.length > 1 ? (
      <ThemeProvider theme={theme}>
        <CandidateSlider {...{ candidates, group_name: name }} />
        <CandidateDecision
          {...{ name, fetchCandidate, makeDecision, project_id }}
        />
      </ThemeProvider>
    ) : (
      <ThemeProvider theme={theme}>
        <Box display="flex" padding={3} justifyContent={"center"}>
          <SingleCandidatePage
            {...{
              candidate: candidates[0],
              fetchCandidate,
              makeDecision,
              project_id,
            }}
          />
        </Box>
        <CandidateDecision
          {...{ name, fetchCandidate, makeDecision, project_id }}
        />
      </ThemeProvider>
    );
  }

  return <></>;
};
