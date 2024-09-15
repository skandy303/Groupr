// Disable warnings about async function in onClick
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/promise-function-async */
import React from "react";

import { IconButton } from "@mui/material";
import { ContentCopy } from "@mui/icons-material/";

interface CopyIconProps {
  toCopy: string;
}

export const CopyIcon: React.FC<CopyIconProps> = ({ toCopy }) => {
  // eslint-disable-next-line
  const copyTextToClipboard = async () => {
    await navigator.clipboard.writeText(toCopy);
  };

  return (
    <IconButton edge="end" onClick={() => copyTextToClipboard()}>
      <ContentCopy />
    </IconButton>
  );
};
