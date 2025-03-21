// ./components/MenuCard/MenusList.tsx
import { Fragment } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Typography,
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

  const sxList = {
    width: "100%",
    "@media (minWidth: 600px)": {
      width: "100%",
    },
  };

  // const sxListItem = {
  //   "@media (minWidth: 600px)": {
  //     padding: "16px",
  //   },
  // };

  // const sxListItemText = {
  //   "@media (minWidth: 600px)": {
  //     marginRight: "16px",
  //   },
  // };

  return (
    <List sx={sxList}>
      {filteredMenuList.map((menu) => (
        <Fragment key={menu.id}>
          {menuList.filter((x) => x.title === menu.title).length > 1 ? (
            <MenusListItem
              menu={menu}
              userLanguage={userLanguage}
              menuList={menuList}
              onOpenAdd={onOpenAdd}
            />
          ) : (
            <>
              <ListItem component="button" onClick={() => onOpenAdd(menu)}>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" noWrap>
                      {menu.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      {menu.MenuSize && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1, display: 'inline-block', width: '100%' }}
                        >
                          {userLanguage === "en"
                            ? menu.MenuSize.title_en
                            : menu.MenuSize.title}
                        </Typography>
                      )}
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'inline-block', width: '100%' }}
                        noWrap
                      >
                        {menu.description ? (
                          <span>
                            {menu.description}
                            <br />
                          </span>
                        ) : (
                          ""
                        )}
                      </Typography>
                      <Typography
                        component="span"
                        variant="subtitle1"
                        color="primary"
                        sx={{ fontWeight: 550, mt: 1, display: 'inline-block', width: '100%' }}
                      >
                        {parseFloat(menu.pricing).toLocaleString("fr", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </Typography>
                    </>
                  }
                />
                <ListItemIcon>
                  <img
                    src={
                      menu.picture
                        ? `${S3_BASE_URL}/${menu.picture}`
                        : placeHolderIcon
                    }
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
          )}
        </Fragment>
      ))}
    </List>
  );
}
