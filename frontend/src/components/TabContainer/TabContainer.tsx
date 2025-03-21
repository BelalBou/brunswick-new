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
  const sxContainer = {
    padding: "16px",
    "@media (minWidth: 960px)": {
      paddingLeft: "32px",
      paddingRight: "32px",
    },
  };
  return (
    <Typography
      component="div"
      dir={dir}
      sx={{
        pt: 0,
        pb: theme.spacing(2),
        ...sxContainer,
      }}
    >
      {children}
    </Typography>
  );
}
