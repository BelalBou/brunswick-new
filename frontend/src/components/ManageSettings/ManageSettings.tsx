import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import moment from "moment";
// @ts-ignore
import "moment/locale/fr";
import {
  Typography,
  Tooltip,
  IconButton,
  Box,
  Paper,
  Container,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MenuBar from "../MenuBar/MenuBar";
import Footer from "../Footer/Footer";
// @ts-ignore
import Table from "../Table/Table";
import SnackbarAction from "../SnackbarAction/SnackbarAction";
import EditSetting from "../EditSetting/EditSetting";
import checkDictionnary from "../../utils/CheckDictionnary/CheckDictionnary";
import ISetting from "../../interfaces/ISetting";
// import IDailyMail from "../../interfaces/IDailyMail";
// @ts-ignore
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getDictionnaries,
  getSettings,
  getDailyMails,
  editSetting,
  logout,
} from "../../store/thunks";
// @ts-ignore
import { RootState } from "../../store/store";

moment.locale("fr");

interface ManageSettingsProps {
  selected: number;
  isLoginSuccess: boolean;
  isListPending: boolean;
  isEditSuccess: boolean;
  userType: string;
  userToken: string;
  userLanguage: string;
  dictionaryList: any[];
  settingList: ISetting[];
  dailyMailList: any[];
}

const ManageSettings: React.FC<ManageSettingsProps> = ({
  selected,
  isLoginSuccess,
  isListPending,
  isEditSuccess,
  userType,
  userToken,
  userLanguage,
  dictionaryList,
  settingList,
  dailyMailList
}) => {
  const dispatch = useAppDispatch();

  const [openEdit, setOpenEdit] = useState(false);
  const [edited, setEdited] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [editTimeLimit, setEditTimeLimit] = useState("11:00");
  const [editStartPeriod, setEditStartPeriod] = useState(0);
  const [editEndPeriod, setEditEndPeriod] = useState(0);
  const [editEmailOrderCc, setEditEmailOrderCc] = useState("");
  const [editEmailSupplierCc, setEditEmailSupplierCc] = useState("");
  const [editEmailVendorCc, setEditEmailVendorCc] = useState("");

  useEffect(() => {
    if (isLoginSuccess) {
      refresh();
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    if (userToken) {
      refresh();
    }
  }, [userToken]);

  useEffect(() => {
    if (isEditSuccess && edited) {
      refresh();
    }
  }, [isEditSuccess, edited]);

  const refresh = () => {
    if (userType === "administrator") {
      dispatch(getDictionnaries());
      dispatch(getSettings());
      dispatch(getDailyMails());
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChangeSelected = (selected: number) => {
    localStorage.setItem("selected", selected.toString());
  };

  const handleCloseSnackbarEdited = () => {
    setEdited(false);
  };

  const checkDictionnaryValue = (tag: string) => {
    return checkDictionnary(tag, dictionaryList, userLanguage);
  };

  const handleTableColumns = () => {
    return [
      {
        name: "timeLimit",
        title: "Heure limite",
      },
      {
        name: "startPeriod",
        title: "Jour de début",
      },
      {
        name: "endPeriod",
        title: "Jour de fin",
      },
      {
        name: "emailOrderCc",
        title: "E-mails commandes",
      },
      {
        name: "emailSupplierCc",
        title: "E-mails fournisseurs",
      },
      {
        name: "emailVendorCc",
        title: "E-mails caissiers",
      },
      {
        name: "action",
        title: "Action",
      },
    ];
  };

  const handleTableRows = () => {
    if (settingList && settingList.length > 0) {
      return settingList.map((setting: ISetting) => {
        return {
          timeLimit: setting.time_limit ? moment(setting.time_limit, 'HH:mm:ss').format('HH:mm') : "11:00",
          startPeriod: moment.weekdays(true)[setting.start_period],
          endPeriod: moment.weekdays(true)[setting.end_period],
          emailOrderCc: setting.email_order_cc,
          emailSupplierCc: setting.email_supplier_cc,
          emailVendorCc: setting.email_vendor_cc,
          action: (
            <Tooltip title="Éditer ce paramètre">
              <IconButton
                color="primary"
                onClick={() =>
                  handleOpenEdit(
                    setting.id,
                    setting.time_limit ? moment(setting.time_limit, 'HH:mm:ss').format('HH:mm') : "11:00",
                    setting.start_period,
                    setting.end_period,
                    setting.email_order_cc,
                    setting.email_supplier_cc,
                    setting.email_vendor_cc
                  )
                }
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          ),
        };
      });
    }
    return [];
  };

  const handleOpenEdit = (
    id: number,
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => {
    setEditId(id);
    setEditTimeLimit(timeLimit);
    setEditStartPeriod(startPeriod);
    setEditEndPeriod(endPeriod);
    setEditEmailOrderCc(emailOrderCc);
    setEditEmailSupplierCc(emailSupplierCc);
    setEditEmailVendorCc(emailVendorCc);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleEdit = (
    timeLimit: string,
    startPeriod: number,
    endPeriod: number,
    emailOrderCc: string,
    emailSupplierCc: string,
    emailVendorCc: string
  ) => {
    if (editId > 0) {
      dispatch(
        editSetting(
          editId,
          timeLimit,
          startPeriod,
          endPeriod,
          emailOrderCc,
          emailSupplierCc,
          emailVendorCc
        )
      );
    }
    setOpenEdit(false);
    setEdited(true);
  };

  if (!isLoginSuccess || userType !== "administrator") {
    return <Navigate to="/login" />;
  }

  const lastDailyMail = dailyMailList && dailyMailList.length > 0
    ? moment(dailyMailList[0].date).format("dddd DD MMMM à HH:mm")
    : "N/A";

  return (
    <MenuBar
      isLoginSuccess={isLoginSuccess}
      isListPending={isListPending}
      userType={userType}
      selected={selected}
      title="Paramètres"
      onLogout={handleLogout}
      onChangeSelected={handleChangeSelected}
      checkDictionnary={checkDictionnaryValue}
    >
      {isEditSuccess && edited && (
        <SnackbarAction
          success
          message="Le paramètre a bien été modifié !"
          onClose={handleCloseSnackbarEdited}
        />
      )}
      {openEdit && (
        <EditSetting
          timeLimit={editTimeLimit}
          startPeriod={editStartPeriod}
          endPeriod={editEndPeriod}
          emailOrderCc={editEmailOrderCc}
          emailSupplierCc={editEmailSupplierCc}
          emailVendorCc={editEmailVendorCc}
          onClose={handleCloseEdit}
          onEdit={handleEdit}
        />
      )}
      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography
              color="textPrimary"
              variant="h5"
              gutterBottom
              align="center"
              sx={{ pt: 5 }}
            >
              Dernier envoi de l'e-mail de confirmation de commandes :
            </Typography>
            <Typography
              color="primary"
              variant="h6"
              gutterBottom
              align="center"
            >
              {lastDailyMail}
            </Typography>
            <Table
              rows={handleTableRows()}
              columns={handleTableColumns()}
            />
          </Paper>
        </Container>
      </Box>
      <Footer />
    </MenuBar>
  );
};

export default ManageSettings;
