// SearchBar.tsx
import React, { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import {
  TextField,
  InputAdornment,
  IconButton,
  TextFieldProps,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface ISearchBarProps {
  onSearch: (search: string) => void;
  checkDictionnary: (tag: string) => string;
}

/** 
 * On redéfinit le style, pour reproduire le même rendu :
 * - marginLeft: 0, mais marginLeft: theme.spacing(4) en >= sm
 * - backgroundColor en alpha(white, 0.15) / 0.25 au hover
 * - color #fff pour le texte et les icônes
 */
const StyledTextField = styled((props: TextFieldProps) => (
  <TextField {...props} />
))(({ theme }) => ({
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(4),
    width: "auto",
  },

  // Sélecteurs internes pour "root" de l'Input
  "& .MuiInputBase-root": {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    color: "#fff", // le texte en blanc
  },

  // Sélecteur pour les icônes (SearchIcon, ClearIcon)
  "& .MuiSvgIcon-root": {
    color: "#fff",
  },
}));

export default function SearchBar({
  onSearch,
  checkDictionnary,
}: ISearchBarProps) {
  const [search, setSearch] = useState("");

  const handleChangeSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setSearch(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearch("");
    onSearch("");
  };

  return (
    <StyledTextField
      id="input-with-icon-textfield"
      value={search}
      onChange={handleChangeSearch}
      placeholder={checkDictionnary("_RECHERCHE")}
      variant="standard"
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClearSearch}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
