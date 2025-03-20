// ./thunks/orderThunks.ts

import axios from "axios";
import moment from "moment";
import { AppDispatch } from "../store";

// Import des actions "order" depuis le slice
import {
  setOrderList,
  setOrderListSpread,
  setOrderExtraList,
  setOrderListTotalCount
} from "../slices/orderSlice";

// Import des actions "add", "edit", "delete", "list" depuis leurs slices
import { setAddPending, setAddSuccess, setAddError } from "../slices/addSlice";
import { setEditPending, setEditSuccess, setEditError } from "../slices/editSlice";
import { setDeletePending, setDeleteSuccess, setDeleteError } from "../slices/deleteSlice";
import { setListPending, setListSuccess, setListError } from "../slices/listSlice";

// Import de l'action cart si tu en as fait un cartSlice...
import { setCartList } from "../slices/cartSlice"; // exemple si tu as migré cart en slice

// Authentification
const userLS = localStorage.getItem("user") || null;
const tokenLS = userLS ? JSON.parse(userLS).token : "";
axios.defaults.headers.common["authorization"] = `Bearer ${tokenLS}`;

/** ---------------------------
 *  addOrder
 */
function addOrderDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setAddSuccess(!!res.data));
    if (!res.data) {
      dispatch(setAddError("Add order failed!"));
    } else {
      // On vide le panier
      dispatch(setCartList([]));
      // On recharge la liste des commandes pour le customer
      dispatch(getOrdersForCustomer());
    }
  };
}

export const addOrder = (userId: number, menus: Object[], date: string) => async (dispatch: AppDispatch) => {
  dispatch(setAddPending(true));
  dispatch(setAddSuccess(false));
  dispatch(setAddError(""));

  try {
    const res = await axios.post(`/api/orders/add/`, { userId, menus, date });
    dispatch(addOrderDispatch(res));
  } catch (err: any) {
    dispatch(setAddError(String(err)));
  } finally {
    dispatch(setAddPending(false));
  }
};

/** ---------------------------
 *  deleteOrders
 */
function deleteOrdersDispatch(
  res: any,
  forCustomer: boolean,
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete order failed!"));
    } else {
      if (!forCustomer) {
        // On réutilise la fonction filterOrdersDispatch
        dispatch(
          filterOrdersDispatch(
            limit,
            offset,
            selectedFilter,
            selectedDate,
            selectedSupplierIds,
            selectedCustomerIds
          )
        );
      } else {
        dispatch(getOrdersForCustomer(limit, offset));
      }
    }
  };
}

export const deleteOrders = (
  id: number,
  forCustomer: boolean,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => async (dispatch: AppDispatch) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.delete(`/api/orders/delete/${id}`);
    dispatch(
      deleteOrdersDispatch(
        res,
        forCustomer,
        limit,
        offset,
        selectedFilter,
        selectedDate,
        selectedSupplierIds,
        selectedCustomerIds
      )
    );
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

/** ---------------------------
 *  editOrder
 */
function editOrderDispatch(
  res: any,
  forCustomer: boolean,
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit order failed!"));
    } else {
      if (!forCustomer) {
        dispatch(
          filterOrdersDispatch(
            limit,
            offset,
            selectedFilter,
            selectedDate,
            selectedSupplierIds,
            selectedCustomerIds
          )
        );
      } else {
        dispatch(getOrdersForCustomer(limit, offset));
      }
    }
  };
}

export const editOrder = (
  orderId: number,
  menuId: number,
  quantity: number,
  remark: string,
  forCustomer: boolean,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => async (dispatch: AppDispatch) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/orders/edit_menu/`, { orderId, menuId, quantity, remark });
    dispatch(
      editOrderDispatch(
        res,
        forCustomer,
        limit,
        offset,
        selectedFilter,
        selectedDate,
        selectedSupplierIds,
        selectedCustomerIds
      )
    );
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

/** ---------------------------
 *  editArticleCarriedAway
 */
function editArticleCarriedAwayDispatch(res: any, selectedDate: string) {
  return (dispatch: AppDispatch) => {
    dispatch(setEditSuccess(!!res.data));
    if (!res.data) {
      dispatch(setEditError("Edit article carried away failed!"));
    } else {
      // On recharge la liste pour la date
      dispatch(getOrdersForDate(selectedDate));
    }
  };
}

export const editArticleCarriedAway = (
  orderId: number,
  menuId: number,
  checked: boolean,
  selectedDate: string
) => async (dispatch: AppDispatch) => {
  dispatch(setEditPending(true));
  dispatch(setEditSuccess(false));
  dispatch(setEditError(""));

  try {
    const res = await axios.put(`/api/orders/edit_article_carried_away/`, {
      orderId,
      menuId,
      checked
    });
    dispatch(editArticleCarriedAwayDispatch(res, selectedDate));
  } catch (err: any) {
    dispatch(setEditError(String(err)));
  } finally {
    dispatch(setEditPending(false));
  }
};

/** ---------------------------
 *  deleteOrder
 */
function deleteOrderDispatch(
  res: any,
  forCustomer: boolean,
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    dispatch(setDeleteSuccess(!!res.data));
    if (!res.data) {
      dispatch(setDeleteError("Delete menu from order failed!"));
    } else {
      if (!forCustomer) {
        dispatch(
          filterOrdersDispatch(
            limit,
            offset,
            selectedFilter,
            selectedDate,
            selectedSupplierIds,
            selectedCustomerIds
          )
        );
      } else {
        dispatch(getOrdersForCustomer(limit, offset));
      }
    }
  };
}

export const deleteOrder = (
  orderId: number,
  menuId: number,
  forCustomer: boolean,
  limit: number = 0,
  offset: number = 0,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) => async (dispatch: AppDispatch) => {
  dispatch(setDeletePending(true));
  dispatch(setDeleteSuccess(false));
  dispatch(setDeleteError(""));

  try {
    const res = await axios.put(`/api/orders/delete_menu/`, { orderId, menuId });
    dispatch(
      deleteOrderDispatch(
        res,
        forCustomer,
        limit,
        offset,
        selectedFilter,
        selectedDate,
        selectedSupplierIds,
        selectedCustomerIds
      )
    );
  } catch (err: any) {
    dispatch(setDeleteError(String(err)));
  } finally {
    dispatch(setDeletePending(false));
  }
};

/** ---------------------------
 *  getOrders
 */
function getOrdersDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List order failed!"));
    }
  };
}

export const getOrders = (
  todayOnly = false,
  limit = 0,
  offset = 0
) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list/`, { todayOnly, limit, offset });
    // On met à jour orderListTotalCount + orderList
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));
    dispatch(setOrderList(response.data.result));

    // Suite de la logique
    dispatch(getOrdersDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersForCustomer
 */
function getOrdersForCustomerDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List order for customer failed!"));
    }
  };
}

export const getOrdersForCustomer = (limit = 0, offset = 0) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list_customer`, { limit, offset });
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));
    dispatch(setOrderList(response.data.result));

    dispatch(getOrdersForCustomerDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersForCustomerSpread
 */
function getOrdersForCustomerSpreadDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List order for customer spread failed!"));
    }
  };
}

export const getOrdersForCustomerSpread = (limit = 0, offset = 0) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list_customer`, { limit, offset });
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));
    // Au lieu de setOrderList, on veut "spread" -> concat
    dispatch(setOrderListSpread(response.data.result));

    dispatch(getOrdersForCustomerSpreadDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersTotalCountForCustomer
 */
function getOrdersTotalCountForCustomerDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List order total count for customer failed!"));
    }
  };
}

export const getOrdersTotalCountForCustomer = (limit = 0, offset = 0) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list_customer`, { limit, offset });
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));

    dispatch(getOrdersTotalCountForCustomerDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersForSupplier
 */
function getOrdersForSupplierDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List order failed!"));
    }
  };
}

export const getOrdersForSupplier = (
  supplierId: number,
  todayOnly = false,
  limit = 0,
  offset = 0
) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list_supplier/${supplierId}`, {
      todayOnly,
      limit,
      offset
    });
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));
    dispatch(setOrderList(response.data.result));

    dispatch(getOrdersForSupplierDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersForSuppliers
 */
function getOrdersForSuppliersDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List orders failed!"));
    }
  };
}

export const getOrdersForSuppliers = (
  supplierIds: number[],
  limit = 0,
  offset = 0
) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list_suppliers/`, {
      ids: supplierIds,
      limit,
      offset
    });
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));
    dispatch(setOrderList(response.data.result));

    dispatch(getOrdersForSuppliersDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersForCustomers
 */
function getOrdersForCustomersDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List order for customers failed!"));
    }
  };
}

export const getOrdersForCustomers = (
  customerIds: number[],
  limit = 0,
  offset = 0
) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list_customers`, {
      ids: customerIds,
      limit,
      offset
    });
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));
    dispatch(setOrderList(response.data.result));

    dispatch(getOrdersForCustomersDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersForDate
 */
function getOrdersForDateDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List order for date failed!"));
    }
  };
}

export const getOrdersForDate = (
  date: string,
  limit = 0,
  offset = 0
) => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.post(`/api/orders/list_date`, { date, limit, offset });
    dispatch(setOrderListTotalCount(response.data.totalCount || 0));
    dispatch(setOrderList(response.data.result));

    dispatch(getOrdersForDateDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  getOrdersExtra
 */
function getOrdersExtraDispatch(res: any) {
  return (dispatch: AppDispatch) => {
    dispatch(setListSuccess(!!res.payload?.data));
    if (!res.payload?.data) {
      dispatch(setListError("List orders extra failed!"));
    }
  };
}

export const getOrdersExtra = () => async (dispatch: AppDispatch) => {
  dispatch(setListPending(true));
  dispatch(setListSuccess(false));
  dispatch(setListError(""));

  try {
    const response = await axios.get(`/api/orders/list_extra/`);
    // On met à jour la liste extra
    dispatch(setOrderExtraList(response.data));

    dispatch(getOrdersExtraDispatch({ payload: { data: response.data } }));
  } catch (err: any) {
    dispatch(setListError(String(err)));
  } finally {
    dispatch(setListPending(false));
  }
};

/** ---------------------------
 *  filterOrdersDispatch
 */
function filterOrdersDispatch(
  limit: number,
  offset: number,
  selectedFilter: string,
  selectedDate: moment.Moment,
  selectedSupplierIds: number[],
  selectedCustomerIds: number[]
) {
  return (dispatch: AppDispatch) => {
    switch (selectedFilter) {
      case "date":
        dispatch(
          getOrdersForDate(
            selectedDate ? selectedDate.format("YYYY-MM-DD") : "",
            limit,
            offset
          )
        );
        break;
      case "suppliers":
        dispatch(getOrdersForSuppliers(selectedSupplierIds, limit, offset));
        break;
      case "customers":
        dispatch(getOrdersForCustomers(selectedCustomerIds, limit, offset));
        break;
      default:
        dispatch(getOrders(false, limit, offset));
        break;
    }
  };
}
