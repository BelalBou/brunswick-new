declare module '@devexpress/dx-react-grid' {
  export interface Column {
    name: string;
    title?: string;
    getCellValue?: (row: any) => any;
  }

  export interface Sorting {
    columnName: string;
    direction: 'asc' | 'desc';
  }

  export const PagingState: any;
  export const IntegratedPaging: any;
  export const IntegratedSorting: any;
  export const SortingState: any;
  export const SearchState: any;
  export const EditingState: any;
  export const IntegratedFiltering: any;
  export const CustomPaging: any;
}

declare module '@devexpress/dx-react-grid-material-ui' {
  export const Grid: any;
  export const Table: any;
  export const TableHeaderRow: any;
  export const PagingPanel: any;
  export const Toolbar: any;
  export const SearchPanel: any;
  export const TableEditColumn: any;
} 