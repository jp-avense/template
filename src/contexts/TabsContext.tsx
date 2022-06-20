import { createContext, useEffect, useState } from "react";
import _ from "lodash";

type TabsContextT = {
  handleTabs: {
    tabsData: any;
    setTabsData: React.Dispatch<any>;
    currentRow: any;
  };
};

export const TabsContext = createContext<TabsContextT>({} as TabsContextT);

export const TabsProvider = ({ children }) => {
  const [tabsData, setTabsData] = useState([]);
  const [currentRow, setCurrentRow] = useState({});

  const getCurrentRow = () => {
    const current = tabsData[tabsData.length - 1];
    setCurrentRow(current);
  };

  useEffect(() => {
    getCurrentRow();
  }, [tabsData]);

  const handleTabs = {
    tabsData,
    setTabsData,
    currentRow,
  };

  return (
    <TabsContext.Provider value={{ handleTabs }}>
      {children}
    </TabsContext.Provider>
  );
};
