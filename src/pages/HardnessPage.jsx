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
import { color } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function HardnessPage() {
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");

  // State for chart data
  const [hardnessData, setHardnessData] = useState([]);
  const [thicknessData, setThicknessData] = useState([]);
  const [diameterData, setDiameterData] = useState([]);

  // State for table data and toggle
  const [tableData, setTableData] = useState([]);
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



  // const fetchData = async () => {
  //   let response = await Axios.get("http://10.126.15.137:8002/part/getHardnessData");
  //   setDataInstrument(response.data);
  // };

  // Function to fetch data for charts'
  // const fetchTableData1 = async () => {
  //   let response = await Axios.get(
  //     `http://10.126.15.137:8002/part/getHardnessData`,
  //     {
  //       params: {
  //         start: startDate,
  //         finish: finishDate,
  //       },
  //     }
  //   );
  //   setTableData(response.data.rows)
  // };

  const fetchTableData1 = async () => {
    let response = await Axios.get(
      `http://10.126.15.137:8002/part/getHardnessData`,
      {
        params: {
          start: startDate,
          finish: finishDate,
        },
      }
    );
    // Preproses data untuk format tanggal dan waktu
    const processedData = response.data.rows.map((row) => ({
      ...row,
      created_date: row.created_date.split("T")[0], // Ambil hanya bagian YYYY-MM-DD
      time_insert: row.time_insert.split(".")[0], // Ambil hanya bagian HH:MM:SS
    }));

    setTableData(processedData);
  };

  const fetchGraphHardness = async () => {
    let response = await Axios.get(
      `http://10.126.15.137:8002/part/getHardnessGraph`,
      {
        params: {
          start: startDate,
          finish: finishDate,
        },
      }
    );

      // Preprocess data to format created_date
      const processedData = response.data.rows.map((row) => ({
      ...row,
      label: row.label.split("T")[0], // Extract YYYY-MM-DD
    }));

    setHardnessData(processedData);
    // console.log(response.data.rows);
    // console.log("start", (startDate));
    // console.log("finish", (finishDate));   
    let response2 = await Axios.get(
      `http://10.126.15.137:8002/part/getThicknessGraph`,
      {
        params: {
          start: startDate,
          finish: finishDate,
        },
      }
    );
      // Preprocess data to format created_date
      const processedData2 = response2.data.rows.map((row) => ({
      ...row,
      label: row.label.split("T")[0], // Extract YYYY-MM-DD
    }));

    setThicknessData(processedData2);

    let response3 = await Axios.get(
      `http://10.126.15.137:8002/part/getDiameterGraph`,
      {
        params: {
          start: startDate,
          finish: finishDate,
        },
      }
    );

      // Preprocess data to format created_date
    const processedData3 = response3.data.rows.map((row) => ({
      ...row,
      label: row.label.split("T")[0], // Extract YYYY-MM-DD
    }));

    setDiameterData(processedData3);

  };

  // const fetchChartData = async () => {
  //   try {
  //     const hardnessResponse = await Axios.get(
  //       `http://10.126.15.137:8002/part/getHardnessGraph?start=${startDate}&finish=${finishDate}`
  //     );
  //     setHardnessData(
  //       hardnessResponse.data.map((item) => ({
  //         x: new Date(item.label), // Assuming 'label' is a timestamp or date string
  //         y: Number(item.y),
  //       }))
  //     );

  //     const thicknessResponse = await Axios.get(
  //       `http://10.126.15.137:8002/part/getThicknessGraph?start=${startDate}&finish=${finishDate}`
  //     );
  //     setThicknessData(
  //       thicknessResponse.data.map((item) => ({
  //         x: new Date(item.label),
  //         y: Number(item.y),
  //       }))
  //     );

  //     const diameterResponse = await Axios.get(
  //       `http://10.126.15.137:8002/part/getDiameterGraph?start=${startDate}&finish=${finishDate}`
  //     );
  //     setDiameterData(
  //       diameterResponse.data.map((item) => ({
  //         x: new Date(item.label),
  //         y: Number(item.y),
  //       }))
  //     );
  //   } catch (error) {
  //     console.error("Error fetching chart data:", error);
  //   }
  // };

  // Function to fetch table data
  // const fetchTableData = async () => {
  //   try {
  //     const response = await Axios.get("http://10.126.15.137:8002/part/getHardnessData");
  //     setTableData(response.data);
  //   } catch (error) {
  //     console.error("Error fetching table data:", error);
  //   }
  // };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah perilaku default pengiriman formulir
    setLoading(true); // Start spinner
    setError(null);   // Clear previous errors

    try {
      if (!startDate || !finishDate) {
        toast.error("Please enter both start and finish dates.");
        setLoading(false); // Stop spinner when validation fails
        return;
      }

      // fetching table data and 3 charts
      await fetchGraphHardness();
      await fetchTableData1();

      // Delay to ensure that the loading state is reset before showing the toast

        toast.success("Data successfully loaded!", { autoClose: 3000 });

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
      toast.error("Failed to fetch data. Please try again."); // Show error toast
    } finally {
      setLoading(false); // Stop spinner
      console.log("Finished fetching data, stopping spinner...");
    }
  };

  const handleShowAll = (e) => {
    if (tableData.length === 0) {
      toast.error("Please load data by submitting the form first.");
      return;
    }
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
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(tableData.length / rowsPerPage)));
  };

  const renderInstrumentList = () => {  
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleData = tableData.slice(startIndex, startIndex + rowsPerPage);

    if (tableData.length === 0) {
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
        <Td>{instrument.id_setup}</Td>
        <Td>{instrument.h_value}</Td>
        <Td>{instrument.d_value}</Td>
        <Td>{instrument.t_value}</Td>
        <Td>{instrument.status}</Td>
        <Td>{instrument.code_instrument}</Td>
        <Td>{instrument.created_date}</Td>
        <Td>{instrument.time_insert}</Td>
        <Td>{instrument.time_series}</Td>
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

  //==================================KODE BUAT CUSTOMISASI CHART ========================================

  const thicknessOptions = {
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
        dataPoints: thicknessData,   
      },
    ],     
  };

  const diameterOptions = {
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
  title: { text: "Diameter", fontColor: isDarkMode ? "white" : "black" },
  data: [
      {
        type: "spline",
        name: "Diameter",
        showInLegend: true,
        xValueFormatString: "",
        yValueFormatString: "",
        color: isDarkMode ? "#ffa500" : "#ff4500",
        lineColor: isDarkMode ? "#ffa500" : "#ff4500",
        markerColor: isDarkMode ? "#ffa500" : "#ff4500",
        markerSize: 2,
        dataPoints: diameterData,   
      },
    ],     
  };

  const hardnessOptions = {
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
  title: { text: "Hardness", fontColor: isDarkMode ? "white" : "black" },
  data: [
      {
        type: "spline",
        name: "Hardness",
        showInLegend: true,
        xValueFormatString: "",
        yValueFormatString: "",
        lineColor: isDarkMode ? "#00ff00" : "#32cd32",
        color: isDarkMode ? "#00ff00" : "#32cd32",
        markerColor: isDarkMode ? "#00ff00" : "#32cd32",
        markerSize: 2,
        dataPoints: hardnessData,   
      },
    ],     
  };
     

  // const diameterOptions = {
  //   ...commonOptions,
  //   title: { text: "Diameter", fontColor: isDarkMode ? "white" : "black" },
  //   data: [
  //     {
  //       type: "spline",
  //       name: "Diameter",
  //       showInLegend: true,
  //       xValueFormatString: "",
  //       yValueFormatString: "",
  //       dataPoints: diameterData,
  //       lineColor: isDarkMode ? "#ffa500" : "#ff4500",
  //       markerColor: isDarkMode ? "#ffa500" : "#ff4500",
  //     },
  //   ],
  // };

  // const hardnessOptions = {
  //   ...commonOptions,
  //   title: { text: "Hardness", fontColor: isDarkMode ? "white" : "black" },
  //   data: [
  //     {
  //       type: "spline",
  //       name: "Hardness",
  //       showInLegend: true,
  //       xValueFormatString: "",
  //       yValueFormatString: "",
  //       dataPoints: hardnessData,
  //       lineColor: isDarkMode ? "#00ff00" : "#32cd32",
  //       markerColor: isDarkMode ? "#00ff00" : "#32cd32",
  //     },
  //   ],
  // };

  //console.log(hardnessData);

  return (
    <>
      <div>
      <h1 className="block text-center font-medium text-4xl antialiased hover:subpixel-antialiased; p-6 pb-3">HARDNESS TESTER</h1>
      <p className="block text-center text-xl antialiased hover:subpixel-antialiased;">Instrument Production</p>
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
          <CanvasJSChart options={thicknessOptions} />
        )}
      </div>
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
          <CanvasJSChart options={diameterOptions} />
        )}
      </div>
      <br />
      <div className="block bg-card p-2 rounded-lg shadow-lg mx-8 overflow-auto">
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
          <div className="text-red-500 flex flex-col items-center ">No available data</div>
        ) : (
          <CanvasJSChart options={hardnessOptions} />
        )}
      </div>
      <br />
      <div className="flex flex-row justify-center" direction="row" align="center">
        <form onSubmit={handleSubmit}>
          <div className="main flex flex-col xl:flex-row gap-x-2 xl:gap-x-6">
            <div>
              <label
                htmlFor="start-date"
                className="block text-sm font-medium leading-6 text-text"
              >
                Start Date
              </label>
              <Input
                id="start-date"
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
              />
            </div>
            <div>
              <label
                htmlFor="finish-date"
                className="block text-sm font-medium leading-6 text-text"
              >
                Finish Date
              </label>
              <Input
                id="finish-date"
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
              />
            </div>
            <div className="xl:mt-8 sm:mt-2">
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </div>
      <br />
      <div className="flex flex-row justify-center gap-6 mt-3">
        <Button colorScheme="blue" onClick={handleShowAll}>
          Show All Data
        </Button>
        <div>
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
        </div>
        <Button colorScheme="red" onClick={() => handleHideAll()}>
          Hidden All Data
        </Button>
      </div>
      <br /> 
      {showAllData && (
      <TableContainer className="flex justify-center bg-card rounded-md mx-2" 
        sx={{ 
        overflowX: "auto", 
        maxWidth: "94%", }}>
        <Table key={colorMode} variant="simple" sx={{ minWidth: "1200px" /* Adjust as needed */ }}>
          <TableCaption sx={{
          color: tulisanColor,
          }}>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
                <Th sx={{
              color: tulisanColor,
              }}>No</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Hardness</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Diameter</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Thickness</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Status</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Code Instrument</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Date</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Time</Th>
                <Th sx={{
              color: tulisanColor,
              }}>Time Series</Th>
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
          Page {currentPage} of {Math.ceil(tableData.length / rowsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          isDisabled={currentPage === Math.ceil(tableData.length / rowsPerPage)}
          colorScheme="blue"
        >
          Next
        </Button>
      </div>
        <ToastContainer position="top-center" autoClose={3000} 
        hideProgressBar closeOnClick pauseOnHover draggable  />
      </div>
    </>
  );  
}

export default HardnessPage;
