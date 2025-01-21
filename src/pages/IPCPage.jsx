import React, { useEffect, Component, useState } from "react";

import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Box,
} from "@chakra-ui/react";
import Mettler from "./Mettler";
import Sartorius from "./Sartorius";
import Moisture from "./Moisture";

const IPCPage = () => {
  return (
    <div>
    <br />
      <Tabs isFitted width="100%" maxW="inherit" mx="auto">
        <TabList>
          <Tab>Sartorius</Tab>
          <Tab>Moisture</Tab>
          <Tab>Mettler</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box overflow="auto">
              <Sartorius />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box overflow="auto">
              <Moisture />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box overflow="auto">
              <Mettler />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default IPCPage;