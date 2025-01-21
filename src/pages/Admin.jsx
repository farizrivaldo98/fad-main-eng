import React, { useEffect, useState } from "react";
import { Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box
 } from "@chakra-ui/react";
import Header from "../components/header";
import AdminTabel from "./AdminTabel";

function Admin() {

  return (
    <div className="overflow-hidden">
      <Header/>
      <br />
      <>
        <Tabs variant='line' >
          <TabList>
            <Tab sx={{ outline: 'none', boxShadow: 'none' }} >
              User Tabel
            </Tab>
            <Tab sx={{ outline: 'none', boxShadow: 'none' }} >
              Projects
            </Tab>
            <Tab sx={{ outline: 'none', boxShadow: 'none' }} >
              Settings
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box overflow="auto">
                <AdminTabel />
              </Box>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    </div>
  );
}

export default Admin;
