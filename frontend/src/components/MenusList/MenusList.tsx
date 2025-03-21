// ./components/MenuCard/MenusList.tsx
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Box
} from "@mui/material";
import MenusListItem from "../MenusListItem/MenusListItem";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import { S3_BASE_URL }  from "../../utils/S3Utils/S3Utils";

interface MenusListProps {
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

export default function MenusList({
  userLanguage,
  menuList,
  onOpenAdd,
}: MenusListProps) {
  // Filtrer pour obtenir les menus dont menu_size_id est identique (si défini)
  const filteredMenuList = menuList.filter((menu) =>
    menu.menu_size_id ? menu.menu_size_id === menuList[0].menu_size_id : true
  );

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {filteredMenuList.map((menu) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={menu.id}>
            {menuList.filter((x) => x.title === menu.title).length > 1 ? (
              <MenusListItem
                menu={menu}
                userLanguage={userLanguage}
                menuList={menuList}
                onOpenAdd={onOpenAdd}
              />
            ) : (
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea onClick={() => onOpenAdd(menu)} sx={{ height: '100%' }}>
                  <Box sx={{ display: 'flex', padding: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }}>
                      <Typography variant="subtitle1" component="div" gutterBottom noWrap>
                        {menu.title}
                      </Typography>
                      
                      {menu.MenuSize && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {userLanguage === "en"
                            ? menu.MenuSize.title_en
                            : menu.MenuSize.title}
                        </Typography>
                      )}
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                        noWrap
                      >
                        {menu.description || ""}
                      </Typography>
                      
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        sx={{ fontWeight: 550, mt: 1 }}
                      >
                        {parseFloat(menu.pricing).toLocaleString("fr", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </Typography>
                    </Box>
                    
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: 96, 
                        height: 96, 
                        borderRadius: 1,
                        objectFit: 'cover'
                      }}
                      image={menu.picture ? `${S3_BASE_URL}/${menu.picture}` : placeHolderIcon}
                      alt={menu.title}
                    />
                  </Box>
                </CardActionArea>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
