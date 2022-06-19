import { createContext, useState } from "react";
import _ from "lodash";

type TabsContextT = {
  handleTabs: {
    tabsData: any;
    setTabsData: React.Dispatch<any>;
  };
};

export const TabsContext = createContext<TabsContextT>({} as TabsContextT);

export const TabsProvider = ({ children }) => {
  const [tabsData, setTabsData] = useState({});

  const currentRow = (data: any) => {
    setTabsData(data);
  };

  const handleTabs = {
    tabsData,
    setTabsData,
  };

  return (
    <TabsContext.Provider value={{ handleTabs }}>
      {children}
    </TabsContext.Provider>
  );
};
