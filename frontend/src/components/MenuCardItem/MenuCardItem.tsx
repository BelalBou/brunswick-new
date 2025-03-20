// ./components/MenusCardItem/MenusCardItem.tsx
import { Card, CardActionArea, CardHeader, Typography } from "@mui/material";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import { S3_BASE_URL } from "../../utils/S3Utils/S3Utils";

interface MenusCardItemProps {
  menu: IMenu;
  userLanguage: string;
  menuList: IMenu[]; // Cette prop est conservée, même si non utilisée ici.
  onOpenAdd: (menu: IMenu) => void;
}

export default function MenusCardItem({
  menu,
  userLanguage,
  onOpenAdd,
}: MenusCardItemProps) {
  return (
    <Card sx={{ m: 1 }} raised>
      <CardActionArea onClick={() => onOpenAdd(menu)}>
        <CardHeader
          sx={{
            pb: 1,
            alignItems: "flex-start",
            "& .MuiCardHeader-content": { mt: -1 },
          }}
          action={
            <img
              src={menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon}
              alt="menu"
              style={{ width: "96px", height: "96px", borderRadius: "3px" }}
            />
          }
          title={
            <Typography variant="subtitle1" noWrap>
              {userLanguage === "en" ? menu.title_en : menu.title}
            </Typography>
          }
          subheader={
            <Typography variant="body1" color="text.secondary" sx={{ wordWrap: "break-word" }}>
              {userLanguage === "en" ? menu.description_en : menu.description}
            </Typography>
          }
        />
      </CardActionArea>
    </Card>
  );
}
