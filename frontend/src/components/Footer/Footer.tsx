// Footer.tsx
import { styled } from "@mui/material/styles";
import { Typography, Link } from "@mui/material";

/** 
 * On définit un footer "root" stylé via styled(). 
 * Même rendu que "backgroundColor: theme.palette.background.paper; padding: theme.spacing(2)" 
 */
const FooterRoot = styled("footer")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

export default function Footer() {
  return (
    <FooterRoot>
      <Typography variant="subtitle1" align="center" color="text.secondary">
        Copyright © 2019{" "}
        <Link href="https://brunswick.com/" target="_blank">
          Brunswick
        </Link>
        . All Rights Reserved.
      </Typography>
    </FooterRoot>
  );
}
