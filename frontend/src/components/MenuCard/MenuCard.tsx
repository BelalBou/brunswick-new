// ./components/MenuCard/MenuCard.tsx
import {
  Card,
  CardActionArea,
  CardHeader,
  Typography,
  ImageList,
  ImageListItem,
  Box,
} from "@mui/material";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import MenuCardItem from "../MenuCardItem/MenuCardItem";
import { S3_BASE_URL } from "../../utils/S3Utils/S3Utils";

interface MenuCardProps {
  userLanguage: string;
  menuList: IMenu[];
  onOpenAdd: (menu: IMenu) => void;
}

export default function MenuCard({
  userLanguage,
  menuList,
  onOpenAdd,
}: MenuCardProps) {
  // Filtrer pour avoir des titres uniques
  const uniqueMenus = menuList.filter(
    (value, index, self) =>
      self.map((x) => x.title).indexOf(value.title) === index
  );

  // const sxCard = {
  //   height: "100%",
  //   display: "flex",
  //   flexDirection: "column",
  // };

  // const sxCardMedia = {
  //   paddingTop: "56.25%", // 16:9
  //   "@media (minWidth: 600px)": {
  //     paddingTop: "56.25%", // 16:9
  //   },
  // };

  // const sxCardContent = {
  //   flexGrow: 1,
  // };

  // const sxCardActions = {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   padding: "16px",
  //   "@media (minWidth: 600px)": {
  //     padding: "16px",
  //   },
  // };

  return (
    <ImageList sx={{ width: "100%", pl: 1 }}>
      {uniqueMenus.map((menu) => {
        // Calculer le nombre d'items ayant le même titre
        const count = menuList.filter((x) => x.title === menu.title).length;
        return (
          <ImageListItem key={menu.id}>
            {count > 1 ? (
              <MenuCardItem
                menu={menu}
                userLanguage={userLanguage}
                menuList={menuList}
                onOpenAdd={onOpenAdd}
              />
            ) : (
              <Card sx={{ m: 1 }} raised>
                <CardActionArea onClick={() => onOpenAdd(menu)}>
                  <CardHeader
                    sx={{
                      pb: 1,
                      alignItems: "flex-start",
                      "& .MuiCardHeader-content": { mt: "-8px" },
                    }}
                    action={
                      <Box
                        component="img"
                        src={
                          menu.picture
                            ? `${S3_BASE_URL}/${menu.picture}`
                            : placeHolderIcon
                        }
                        alt="menu"
                        sx={{
                          width: "96px",
                          height: "96px",
                          borderRadius: "3px",
                        }}
                      />
                    }
                    title={
                      <Typography variant="subtitle1" color="text.primary" noWrap>
                        {userLanguage === "en" ? menu.title_en : menu.title}
                      </Typography>
                    }
                    subheader={
                      <>
                        {menu.MenuSize && (
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            {userLanguage === "en"
                              ? menu.MenuSize.title_en
                              : menu.MenuSize.title}
                          </Typography>
                        )}
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          gutterBottom
                          sx={{ wordWrap: "break-word" }}
                        >
                          {userLanguage === "en"
                            ? menu.description_en
                            : menu.description}
                        </Typography>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 550 }}>
                          {`${parseFloat(menu.pricing).toLocaleString("fr", {
                            minimumFractionDigits: 2,
                          })} €`}
                        </Typography>
                      </>
                    }
                  />
                </CardActionArea>
              </Card>
            )}
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}
