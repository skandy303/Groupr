import { Candidate } from "api";
import React, { Fragment, useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { styles } from "./styles";
import "pages/CreateBio/MarkdownStyle.css";
import { SkillDisplay, SkillArray } from "pages/CreateBio";
import { AvatarIcon } from "./AvatarIcon";

interface Props {
  candidate: Candidate;
}

export const SingleCandidatePage: React.FC<Props> = ({ candidate }) => {
  const { profile, student } = candidate;
  const { bio, skills, pronouns, year, contact_details } = profile;

  const getSkillArray = (): SkillArray => {
    return skills.map((skill) => ({ label: skill }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const skillArray = useMemo(() => getSkillArray(), [skills]);

  return (
    <Box
      sx={{
        boxShadow: { xs: 0, md: 3 },
        display: "flex",
        flexDirection: "column",
        padding: 5,
        width: 600,
        margin: 1,
      }}
      data-color-mode="light"
    >
      <Box display="flex" justifyContent={"space-between"}>
        <Box>
          <Typography variant="h4">{student.name}</Typography>
          <Typography variant="subtitle1">{pronouns}</Typography>
          <Typography variant="subtitle2">Year {year}</Typography>
        </Box>
        <Box>
          <AvatarIcon {...{ uuid: student.uuid }} />
        </Box>
      </Box>
      {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        contact_details ? (
          <Fragment>
            <Typography variant="h6">About & Contact Details:</Typography>
            <MDEditor
              value={bio + "\n#### Contact Details\n" + contact_details}
              style={{ whiteSpace: "pre-wrap" }}
              className="markdown"
              visibleDragbar={false}
              hideToolbar={true}
              preview={"preview"}
            />
          </Fragment>
        ) : (
          <Fragment>
            <Typography variant="h6">About:</Typography>
            <MDEditor
              visibleDragbar={false}
              value={bio}
              style={{ whiteSpace: "pre-wrap" }}
              className="markdown"
              hideToolbar={true}
              preview={"preview"}
            />
          </Fragment>
        )
      }
      {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        skills.length ? (
          <Fragment>
            <Typography variant="h6" p={1}>
              {student.name}'s Top Skills
            </Typography>
            <SkillDisplay {...{ skills: skillArray }} />
          </Fragment>
        ) : (
          <> </>
        )
      }
    </Box>
  );
};
