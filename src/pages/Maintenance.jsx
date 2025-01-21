import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import MachineBreakdown from "./MachineBreakdown";
import HandoverMaintenance from "./HandoverMaintenance";
import MachineHistorical from "./MachineHistorical";
import DataReportMTC from "./DataReportMTC";
import Header from "../components/header";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
function Maintenance() {
  const userGlobal = useSelector((state) => state.user.user);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");

  const getTabIndex = () => {
    switch (initialTab) {
      case "historical":
        return userGlobal.level > 2 ? "historical" : "maintenance-breakdown";
      case "data-report":
        return userGlobal.level > 2 ? "data-report" : "maintenance-breakdown";
      case "handover":
        return "handover";
      case "maintenance-breakdown":
      default:
        return "maintenance-breakdown";
    }
  };

  const [activeTab, setActiveTab] = useState(getTabIndex());

  useEffect(() => {
    setActiveTab(getTabIndex());
  }, [initialTab, userGlobal.level]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "maintenance-breakdown":
        return <MachineBreakdown />;
      case "handover":
        return <HandoverMaintenance />;
      case "data-report":
        return <DataReportMTC />;
      case "historical":
        return <MachineHistorical />;
      default:
        return <MachineBreakdown />;
    }
  };

  return (
    <div>
      <Header />
      <div className=" bg-background shadow-md p-6">
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
      
  );
}

export default Maintenance;

// dulu sebelumnya pake ini sebagai TabList
// <TabList>
// {userGlobal.level <= 2 ? (
//   <Tab className="font-bold">Maintenance Breakdown Pareto</Tab>
// ) : (
//   <>
//     <Tab className="font-bold">Maintenance Report</Tab>
//     <Tab className="font-bold">Maintenance Breakdown Pareto</Tab>
//     <Tab className="font-bold">Data Report</Tab>
//     <Tab className="font-bold">Historical Machine</Tab>
//   </>
// )}
// </TabList>
