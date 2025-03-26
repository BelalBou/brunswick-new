import React, { useState } from "react";
import moment from "moment";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Grid,
  FormControl,
  styled,
  Box
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import fr from "date-fns/locale/fr";
import ISetting from "../../interfaces/ISetting";
import axios from "axios";

interface CartRecapProps {
  is_away: boolean;
  totalPricing: number;
  cart_list: any[];
  userType: string;
  userLanguage: string;
  settingList: ISetting[];
  serverTime: string;
  onValidateShoppingCart: (date: string) => void;
  onContinueShopping: () => void;
  checkDictionnary: (tag: string) => string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  width: "33.33%",
  margin: `${theme.spacing(6)} ${theme.spacing(3)}`,
  [theme.breakpoints.down("sm")]: {
    width: "100%"
  }
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3)
}));

const CenteredBox = styled(Box)({
  display: "flex",
  justifyContent: "center"
});

const CartRecap: React.FC<CartRecapProps> = ({
  is_away: initialIsAway,
  totalPricing,
  cart_list,
  userType,
  userLanguage,
  settingList,
  serverTime: initialServerTime,
  onValidateShoppingCart,
  onContinueShopping,
  checkDictionnary
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hideTimeLabel, setHideTimeLabel] = useState(false);
  const [hideAwayLabel, setHideAwayLabel] = useState(false);
  const [is_away, setIsAway] = useState(initialIsAway);
  const [awayMessage, setAwayMessage] = useState("");
  const [serverTime, setServerTime] = useState(initialServerTime);

  const getServerTime = async () => {
    try {
      const res = await axios.get("/api/orders/check_time/", { withCredentials: true });
      setServerTime(res.data);
    } catch (error) {
      console.error("Error fetching server time:", error);
    }
  };

  const getAwayTime = async (date: Date) => {
    try {
      const res = await axios.get("/api/suppliers/list/", { withCredentials: true });
      const suppliers = res.data;
      const momentDate = moment(date);
      const listIdSupplier: number[] = [];
      let isAway = false;
      let message = "";

      cart_list.forEach((item) => {
        suppliers.forEach((element: any) => {
          if (item.menu.supplier_id === element.id) {
            if (element.away_start && element.away_end) {
              if (momentDate.isBetween(element.away_start, element.away_end) && 
                  !listIdSupplier.includes(element.id)) {
                listIdSupplier.push(element.id);
                isAway = true;
                message += `Le fournisseur ${element.name} est en congé du ${element.away_start} au ${element.away_end} veuillez supprimer de votre panier les produits qui ne sont pas disponibles dans cette période. \n\n`;
              }
            }
          }
        });
      });

      setIsAway(isAway);
      setHideAwayLabel(!isAway);
      setAwayMessage(isAway ? message : "");
    } catch (error) {
      console.error("Error fetching away time:", error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    
    getServerTime();
    getAwayTime(date);
    setSelectedDate(date);

    const today = new Date();
    setHideTimeLabel(moment(date).format("MM-DD-YYYY") !== moment(today).format("MM-DD-YYYY"));
  };

  const isCartValidable = () => {
    if (is_away) return false;
    if (userType === "supplier") return false;

    if (settingList && settingList.length > 0) {
      try {
        const orderDate = moment(selectedDate).format("MM-DD-YYYY") + " " + settingList[0].time_limit;
        const startDate = moment(serverTime).subtract(2, 'hour');
        const endDate = moment(moment(orderDate, "MM-DD-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));

        return startDate.isBefore(endDate);
      } catch (e) {
        console.error("Error validating cart:", e);
        return false;
      }
    }
    return false;
  };

  const renderTimeLimitLabel = () => {
    if (!settingList || settingList.length === 0) return "";
    
    const orderDate = moment(settingList[0].time_limit, "HH:mm:ss").format("HH:mm");
    return `${checkDictionnary("_HEURE_LIMITE")} ${orderDate}`;
  };

  const handleValidateShoppingCart = () => {
    if (!settingList || settingList.length === 0) return;

    const orderDate = moment(selectedDate).format("MM-DD-YYYY") + " " + settingList[0].time_limit;
    const startDate = moment(orderDate, "MM-DD-YYYY HH:mm:ss").format("MM-DD-YYYY HH:mm:ss");
    onValidateShoppingCart(startDate);
  };

  const deliveryTitle = checkDictionnary("_LIVRAISON") + " :";
  const locale = userLanguage === 'fr' ? fr : undefined;

  return (
    <CenteredBox>
      <StyledCard raised>
        <CardContent>
          <StyledTypography gutterBottom variant="h4">
            Total :{" "}
            {totalPricing.toLocaleString("fr", {
              minimumFractionDigits: 2
            })}{" "}
            €
          </StyledTypography>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <DatePicker
                    label={deliveryTitle}
                    value={selectedDate}
                    onChange={handleDateChange}
                    disablePast
                    format="d MMMM yyyy"
                    slotProps={{
                      actionBar: {
                        actions: ['cancel', 'accept']
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <Typography
                sx={{ 
                  display: hideTimeLabel ? 'none' : 'block',
                  marginTop: "1rem"
                }}
                variant="subtitle2"
                color="secondary"
              >
                {renderTimeLimitLabel()}
              </Typography>
              <Typography
                sx={{ 
                  display: hideAwayLabel ? 'none' : 'block',
                  marginTop: "1rem",
                  whiteSpace: "pre-wrap"
                }}
                variant="subtitle2"
                color="secondary"
              >
                {awayMessage}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={onContinueShopping}
          >
            {checkDictionnary("_CONTINUER_MES_ACHATS")}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleValidateShoppingCart}
            disabled={!isCartValidable()}
          >
            {checkDictionnary("_VALIDER_MA_COMMANDE")}
          </Button>
        </CardActions>
      </StyledCard>
    </CenteredBox>
  );
};

export default CartRecap;
