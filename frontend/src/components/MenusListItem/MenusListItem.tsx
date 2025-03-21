// ./components/MenusListItem/MenusListItem.tsx
import { ListItem, ListItemText, Divider, ListItemIcon, Typography, Box } from "@mui/material";
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
  // Utiliser les versions traduites des textes avec nullish coalescing
  const menuTitle = userLanguage === "en" ? (menu.title_en || menu.title) : menu.title;
  const menuDescription = userLanguage === "en" ? (menu.description_en || menu.description) : menu.description;

  return (
    <>
      <ListItem 
        component="button" 
        onClick={() => onOpenAdd(menu)}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          padding: { xs: 2, sm: 2 },
          textAlign: 'left', // Assurer l'alignement du texte
          color: 'text.primary' // Utiliser la couleur de texte par défaut
        }}
      >
        <Box
          component="img"
          sx={{
            display: { xs: 'block', sm: 'none' },
            width: '100%',
            height: '140px',
            borderRadius: '3px',
            marginBottom: 2,
            objectFit: 'cover'
          }}
          src={menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon}
          alt={menuTitle}
        />
        
        <ListItemText
          sx={{
            maxWidth: { xs: '100%', sm: 'calc(100% - 120px)' },
            overflow: 'hidden',
            color: 'inherit' // Hériter la couleur du parent
          }}
          primary={
            <Typography variant="subtitle1" noWrap color="text.primary">
              {menuTitle}
            </Typography>
          }
          secondary={
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                mt: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {menuDescription}
            </Typography>
          }
        />
        <ListItemIcon 
          sx={{ 
            minWidth: '96px', 
            ml: { xs: 0, sm: 2 },
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'center'
          }}
        >
          <img
            src={menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon}
            alt={menuTitle}
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
