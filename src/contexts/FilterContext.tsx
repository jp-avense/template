import { createContext, useState } from "react";
import _ from "lodash";
import { parseValue } from "src/lib";
import { taskService } from "src/services/task.service";
import { AxiosResponse } from "axios";
import { TaskDefaultColumns } from "src/consts";
import { Form } from "src/content/pages/FormBuilder/form.interface";

type FilterContextT = {
  handleFilter: {
    filteredData: any;
    setFilteredData: React.Dispatch<any>;
    originalData: any;
    setOriginalData: React.Dispatch<any>;
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
    sort: string;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    loading: boolean;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setSort: React.Dispatch<React.SetStateAction<string>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRows: string[];
    setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
    status: any[];
    setStatus: React.Dispatch<React.SetStateAction<any[]>>;
    types: any[];
    setTypes: React.Dispatch<React.SetStateAction<any[]>>;
    getDataAndSet: (filterObject?: object) => Promise<any>;
    getTypesAndSet: () => Promise<any>;
    getStatusAndSet: () => Promise<any>;
    settings: any[];
    setSettings: React.Dispatch<React.SetStateAction<any[]>>;
    forms: Form[];
    setForms: React.Dispatch<React.SetStateAction<Form[]>>;
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
  const [sort, setSort] = useState();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [settings, setSettings] = useState([]);

  const [types, setTypes] = useState([]);
  const [status, setStatus] = useState([]);

  const [filter, setFilter] = useState("clear_filters");
  const [dynamicFilters, setDynamicFilters] = useState([]);

  const [forms, setForms] = useState<Form[]>([]);

  const getDataByFilters = async (parsedObject?: object) => {
    setSelectedRows([]);
    const finalFilters = {};

    if (filter !== "clear_filters") finalFilters["statusId"] = filter;

    const errors = [];
    dynamicFilters.forEach((x) => {
      if (x.value != null && x.selectedType !== "none") {
        if (x.selectedType === TaskDefaultColumns.CREATED_AT) {
          finalFilters["createdAtStart"] = parseValue(
            x.value[0],
            x.componentType
          );
          finalFilters["createdAtEnd"] = parseValue(
            x.value[1],
            x.componentType
          );

          if (finalFilters["createdAtEnd"] < finalFilters["createdAtStart"])
            errors.push("Start date must be greated than end date");
          return;
        }
        finalFilters[x.selectedType] = parseValue(x.value, x.componentType);
      }
    });

    if (errors.length) throw new Error(errors[0]);

    finalFilters["page"] = page;
    finalFilters["pageSize"] = limit;
    finalFilters["sort"] = sort;

    if (parsedObject) {
      for (const [key, value] of Object.entries(parsedObject)) {
        finalFilters[key] = value;
      }
    }

    return taskService.getAll(finalFilters);
  };

  const getDataAndSet = async (filterObject?: object) => {
    const { data } = await getDataByFilters(filterObject);

    setTotal(data.totalDocuments);
    setOriginalData(data.tasks);
    return data;
  };

  const getTypesAndSet = async () => {
    const { data } = await taskService.getTypes();
    setTypes(data);
    return data;
  };

  const getStatusAndSet = async () => {
    const { data } = await taskService.getStatuses();
    data.sort((a, b) => a.Key.localeCompare(b.Key));

    setStatus(data);
    return data;
  };

  const handleFilter = {
    filteredData,
    setFilteredData,
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
    sort,
    setSort,
    limit,
    setLimit,
    loading,
    setLoading,
    selectedRows,
    setSelectedRows,
    status,
    setStatus,
    types,
    setTypes,
    getDataAndSet,
    getStatusAndSet,
    getTypesAndSet,
    settings,
    setSettings,
    forms,
    setForms,
  };

  return (
    <FilterContext.Provider value={{ handleFilter }}>
      {children}
    </FilterContext.Provider>
  );
};
