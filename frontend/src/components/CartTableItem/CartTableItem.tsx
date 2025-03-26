import React, { useState, useCallback } from "react";
import {
  IconButton,
  Input,
  TableCell,
  TableRow,
  Tooltip,
  TextField,
  Typography,
  InputAdornment,
  List,
  ListItem,
  Button,
  ListItemText,
  ListSubheader,
  styled
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "@mui/icons-material/Info";
import CommentIcon from "@mui/icons-material/Comment";
import BugReportIcon from "@mui/icons-material/BugReport";
import WarningIcon from "@mui/icons-material/Warning";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";
import { debounce } from 'lodash';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    border: 0,
    padding: theme.spacing(2)
  }
}));

const StyledTypography = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}));

const BodyTypography = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center"
}));

const StyledIcon = styled(InfoIcon)(({ theme }) => ({
  marginRight: theme.spacing(1)
}));

const StyledCommentIcon = styled(CommentIcon)({
  color: "rgba(0, 0, 0, 0.54)"
});

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1)
}));

interface CartTableItemProps {
  item: ICart;
  readOnly: boolean;
  userType: string;
  userLanguage: string;
  onEditShoppingCart: (
    item: ICart,
    quantity: number,
    remark: string,
    extras: IExtra[]
  ) => void;
  onDeleteShoppingCart: (item: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const CartTableItem: React.FC<CartTableItemProps> = ({
  item,
  readOnly = false,
  userType,
  userLanguage,
  onEditShoppingCart,
  onDeleteShoppingCart,
  checkDictionnary
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [remark, setRemark] = useState(item.remark);
  const [expanded, setExpanded] = useState(false);

  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    let qty = parseInt(value) > 9999 ? 9999 : parseInt(value);
    setQuantity(qty);

    if (qty > 0) {
      onEditShoppingCart(item, qty, remark, []);
    }
  };

  const emitChange = useCallback((value: string) => {
    onEditShoppingCart(item, quantity, value, []);
  }, [item, quantity, onEditShoppingCart]);

  const debouncedEmitChange = useCallback(
    debounce(emitChange, 500),
    [emitChange]
  );

  const handleChangeRemark = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRemark = event.target.value;
    setRemark(newRemark);
    debouncedEmitChange(newRemark);
  };

  const handleChangeExpanded = () => {
    setExpanded(!expanded);
  };

  const handleDeleteShoppingCart = () => {
    onDeleteShoppingCart(item);
  };

  return (
    <>
      <StyledTableRow>
        <TableCell>
          <Typography variant="subtitle1">
            <IconButton onClick={handleChangeExpanded}>
              {!expanded ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
            </IconButton>{" "}
            {userLanguage === "en" ? item.menu.title_en : item.menu.title}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="subtitle1">
            {item.menu.MenuSize
              ? userLanguage === "en"
                ? item.menu.MenuSize.title_en
                : item.menu.MenuSize.title
              : "/"}
          </Typography>
        </TableCell>
        {userType !== "supplier" && (
          <TableCell align="right">
            <Typography variant="subtitle1">
              {`${parseFloat(item.menu.pricing).toLocaleString("fr", {
                minimumFractionDigits: 2
              })}`}{" "}
              €
            </Typography>
          </TableCell>
        )}
        <TableCell>
          <Input
            value={quantity}
            type="number"
            inputProps={{ min: "1", max: "9999", step: "1" }}
            disabled={readOnly}
            onChange={handleChangeQuantity}
          />
        </TableCell>
        {userType !== "supplier" && (
          <TableCell>
            <Tooltip title={checkDictionnary("_SUPPRIMER_CE_MENU")}>
              <StyledButton
                color="secondary"
                onClick={handleDeleteShoppingCart}
                disabled={readOnly}
              >
                {checkDictionnary("_SUPPRIMER")}
              </StyledButton>
            </Tooltip>
          </TableCell>
        )}
      </StyledTableRow>
      {item.extras && item.extras.length > 0 && (
        <StyledTableRow>
          <TableCell colSpan={5}>
            <List
              component="nav"
              subheader={
                <ListSubheader component="div">
                  {checkDictionnary("_SUPPLEMENTS")}
                </ListSubheader>
              }
            >
              {item.extras.map(extra => (
                <ListItem key={extra.id} component="div">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {`${
                          userLanguage === "en" ? extra.title_en : extra.title
                        } (+ ${(
                          parseFloat(extra.pricing) * quantity
                        ).toLocaleString("fr", {
                          minimumFractionDigits: 2
                        })} €)`}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </TableCell>
        </StyledTableRow>
      )}
      <StyledTableRow>
        <TableCell colSpan={5} align="center">
          {item.menu.order_menus &&
            item.menu.order_menus.article_not_retrieved && (
              <StyledTypography
                variant="subtitle1"
                color="secondary"
                align="center"
              >
                <WarningIcon />{" "}
                {checkDictionnary("_ARTICLE_NON_RECUPERE")}
              </StyledTypography>
            )}
          <TextField
            id="outlined-full-width"
            placeholder={checkDictionnary("_REMARQUES")}
            fullWidth
            margin="normal"
            variant="outlined"
            value={remark}
            onChange={handleChangeRemark}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledCommentIcon />
                </InputAdornment>
              )
            }}
            disabled={readOnly}
          />
        </TableCell>
      </StyledTableRow>
      {expanded && (
        <StyledTableRow>
          <TableCell colSpan={5}>
            <List>
              {item.menu.description && (
                <ListItem>
                  <BodyTypography
                    variant="body1"
                    color="textSecondary"
                    gutterBottom
                  >
                    <StyledIcon />
                    {userLanguage === "en"
                      ? item.menu.description_en
                      : item.menu.description}
                  </BodyTypography>
                </ListItem>
              )}
              {item.menu.Allergy && item.menu.Allergy.length > 0 && (
                <ListItem>
                  <BodyTypography
                    variant="body1"
                    color="secondary"
                    gutterBottom
                  >
                    <BugReportIcon color="secondary" sx={{ mr: 1 }} />
                    {item.menu.Allergy.map(allergy =>
                      userLanguage === "en"
                        ? allergy.description_en
                        : allergy.description
                    ).join(", ")}
                  </BodyTypography>
                </ListItem>
              )}
            </List>
          </TableCell>
        </StyledTableRow>
      )}
    </>
  );
};

export default CartTableItem;
