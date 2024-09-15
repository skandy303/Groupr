import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { SubmitBioButton } from "./components/SubmitBioButton";
import React, { useState, useEffect, Fragment } from "react";
import { PronounDropDown } from "./components/PronounDropDown";
import { YearDropDown } from "./components/YearDropDown";
import {
  createProfile,
  CreateProfileRequest,
  getProfile,
  UserPronouns,
  UserYear,
} from "api";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { AddSkillInput } from "./components/AddSkillInput";
import rehypeSanitize from "rehype-sanitize";
import { AxiosError } from "axios";
import "./MarkdownStyle.css";
import { useNavigateToProject } from "hooks";

export const CreateBio: React.FC = () => {
  const [bio, setBio] = useState<string | undefined>();
  const [contact, setContact] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();

  const empty = {
    bio: "Tell us about yourself and what you're looking for in a group",
    skills: [],
    year: UserYear.first,
    pronouns: UserPronouns.he,
    contact_details: "Phone, Email, Discord?",
  };

  const [profile, setProfile] = useState<CreateProfileRequest>(empty);

  const id = searchParams.get("project_id") as string;
  const navigateToProject = useNavigateToProject(id);

  const infoText =
    "We will show this information to your group partners once you've found a group.";

  const getProfileMutation = useMutation(getProfile, {
    onError: () => {
      setBio(empty.bio);
      setContact(empty.contact_details);
    },
    onSuccess: (data) => {
      setProfile(data);
      setBio(data.bio);
      setContact(data.contact_details);
    },
  });

  const createProfileMutation = useMutation(createProfile, {
    onError: (error) => {
      if (error instanceof AxiosError) {
        const err = error?.response?.data?.details;
        setErrorMessage("Bio and contact details must not be empty!");
      }
    },
    onSuccess: () => {
      navigateToProject();
    },
  });

  useEffect(() => {
    getProfileMutation.mutate(id);
  }, []);

  const setPronouns = (data: UserPronouns): void => {
    profile.pronouns = data;
  };

  const setYear = (data: UserYear): void => {
    profile.year = data;
  };

  const addSkill = (data: string): void => {
    profile.skills.push(data);
  };

  const deleteSkill = (data: string): void => {
    const updated = profile.skills.filter(
      (skill) => skill.toLowerCase() !== data.toLowerCase()
    );
    profile.skills = updated;
  };

  const onSubmit = (): void => {
    if ((bio as string).length <= 375 && (contact as string).length <= 375) {
      profile.bio = bio as string;
      profile.contact_details = contact as string;
      createProfileMutation.mutate({ request: profile, id });
    } else {
      setErrorMessage("Bio or contact details are too long.");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      maxWidth={800}
      alignItems="center"
      justifyContent={"center"}
      margin="auto"
      marginBottom={10}
      padding={10}
    >
      {errorMessage.length > 0 && (
        <Typography sx={{ color: "red", textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}

      {getProfileMutation.isLoading ? (
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={800}
          alignItems="center"
          justifyContent={"center"}
          margin="auto"
          marginBottom={10}
          padding={10}
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <Fragment>
          <Typography variant="h6" paddingBottom={3}>
            Tell us a bit about yourself
          </Typography>
          <MDEditor
            value={bio}
            onChange={setBio}
            preview={"edit"}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            className="markdown"
          />
          <Box display="flex" flexDirection="row" p={3} alignItems="center">
            <Typography variant="h6">
              What are the best ways to reach you?
            </Typography>
            <Tooltip title={infoText}>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <MDEditor
            value={contact}
            onChange={setContact}
            preview={"edit"}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            className="markdown"
          />
          <AddSkillInput
            propskills={profile.skills}
            add={addSkill}
            del={deleteSkill}
          />
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              <YearDropDown changeYear={setYear} year={profile.year} />
            </Grid>
            <Grid item>
              <PronounDropDown
                changePronouns={setPronouns}
                pronoun={profile.pronouns}
              />
            </Grid>
          </Grid>
          <SubmitBioButton save={onSubmit} />
        </Fragment>
      )}
    </Box>
  );
};
