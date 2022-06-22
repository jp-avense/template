import { createContext, useState } from "react";
import _ from "lodash";
import { parseValue } from "src/lib";
import { taskService } from "src/services/task.service";
import { AxiosResponse } from "axios";

type FilterContextT = {
  handleFilter: {
    filteredData: any;
    setFilteredData: React.Dispatch<any>;
    originalData: any;
    setOriginalData: React.Dispatch<any>;
    filterTable: React.Dispatch<any>;
    filterDynamicTable: React.Dispatch<any>;
    filter: string;
    setDetails: React.Dispatch<React.SetStateAction<any[]>>;
    details: any[];
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    dynamicFilters: any[];
    setDynamicFilters: React.Dispatch<React.SetStateAction<any[]>>;
    total: number;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    getDataByFilters: (
      parsedObject?: object
    ) => Promise<AxiosResponse<any, any>>;
    page: number;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRows: string[];
    setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  };
};

export const FilterContext = createContext<FilterContextT>(
  {} as FilterContextT
);

export const FilterProvider = ({ children }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [details, setDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [filter, setFilter] = useState("clear_filters");
  const [dynamicFilters, setDynamicFilters] = useState([]);

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

    if (details.filter == "createdAt") {
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

  const getDataByFilters = async (parsedObject?: object) => {
    const finalFilters = {};

    if (filter !== "clear_filters") finalFilters["statusId"] = filter;

    dynamicFilters.forEach((x) => {
      if (x.value != null && x.value !== "none" && x.selectedType !== "none")
        finalFilters[x.selectedType] = parseValue(x.value, x.componentType);
    });

    finalFilters["page"] = page;
    finalFilters["pageSize"] = limit;

    if (parsedObject) {
      for (const [key, value] of Object.entries(parsedObject)) {
        finalFilters[key] = value;
      }
    }

    return taskService.getAll(finalFilters);
  };

  const handleFilter = {
    filteredData,
    setFilteredData,
    filterTable,
    filterDynamicTable,
    originalData,
    setOriginalData,
    filter,
    setDetails,
    details,
    setFilter,
    dynamicFilters,
    setDynamicFilters,
    total,
    setTotal,
    getDataByFilters,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
    selectedRows,
    setSelectedRows,
  };

  return (
    <FilterContext.Provider value={{ handleFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
