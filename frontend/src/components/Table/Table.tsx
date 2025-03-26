import React, { useState, useCallback } from "react";
import {
  PagingState,
  IntegratedPaging,
  IntegratedSorting,
  SortingState,
  SearchState,
  EditingState,
  IntegratedFiltering,
  Sorting,
  Column,
  CustomPaging
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  PagingPanel,
  Toolbar,
  SearchPanel,
  TableEditColumn
} from "@devexpress/dx-react-grid-material-ui";

const tableMessages = {
  noData: "Aucune donnée disponible"
};

const searchPanelMessages = {
  searchPlaceholder: "Recherche..."
};

const tableEditColumnMessages = {
  addCommand: "Nouveau"
};

const pagingPanelMessages = {
  showAll: "Toutes",
  rowsPerPage: "Lignes par page",
  info: "Lignes {from} à {to} ({count} éléments)"
} as const;

interface TableProps {
  add?: boolean;
  remotePaging?: boolean;
  rows: any[];
  columns: Column[];
  defaultSorting: Sorting[];
  pageSizes: number[];
  totalCount?: number;
  onChangeLimit?: (limit: number) => void;
  onChangeOffset?: (offset: number) => void;
  onAddedRowsChange?: () => void;
  onLoadData?: (limit: number, offset: number) => void;
}

const TableComponent: React.FC<TableProps> = ({
  add = false,
  remotePaging = false,
  rows,
  columns,
  defaultSorting = [{ columnName: "id", direction: "desc" }],
  pageSizes = [5, 10, 15, 0],
  totalCount,
  onChangeLimit,
  onChangeOffset,
  onAddedRowsChange,
  onLoadData
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const refresh = useCallback((limit: number, offset: number) => {
    if (remotePaging && onLoadData) {
      onLoadData(limit, offset);
    }
  }, [remotePaging, onLoadData]);

  const handleCurrentPageChange = useCallback((newCurrentPage: number) => {
    if (onChangeLimit && onChangeOffset) {
      const limit = pageSize;
      const offset = newCurrentPage * pageSize;
      onChangeLimit(limit);
      onChangeOffset(offset);
      refresh(limit, offset);
    }
    setCurrentPage(newCurrentPage);
  }, [pageSize, onChangeLimit, onChangeOffset, refresh]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    if (onChangeLimit && onChangeOffset) {
      const limit = newPageSize;
      const offset = currentPage * newPageSize;
      onChangeLimit(limit);
      onChangeOffset(offset);
      refresh(limit, offset);
    }
    setPageSize(newPageSize);
  }, [currentPage, onChangeLimit, onChangeOffset, refresh]);

  return (
    <div style={{ width: '100%' }}>
      <Grid rows={rows} columns={columns}>
        {remotePaging && (
          <PagingState
            currentPage={currentPage}
            pageSize={pageSize}
            defaultCurrentPage={0}
            defaultPageSize={10}
            onCurrentPageChange={handleCurrentPageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
        <SortingState defaultSorting={defaultSorting} />
        <IntegratedSorting />
        <SearchState />
        <IntegratedFiltering />
        {remotePaging && <CustomPaging totalCount={totalCount} />}
        {!remotePaging && (
          <PagingState defaultCurrentPage={0} defaultPageSize={10} />
        )}
        {!remotePaging && <IntegratedPaging />}
        {add && (
          <EditingState
            onCommitChanges={() => false}
            onAddedRowsChange={onAddedRowsChange}
          />
        )}
        <Table messages={tableMessages} />
        <TableHeaderRow showSortingControls />
        <Toolbar />
        <SearchPanel messages={searchPanelMessages} />
        {add && (
          <TableEditColumn showAddCommand messages={tableEditColumnMessages} />
        )}
        <PagingPanel pageSizes={pageSizes} messages={pagingPanelMessages} />
      </Grid>
    </div>
  );
};

export default TableComponent;
