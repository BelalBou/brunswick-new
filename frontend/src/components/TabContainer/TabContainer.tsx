// ./components/TabContainer/TabContainer.tsx
import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface TabContainerProps {
  children: React.ReactNode;
  dir?: string;
}

export default function TabContainer({ children, dir }: TabContainerProps) {
  const theme = useTheme();
  return (
    <Typography
      component="div"
      dir={dir}
      sx={{
        pt: 0,
        pb: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
          pl: theme.spacing(2),
          pr: theme.spacing(2),
        },
      }}
    >
      {children}
    </Typography>
  );
}
