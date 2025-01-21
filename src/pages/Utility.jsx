import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
} from "@chakra-ui/react";
import PowerManagement from "./PowerManagement";
import PowerManagement2 from "./PowerManagement1";
import HVAC from "./HVAC";
import Water from "./Water";
import PurifiedControl from "./PurifiedControl";
import WasteWater from "./WasteWater";
import SteamControl from "./SteamControl";
import Solar from "./Solar";
import Loopo from "./Loopo";
import Osmotron from "./Osmotron";
import AlarmList from "./AlarmList";
import Motor from "./MotorVibration";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/header";

function Utility() {
  const userGlobal = useSelector((state) => state.user.user);
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");

  const getTabIndex = () => {
    switch (initialTab) {
      case "motor-vibration":
        return userGlobal.level > 2 ? "motor-vibration" : "power-management";
      case "alarm-list":
        return "alarm-list";
      case "osmotron":
        return "osmotron";
      case "loopo":
        return "loopo";
      case "solar-management":
        return "solar-management";
      case "steam-control":
        return "steam-control";
      case "HVAC":
        return "HVAC";
      case "waste-water-management":
        return "waste-water-management";
      case "water-management":
        return "water-management";
      case "power-management":
      default:
        return "power-management";
    }
  };

  const [activeTab, setActiveTab] = useState(getTabIndex());

  useEffect(() => {
    setActiveTab(getTabIndex());
  }, [initialTab, userGlobal.level]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "power-management":
        return <PowerManagement2 />;
      case "water-management":
        return <Water />;
      case "waste-water-management":
        return <WasteWater />;
      case "HVAC":
        return <HVAC />;
      case "steam-control":
        return <SteamControl />;
      case "solar-management":
        return <Solar />;
      case "loopo":
        return <Loopo />;
      case "osmotron":
        return <Osmotron/>;
      case "alarm-list":
        return <AlarmList/>;
      case "motor-vibration":
        return <Motor />;
      default:
        return <PowerManagement2 />;
    }
  };
  return (
    <div>
      <Header />
      <div className=" bg-background shadow-md p-5">
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default Utility;
