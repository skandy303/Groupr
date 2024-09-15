import React, { useEffect } from "react";
import { SkillDisplay } from "./SkillDisplay";
import { SkillArray } from "./interfaces";
import { styles } from "./styles";
import { TextField, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Label } from "@mui/icons-material";

interface Props extends React.PropsWithChildren {
  propskills: string[];
  add: (data: string) => void;
  del: (data: string) => void;
}

export const AddSkillInput: React.FC<Props> = ({ propskills, add, del }) => {
  const MAX_LENGTH = 3;
  const [skill, setSkill] = React.useState("");
  const [error, setError] = React.useState("");
  const [skills, setSkills] = React.useState<SkillArray>([]);

  useEffect(() => {
    var preset: SkillArray;
    preset = propskills.map((pskill) => ({ label: pskill }));
    setSkills(preset);
  }, []);

  const addSkill = (): void => {
    const trimmedSkill = skill.trim();
    const exists =
      skills.filter(
        (skill) => skill.label.toLowerCase() === trimmedSkill.toLowerCase()
      ).length > 0;

    if (exists && trimmedSkill !== "") {
      setError("You already added this skill!");
      return;
    }

    if (trimmedSkill === "") {
      setError("Can't add an empty skill :P");
      return;
    }

    setError("");
    setSkills([...skills, { label: skill }]);
    setSkill("");
    add(skill);
  };

  const deleteSkill = (toDelete: string): void => {
    const updated = skills.filter(
      (skill) => skill.label.toLowerCase() !== toDelete.toLowerCase()
    );
    setSkills(updated);
    del(toDelete);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setSkill(e.target.value);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== "Enter") {
      return;
    }
    addSkill();
  };

  return (
    <Grid container paddingTop={5}>
      <Grid xs={12} sx={styles.centeredRow}>
        <Typography variant="h6">
          Tell us 3 skills you bring to this project
        </Typography>
      </Grid>
      <Grid xs={12} sx={styles.centeredRow}>
        <TextField
          sx={styles.textField}
          name="skill"
          size="small"
          type={"text"}
          value={skill}
          variant="outlined"
          placeholder="Enter a skill"
          onChange={handleChange}
          onKeyDown={handleEnter}
          error={error.length > 0}
          disabled={skills.length === MAX_LENGTH}
        />
        <Button
          sx={styles.button}
          variant="contained"
          onClick={addSkill}
          disabled={skills.length === MAX_LENGTH}
        >
          <Typography variant="button">Add</Typography>
        </Button>
      </Grid>
      <Grid xs={12} sx={styles.centeredRow}>
        {error.length > 0 ? (
          <Typography variant="body1" sx={{ color: "red" }}>
            {error}
          </Typography>
        ) : (
          <></>
        )}
      </Grid>
      <Grid xs={12} sx={styles.centeredRow}>
        <SkillDisplay {...{ skills, deleteSkill }} />
      </Grid>
    </Grid>
  );
};
