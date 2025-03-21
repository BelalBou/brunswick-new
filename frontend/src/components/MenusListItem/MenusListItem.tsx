// ./components/MenusListItem/MenusListItem.tsx
import { ListItem, ListItemText, Divider, ListItemIcon, Typography } from "@mui/material";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import { S3_BASE_URL } from "../../utils/S3Utils/S3Utils";

interface MenusListItemProps {
  menu: IMenu;
  userLanguage: string;
  menuList: IMenu[]; // conservé si nécessaire
  onOpenAdd: (menu: IMenu) => void;
}

export default function MenusListItem({
  menu,
  userLanguage,
  onOpenAdd,
}: MenusListItemProps) {
  return (
    <>
      <ListItem component="button" onClick={() => onOpenAdd(menu)}>
        <ListItemText
          sx={{
            maxWidth: 'calc(100% - 120px)', // Réserver l'espace pour l'image
            overflow: 'hidden'
          }}
          primary={
            <Typography variant="subtitle1" noWrap>
              {userLanguage === "en" ? menu.title_en : menu.title}
            </Typography>
          }
          secondary={
            <Typography variant="body1" color="text.secondary" 
              sx={{ 
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {userLanguage === "en" ? menu.description_en : menu.description}
            </Typography>
          }
        />
        <ListItemIcon sx={{ minWidth: '96px', ml: 2 }}>
          <img
            src={menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon}
            alt="menu"
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "3px",
            }}
          />
        </ListItemIcon>
      </ListItem>
      <Divider />
    </>
  );
}
