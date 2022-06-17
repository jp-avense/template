import { createContext, useContext, useState } from "react";
import _ from "lodash";

type FilterContextT = {
  handleFilter: {
    filteredData: any;
    setFilteredData: React.Dispatch<any>;
    originalData: any;
    setOriginalData: React.Dispatch<any>;
    filterTable: React.Dispatch<any>;
    filter: string
  };
};

export const FilterContext = createContext<FilterContextT>(
  {} as FilterContextT
);

export const FilterProvider = ({ children }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filter, setFilter] = useState('clear_filters')

  const filterTable = (filter: string) => {
    setFilter(filter)
    if (filter == "clear_filters") {
      setFilteredData(originalData);
    } else {
      const data = _.filter(originalData, function (o) {
        return o.status_id == filter;
      });
      setFilteredData(data);
    }
  };
  const handleFilter = {
    filteredData,
    setFilteredData,
    filterTable,
    originalData,
    setOriginalData,
    filter,
  };

  return (
    <FilterContext.Provider value={{ handleFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
