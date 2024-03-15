import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import {
  setSearchText,
  setPlanets,
  setFilters,
  setSelectedFilters,
} from "../Redux/actions.js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Autocomplete } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import queryString from "query-string";

function SearchPage() {
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.searchText);
  const planets = useSelector((state) => state.planets);
  const filters = useSelector((state) => state.filters);
  const selectedFilters = useSelector((state) => state.selectedFilters);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = queryString.parse(searchParams.toString());
    dispatch(setSearchText(params.q || ""));
    dispatch(
      setSelectedFilters({
        colors: params.color ? params.color.split(",") : [],
        shapes: params.shape ? params.shape.split(",") : [],
        sizes: params.size ? params.size.split(",") : [],
      })
    );
    fetchPlanets(params);
    fetchFilters();
  }, []);

  const fetchPlanets = async (params) => {
    const response = await axios.get(
      `https://json-server-planets-rkga.onrender.com/planets?${queryString.stringify(
        params
      )}`
    );
    dispatch(setPlanets(response.data));
  };

  const fetchFilters = async () => {
    const colorsResponse = await axios.get(
      "https://json-server-planets-rkga.onrender.com/colors"
    );
    const shapesResponse = await axios.get(
      "https://json-server-planets-rkga.onrender.com/shapes"
    );
    const sizesResponse = await axios.get(
      "https://json-server-planets-rkga.onrender.com/sizes"
    );

    // console.log(colorsResponse);

    dispatch(
      setFilters({
        colors: colorsResponse.data,
        shapes: shapesResponse.data,
        sizes: sizesResponse.data,
      })
    );
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value;
    // console.log(searchText);
    dispatch(setSearchText(searchText));
    setSearchParams({ q: searchText });
  };

  const handleFilterChange = (value, filterType) => {
    const selectedFilterId = value?.map((eachValue) => eachValue?.id);

    dispatch(
      setSelectedFilters({
        ...selectedFilters,
        [filterType]: selectedFilterId,
      })
    );
    setSearchParams({
      ...searchParams,
      [filterType]: selectedFilterId.join(","),
    });
  };

  const handelSearch = async () => {
    const filterParams = {
      q: searchText,
      ...selectedFilters,
    };

    const response = await axios.get(
      `https://json-server-planets-rkga.onrender.com/planets?${queryString.stringify(
        filterParams
      )}`
    );
    dispatch(setPlanets(response.data));
    setSearchParams(filterParams);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handelSearch();
    }
  };

  // console.log("data:",planets)
  return (
    <div>
      <Box
        height={800}
        width={800}
        margin="auto"
        my={4}
        alignItems="center"
        gap={4}
        p={2}
        sx={{ border: "2px solid grey" }}
      >
        <Paper
          component="form"
          sx={{
            p: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            marginBottom: "40px",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Planet"
            value={searchText}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />

          <IconButton
            type="button"
            sx={{ p: "10px", bgcolor: "#4190f7", color: "white" }}
            aria-label="search"
            onClick={handelSearch}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" style={{ marginBottom: "20px" }}>
              Colors
            </Typography>
            <Autocomplete
              multiple
              options={filters.colors}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => {
                console.log(event);
                handleFilterChange(value, "color");
              }}
              renderInput={(params) => (
                <TextField {...params} label="Color" variant="outlined" />
              )}
            />

            <Typography
              variant="h6"
              style={{ marginBottom: "5px", marginTop: "5px" }}
            >
              Shape
            </Typography>
            <Autocomplete
              multiple
              options={filters.sizes}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => handleFilterChange(value, "size")}
              renderInput={(params) => (
                <TextField {...params} label="Sizes" variant="outlined" />
              )}
            />

            <Typography
              variant="h6"
              style={{ marginBottom: "5px", marginTop: "5px" }}
            >
              Size
            </Typography>
            <Autocomplete
              multiple
              options={filters?.shapes}
              values={filters?.shapes?.map((item) => item.id)}
              getOptionLabel={(option) => option.name}
              onChange={(event, value) => handleFilterChange(value, "shape")}
              renderInput={(params) => (
                <TextField {...params} label="Shape" variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" style={{ marginBottom: "20px" }}>
              Planet Data
            </Typography>
            {planets?.map((planet) => (
              <Card variant="outlined" key={planet.id} style={{ margin: "5px" }}>
                
                <Typography variant="h6" style={{ margin: "5px" }}>
                  {planet.name}
                </Typography>
                <Typography variant="body2" style={{ margin: "5px" }}>
                  {planet.description}
                </Typography>
                <Typography variant="body2" style={{ margin: "5px" }}>
                  {planet.name} has{" "}
                  {
                    filters?.colors?.find((color) => {
                      return color.id === planet.color;
                    })?.name
                  }{" "}
                  and{" "}
                  {
                    filters?.shapes?.find((shape) => {
                      return shape.id === planet.shape;
                    })?.name
                  }{" "}
                  shape
                </Typography>
               
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default SearchPage;
