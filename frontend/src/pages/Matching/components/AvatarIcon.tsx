import React from "react";
import { Avatar, useTheme } from "@mui/material";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-bottts-sprites";

interface Props {
  uuid: string;
}

export const AvatarIcon: React.FC<Props> = ({ uuid }) => {
  const theme = useTheme();
  const image = createAvatar(style, {
    seed: uuid,
    // Set to ensure we get uri to source image or else API serves us actual html in response
    dataUri: true,
    backgroundColor: theme.palette.primary.main,
    size: 100,
  });

  return (
    <Avatar
      src={image}
      sx={{ height: "70px", width: "70px" }}
      variant="circular"
    />
  );
};
