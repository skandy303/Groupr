import React, { Fragment } from "react";
import { Box, Chip } from "@mui/material";
import { SkillArray } from "./interfaces";
import { styles } from "./styles";

interface Props extends React.PropsWithChildren {
  skills: SkillArray;
  deleteSkill?: (skill: string) => void;
}

export const SkillDisplay: React.FC<Props> = ({ skills, deleteSkill }) => {
  return (
    <Box sx={styles.skillDisplay}>
      {skills.map((data) => {
        return (
          <Fragment key={data.label}>
            {deleteSkill !== undefined ? (
              <Chip
                label={data.label}
                onDelete={() => deleteSkill(data.label)}
                sx={{ p: 1, m: 1 }}
              />
            ) : (
              <Chip label={data.label} />
            )}
          </Fragment>
        );
      })}
    </Box>
  );
};
