export const setSearchText = (text) => ({
  type: "SET_SEARCH_TEXT",
  payload: text,
});

export const setPlanets = (planets) => ({
  type: "SET_PLANETS",
  payload: planets,
});

export const setFilters = (filters) => ({
  type: "SET_FILTERS",
  payload: filters,
});

export const setSelectedFilters = (filters) => ({
  type: "SET_SELECTED_FILTERS",
  payload: filters,
});
