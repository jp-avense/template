import { createContext, useState } from "react";
import _ from "lodash";

type FilterContextT = {
  handleFilter: {
    filteredData: any;
    setFilteredData: React.Dispatch<any>;
    originalData: any;
    setOriginalData: React.Dispatch<any>;
    filterTable: React.Dispatch<any>;
    filterDynamicTable: React.Dispatch<any>;
    filter: string;
  };
};

export const FilterContext = createContext<FilterContextT>(
  {} as FilterContextT
);

export const FilterProvider = ({ children }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filter, setFilter] = useState("clear_filters");

  const filterTable = (filter: string) => {
    setFilter(filter);
    if (filter == "clear_filters") {
      setFilteredData(originalData);
    } else {
      const data = _.filter(originalData, function (o) {
        return o.status_id == filter;
      });
      setFilteredData(data);
    }
  };

  const filterDynamicTable = (details: any) => {
    let dataTable = [];
    let data = [];
    if (filter == "clear_filters") {
      dataTable = originalData;
    } else dataTable = filteredData;

    if (details.filter == "created_at") {
      data = _.filter(dataTable, function (o) {
        let date = new Date(o[details.filter] * 1000);
        return date == details.value;
      });
    } else
      data = _.filter(dataTable, function (o) {
        return o[details.filter] == details.value;
      });

    setFilteredData(data);
    console.log("InDynamic", details);
    console.log("InDynamic", data);
  };

  const handleFilter = {
    filteredData,
    setFilteredData,
    filterTable,
    filterDynamicTable,
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
