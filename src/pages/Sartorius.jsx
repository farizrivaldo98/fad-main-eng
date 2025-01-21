import React, { useEffect, Component, useState } from "react";
import CanvasJSReact from "../canvasjs.react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  ButtonGroup,
  Stack,
  Input,
  Select,
  Spinner
} from "@chakra-ui/react";
import Axios from "axios";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import Header from "../components/header";
import { color } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function Sartorius () {
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");

  const [sartoriusGraph, setSartoriusGraph] = useState([]);
  const [sartoriusData, setSartoriusData] = useState([]);

  const [showAllData, setShowAllData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

  const [isDarkMode, setIsDarkMode] = useState(
      document.documentElement.getAttribute("data-theme") === "dark"
  );

  const warnaText = {
    color: tulisanColor
  };

  const fetchTableData = async () => {
    let response = await Axios.get(
      `http://10.126.15.137:8002/part/getSartoriusData`,
      {
        params: {
          start: startDate,
          finish: finishDate,
        },
      }
    );
    setSartoriusData(response.data)
  };

  const fetchGraphSartorius = async () => {
    let response = await Axios.get(
      `http://10.126.15.137:8002/part/getSartoriusGraph`,
      {
        params: {
          start: startDate,
          finish: finishDate,
        },
      }
    );
      // Preprocess data to format created_
      setSartoriusGraph(response.data)
  };

  const handleSubmit = () => {
    setLoading(true); // Start spinner
    setError(null);   // Clear previous errors

    try {
    if (!startDate || !finishDate) {
      toast.error("Please enter both start and finish dates.");
      return;
    }
    // fetching table data and 3 charts
    fetchGraphSartorius();
    fetchTableData();
  } catch (err) {
    console.error("Error fetching data:", err);
    setError("Failed to fetch data. Please try again.");
  } finally {
    const delay = 2000; // 2 seconds in milliseconds
      setTimeout(() => {
        setLoading(false); // Stop spinner
        console.log("Finished fetching data, stopping spinner...");
      }, delay);
  }
  };

  const handleShowAll = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("Data loaded successfully!");
          // Or call reject("Error message") to simulate an error.
        }, 2000); // Simulating a delay, replace with your logic
      }),
      {
        pending: "Loading data, please wait...",
        success: "Data successfully loaded!",
        error: "Failed to load data, please try again later.",
      }
    );
    setShowAllData(true);
  };
  
  const handleHideAll = () => {
    setShowAllData(false);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  
  const handleFinishDateChange = (e) => {
    setFinishDate(e.target.value);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sartoriusData.length / rowsPerPage)));
  };

  const renderInstrumentList = () => {  
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleData = sartoriusData.slice(startIndex, startIndex + rowsPerPage);

    if (sartoriusData.length === 0) {
      return (
        <Tr>
          <Td colSpan={12} className="text-center text-text">
            No data available
          </Td>
        </Tr>
      );
    } 
    return visibleData.map((instrument, index) => (
      <Tr key={index}>
        <Td style={warnaText}>{instrument.id}</Td>
        <Td style={warnaText}>{instrument.date}</Td>
        <Td style={warnaText}>{instrument.time}</Td>
        <Td style={warnaText}>{instrument.mod}</Td>
        <Td style={warnaText}>{instrument.ser_no}</Td>
        <Td style={warnaText}>{instrument.APC}</Td>
        <Td style={warnaText}>{instrument.BAC}</Td>
        <Td style={warnaText}>{instrument.l_id}</Td>
        <Td style={warnaText}>{instrument.l_id2}</Td>
        <Td style={warnaText}>{instrument.weight}</Td>
        <Td style={warnaText}>{instrument.unit}</Td>
        <Td style={warnaText}>{instrument.trial_no}</Td>
        <Td style={warnaText}>{instrument.operator}</Td>
      </Tr>
    ));
  };

  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setIsDarkMode(currentTheme === 'dark');
    };
    // Observe attribute changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  // ==========================================================================================================================================
  const sartoriusOptions = {
    theme: isDarkMode ? "dark2" : "light2",
    axisY: {
      prefix: "",
      gridColor: isDarkMode ? "#444" : "#bfbfbf",
      labelFontColor: isDarkMode ? "white" : "black",
      tickLength: 5,
      tickThickness: 2,
      tickColor: isDarkMode ? "#d6d6d6" : "#5e5e5e",
    },
    axisX: {
      lineColor: isDarkMode ? "#d6d6d6" : "#474747",
      labelFontColor: isDarkMode ? "white" : "black",
      tickLength: 5,
      tickThickness: 2,
      tickColor: isDarkMode ? "#d6d6d6" : "#474747",
    },
  toolTip: {
      shared: true,
  },
  backgroundColor: isDarkMode ? "#171717" : "#ffffff",
  title: { text: "Thickness", fontColor: isDarkMode ? "white" : "black" },
  data: [
      {
        type: "spline",
        name: "Thickness",
        showInLegend: true,
        xValueFormatString: "",
        yValueFormatString: "",
        lineColor: isDarkMode ? "#00bfff" : "#1e90ff",  
        color: isDarkMode ? "#00bfff" : "#1e90ff",  
        markerColor: isDarkMode ? "#00bfff" : "#1e90ff", 
        markerSize: 2,
        dataPoints: sartoriusGraph,   
      },
    ],     
  };

  return (
    <div>
      <div>
        <h1 className="block text-center text-text font-medium text-4xl antialiased hover:subpixel-antialiased; p-6 pb-3">
          SARTORIUS
        </h1>
        <p className="block text-center text-text text-xl antialiased hover:subpixel-antialiased;">
          Instrument Production
        </p>
        <br />
        <div className="block bg-card p-2 rounded-lg shadow-lg mx-8">
          {loading ? (
          <div className="flex flex-col items-center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </div>
          ) : error ? (
            <div className="text-red-500 flex flex-col items-center">No available data</div>
          ) : (
            <CanvasJSChart options={sartoriusOptions} />
          )}
          </div>
           <br />
          <div
            className="flex flex-row justify-center"
            direction="row"
            spacing={5}
            align="center">
            <div className="main flex flex-row gap-x-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-text">
                  Start Date
                </label>
                <Input
                  type="date"
                  placeholder="Select Start Date"
                  size="md"
                  value={startDate}
                  onChange={handleStartDateChange}
                  css={{
                    "&::-webkit-calendar-picker-indicator": {
                      color: isDarkMode ? "white" : "black",
                      filter: isDarkMode ? "invert(1)" : "none",
                    },
                  }}
                  sx={{
                    border: "1px solid",
                    borderColor: borderColor,
                    borderRadius: "0.395rem",
                    background: "var(--color-background)", // background color from Tailwind config
          
                    _hover: {
                      borderColor: hoverBorderColor,
                    },
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-text">
                  Finish Date
                </label>
                <Input
                  type="date"
                  placeholder="Select Finish Date"
                  size="md"
                  value={finishDate}
                  onChange={handleFinishDateChange}
                  css={{
                    "&::-webkit-calendar-picker-indicator": {
                      color: isDarkMode ? "white" : "black",
                      filter: isDarkMode ? "invert(1)" : "none",
                    },
                  }}
                  sx={{
                    border: "1px solid",
                    borderColor: borderColor,
                    borderRadius: "0.395rem",
                    background: "var(--color-background)", // background color from Tailwind config
          
                    _hover: {
                      borderColor: hoverBorderColor,
                    },
                  }}
                />
              </div>
            </div>
            <div>
              <br />
              <Button
                className="ml-4 mt-1"
                colorScheme="blue"
                onClick={() => handleSubmit()}
              >
                Submit
              </Button>
            </div>
          </div>
          <br />
          <div className="flex justify-center gap-6 mt-3">
            <Button className="ml-4" colorScheme="blue" onClick={() => handleShowAll()}>
              Show All Data
            </Button>
            <Stack                   
            sx={{
              border: "1px solid",
              borderColor: borderColor,
              borderRadius: "0.395rem",
              background: "var(--color-background)", // background color from Tailwind config
    
              _hover: {
                borderColor: hoverBorderColor,
              },
            }}>
              <Select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                width="80px">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </Select>
            </Stack>
            <Button className="ml-4" colorScheme="red" onClick={() => handleHideAll()}>
              Hidden All Data
            </Button>
          </div>
          <br /> 
          {showAllData && (
          <TableContainer  className="bg-card rounded-md mx-1" 
          sx={{ 
          overflowX: "auto", 
          maxWidth: "100%", }}>
            <Table key={colorMode} variant="simple" sx={{ minWidth: "1200px" /* Adjust as needed */ }}>
              <TableCaption sx={{
              color: tulisanColor,
              }}>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                    <Th sx={{
                  color: tulisanColor,
                  }}>ID</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>Date</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>Time</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>Mod</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>Nomor Seri</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>APC</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>BAC</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>l_id</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>l_id2</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>Weight</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>Unit</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>No Trial</Th>
                    <Th sx={{
                  color: tulisanColor,
                  }}>Operator</Th>
                </Tr>
              </Thead>
              <Tbody>{renderInstrumentList()}</Tbody>
            </Table>
          </TableContainer>  
          )}
          <div className="flex justify-center items-center mt-4 gap-4">
            <Button
              onClick={handlePrevPage}
              isDisabled={currentPage === 1}
              colorScheme="blue"
            >
              Previous
            </Button>
            <span className="text-text">
              Page {currentPage} of {Math.ceil(sartoriusData.length / rowsPerPage)}
            </span>
            <Button
              onClick={handleNextPage}
              isDisabled={currentPage === Math.ceil(sartoriusData.length / rowsPerPage)}
              colorScheme="blue"
            >
              Next
            </Button>
          </div>
          <ToastContainer position="top-center" autoClose={3000} 
          hideProgressBar closeOnClick pauseOnHover draggable  />  
      </div> 
    </div>
  );
}

export default Sartorius;