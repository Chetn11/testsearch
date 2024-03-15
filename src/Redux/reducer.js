const initialState = {
  searchText: "",
  planets: [],
  filters: {
    // available options
    colors: [],
    shapes: [],
    sizes: [],
  },
  selectedFilters: {
    // applied filters
    color: [],
    shape: [],
    size: [],
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SEARCH_TEXT":
      return { ...state, searchText: action.payload };
    case "SET_PLANETS":
      return { ...state, planets: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    case "SET_SELECTED_FILTERS":
      return { ...state, selectedFilters: action.payload };
    default:
      return state;
  }
};

export default reducer;
