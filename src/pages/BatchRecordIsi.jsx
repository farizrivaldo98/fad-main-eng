import { React, useState, useEffect } from "react";
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
  Box,
  Spinner,
  Select
} from "@chakra-ui/react";
import axios from "axios";
import Header from "../components/header";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

const BatchRecordIsi = () => {
  // States for fetching data
  const [fetchLineData, setFetchLineData] = useState([]);
  const [fetchProcesData, setFetchProcesData] = useState([]);
  const [fetchMachineData, setFetchMachineData] = useState([]);
  const [fetchBatchData, setFetchBatchData] = useState([]);
  const [mainData, setMainData] = useState([]);

  // States for user selections
  const [newLine, setNewLine] = useState("");
  const [newProces, setNewProces] = useState("");
  const [newMachine, setNewMachine] = useState("");
  const [dbMacchinem, setDbMachine] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [allDataEBR, setAllDataEBR] = useState([])

  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  const formatTimestamp = (uniqueTimestamp) => {
    const [seconds] = uniqueTimestamp.toString().split(".");
    const date = new Date(seconds * 1000); // Convert seconds to milliseconds
    const formattedDate = date.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });
    return `${formattedDate}`; // Return the formatted date without fractional seconds
    // return `${formattedDate}.${fractional || "00"}`; // Uncomment this line if you want to include fractional seconds
  };

    // Fetch Line data
    const fetchLine = async () => {
      let response = await axios.get("http://10.126.15.137:8002/part/lineData");
      setFetchLineData(response.data);
    };
  
    // Fetch Process data based on the selected line
    const fetchProces = async (line) => {
      let response = await axios.get(
        "http://10.126.15.137:8002/part/procesData",
        { params: { line_name: line } }
      );
      setFetchProcesData(response.data);
    };
  
    // Fetch Machine data based on the selected line and process
    const fetchMachine = async (line, proces) => {
      let response = await axios.get(
        "http://10.126.15.137:8002/part/machineData",
        { params: { line_name: line, proces_name: proces } }
      );
      setFetchMachineData(response.data);
    };
  
    const fetchBatch = async (machine, start, finish, line, setMainData) => {
      let area = "";
      //console.log("Params sent to backend:", { area, start, finish });        
      if (line === "line1") {
        switch (machine) {
          case "PMA":
            area = "cMT-FHDGEA1_EBR_PMA_data";
            break;
          case "Wetmill":
            area = "cMT-FHDGEA1_EBR_Wetmill_data";
            break;
          case "EPH":
            area = "cMT-FHDGEA1_EBR_EPH_data";
            break;
          case "FBD":
            area = "cMT-FHDGEA1_EBR_FBD_data";
            break;
          default:
            //console.error("Invalid machine selected for line1.");
            return; // Exit early
        }
      } else if (line === "line3") {
        switch (machine) {
          case "PMA":
            area = "cMT-GEA-L3_EBR_PMA_L3_data";
            break;
          case "Wetmill":
            area = "cMT-GEA-L3_EBR_WETMILL_L3_data";
            break;
          case "EPH":
            area = "cMT-GEA-L3_EBR_EPH_L3_data";
            break;
          case "FBD":
            area = "cMT-GEA-L3_EBR_FBD_L3_data";
            break;
          default:
            console.error("Invalid machine selected for line3.");
            return; // Exit early
        }
      } else {
        console.error("Invalid line selected.");
        return; // Exit early
      }
      const area1 =
          newLine === "line1"
            ? {
                PMA: "cMT-FHDGEA1_EBR_PMA_data",
                Wetmill: "cMT-FHDGEA1_EBR_Wetmill_data",
                EPH: "cMT-FHDGEA1_EBR_EPH_data",
                FBD: "cMT-FHDGEA1_EBR_FBD_data",
              }[newMachine]
            : {
                PMA: "cMT-GEA-L3_EBR_PMA_L3_data",
                Wetmill: "cMT-GEA-L3_EBR_WETMILL_L3_data",
                EPH: "cMT-GEA-L3_EBR_EPH_L3_data",
                FBD: "cMT-GEA-L3_EBR_FBD_L3_data",
              }[newMachine];
              setDbMachine(area1)
              console.log("Current machine:", dbMacchinem);
              console.log("Selected batch:", selectedBatch);
    
      if (!area) {
        console.error("Area mapping failed.");
        return;
      }
    
      // Define endpoint
      const endpoint =
        line === "line1"
          ? "http://10.126.15.137:8002/part/BatchRecord1"
          : "http://10.126.15.137:8002/part/BatchRecord3";
    
      try {
        const response = await axios.get(endpoint, {
          params: { area, start, finish },
        });
    
        if (response.data && Array.isArray(response.data)) {
          const batchData = response.data.map((item) => item.BATCH || "Unknown Batch"); // Extract BATCH
          //console.log("Batch data fetched:", batchData);
          setFetchBatchData(batchData); // Update dropdown
        } else {
          //console.warn("No data received or data is not in array format.");
          setFetchBatchData([]); // Clear dropdown
        }
      } catch (error) {
        //console.error("Error fetching batch data:", error);
        alert("Failed to fetch batch data. Please check your input and try again.");
      }
    };

    const getDataEbrData = async () => {
      let response = await axios.get(
        "http://10.126.15.137:8002/part/SearchBatchRecord",{
          params:{
            area : dbMacchinem,
            data : selectedBatch
          }
        }
      )
      setAllDataEBR(response.data)
      
      
      
      
    }
    
    const handleSubmit = async (e) => {
      fetchBatch()
      //e.preventDefault();
      getDataEbrData()    
    
      // Ensure all necessary fields are filled
      if (!newMachine || !startDate || !finishDate || !newLine) {
        alert("Please fill in all required fields.");
        return;
      }
    
      try {
        setMainData([]); // Reset main data before fetching
    
        
             
              
   
      } catch (error) {
        //console.error("Error fetching batch record:", error);
        alert("An error occurred while fetching the batch record.");
      }
    };
    
    
  
    // Handlers for input changes
    const lineHandler = (event) => {
      const selectedLine = event.target.value;
      setNewLine(selectedLine);
      fetchProces(selectedLine); // Fetch processes based on the selected line
      
    };
  
    const procesHandler = (event) => {
      const selectedProces = event.target.value;
      setNewProces(selectedProces);
      // fetchMachine(newLine, selectedProces); // Fetch machines based on line and process
      fetchMachine(newLine || "", selectedProces); // Ensure `newLine` is valid
    };
  
    const machineHandler = (event) => {
      setNewMachine(event.target.value);
    };
  
    const startDateHandler = (event) => {
      setStartDate(event.target.value);
    };
  
    const finishDateHandler = (event) => {
      const finishValue = event.target.value;
      setFinishDate(finishValue);

      // Check if all necessary inputs are filled
      if (newMachine && startDate && finishValue && newLine) {
        fetchBatch(newMachine, startDate, finishValue, newLine);
      }
    };

    // const cleanBatchData = fetchBatchData.map(batch =>
    //   batch.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim()
    // );

    const cleanBatchData = fetchBatchData.map(batch => {
      // Remove unprintable characters and trim
      const cleaned = batch.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
      // Extract only the part before unwanted characters (e.g., $, %, !)
      const match = cleaned.match(/^[A-Za-z0-9-]+/);
      return match ? match[0] : cleaned;
    });
    //console.log("Cleaned Batch Data:", cleanBatchData);
  
    useEffect(() => {
      fetchLine(); // Fetch line data on component mount
    }, []);

    useEffect(() => {
      console.log("Current line:", newLine);
      console.log("Current process:", newProces);
      console.log("Current machine:", dbMacchinem);
      console.log("Selected batch:", selectedBatch);
    }, [newLine, newProces, newMachine, selectedBatch]);

    useEffect(() => {
      if (newMachine && startDate && finishDate && newLine) {
        fetchBatch(newMachine, startDate, finishDate, newLine);
      }
    }, [newMachine, startDate, finishDate, newLine]);
  
    // Rendering the fetched data into options
    const renderLine = () => {
      return fetchLineData.map((line) => (
        <option key={line.line_name} value={line.line_name}>
          {line.line_name}
        </option>
      ));
    };
  
    const renderProces = () => {
      return fetchProcesData.map((proces) => (
        <option key={proces.proces_name} value={proces.proces_name}>
          {proces.proces_name}
        </option>
      ));
    };
  
    const renderMachine = () => {
      return fetchMachineData.map((machine) => (
        <option key={machine.machine_name} value={machine.machine_name}>
          {machine.machine_name}
        </option>
      ));
    };

    // const handleSubmit = () => {
    //   const machine = selectedMachine; // Selected machine from dropdown
    //   const start = selectedStartDate; // Start date
    //   const finish = selectedEndDate; // End date
    //   const line = selectedLine; // Selected line
    
    //   fetchBatch(machine, start, finish, line, setMainData);
    // };
    
    // const renderBatch = () => {
    //   return fetchBatchData.map((batch) => (
    //     <option key={batch.id} value={batch.batch}>
    //       {batch.batch}
    //     </option>
    //   ));
    // };
  

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(allDataEBR.length / rowsPerPage)));
  };

  const renderTableHeader= () => {
    // Pastikan visibleData tidak kosong
    if (allDataEBR.length > 0) {
      // Ambil semua kunci dari objek pertama dalam visibleData
      const dataKeys = Object.keys(allDataEBR[0]);
  
      return (
        <thead>
          <tr>
            {dataKeys.map((dataKey, index) => (
              <th className="text-center px-4 py-2 whitespace-normal" key={index}>
                {dataKey}
              </th>
            ))}
          </tr>
        </thead>
      );
    }
    return null; // Jika visibleData kosong, kembalikan null
  };

  const cleanData = (dataKey, value) => {
    if (dataKey === "BATCH" || dataKey === "PROCESS") {
      return value.replace(/[^a-zA-Z0-9\s-]/g, '');
    }
    if (dataKey === "impeller_rpm" || dataKey === "impeller_ampere") {
      // Format the value to 2 decimal places
      return parseFloat(value).toFixed(2);
    }
    if (dataKey === "time@timestamp") {
      // Format the timestamp to a readable format
      return formatTimestamp(value);
    }
    return value;
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleData = allDataEBR.slice(startIndex, startIndex + rowsPerPage);

    if (allDataEBR.length == 0) {
      return (
        <Tr>
          <Td colSpan={12} className="text-center text-text">
            No data available
          </Td>
        </Tr>
      );
    }else{
      return visibleData.map((row, index) => {
        // Ambil semua kunci dari objek row
        const dataKeys = Object.keys(row);
      
        return (
          <Tr key={index}>
            {dataKeys.map((dataKey, dataIndex) => (
              <Td className="text-center bg-cobabg" key={dataIndex}>
                {cleanData(dataKey, row[dataKey])}
              </Td>
            ))}
          </Tr>
        );
      });
      
    }

  
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

  //========================HENDELER========================================
  // const lineHendeler = (event) => {
  //   setNewLine(event.target.value);
  //   fetchProces(event.target.value);
  //   //console.log(event.target.value);
  // };

  // const procesHendeler = (event) => {
  //   setNewProces(event.target.value);
  //   fetchMachine(newLine, event.target.value);
  //   //console.log(event.target.value);
  // };

  // const machineHendeler = (event) => {
  //   setNewMachine(event.target.value);
  //   //console.log(event.target.value);
  // };

  // const submitHendeler = (even) => {
  //   getDataWithMachine();
  //   console.log(newMachine);
  // };

  // const batchHendeler = (even) => {
  //   setNoBatch(even.target.value);
  //   console.log(even.target.value);
  // };

  // useEffect(() => {
  //   fetchLine();
  // }, []);

  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="w-full sm:w-1/3 md:w-auto">
                <div>
                  <label
                    htmlFor="line"
                    className="block text-sm font-medium leading-6 text-text"
                  >
                    Line Area
                  </label>
                  <div className="mt-2">
                    <Select placeholder="All Line" id="line" onChange={lineHandler}
                      sx={{
                        border: "1px solid",
                        borderColor: borderColor,
                        borderRadius: "0.395rem",
                        background: "var(--color-background)", // background color from Tailwind config
              
                        _hover: {
                          borderColor: hoverBorderColor,
                        },
                      }}>
                      {renderLine()}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/3 md:w-auto">
                <div>
                  <label
                    htmlFor="proces"
                    className="block text-sm font-medium leading-6 text-text"
                  >
                    Process
                  </label>
                  <div className="mt-2">
                    <Select placeholder="All Process" onChange={procesHandler}
                      sx={{
                        borderRadius: "0.395rem",
                      }}>
                      {renderProces()}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/3 md:w-auto">
                <div>
                  <label
                    htmlFor="machine"
                    className="block text-sm font-medium leading-6 text-text"
                  >
                    Machine
                  </label>
                  <div className="mt-2">
                    <Select placeholder="All Machine" onChange={machineHandler}>
                      {renderMachine()}
                    </Select>
                  </div>
                </div> 
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <div>
                  <label
                    htmlFor="line"
                    className="block text-sm font-medium leading-6 text-text"
                  >
                    Start Date
                  </label>
                  <Input
                    //onChange={dateStart}
                    placeholder="Select Date and Time"
                    size="md"
                    type="date"
                    value={startDate}
                    onChange={startDateHandler}
                    // onChange={(e) => setStartDate(e.target.value)}
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
              <div className="w-full sm:w-1/2 md:w-auto">
                <div>
                  <label
                    htmlFor="line"
                    className="block text-sm font-medium leading-6 text-text"
                  >
                    Finish Date
                  </label>
                  <Input
                    //onChange={dateFinish}
                    placeholder="Select Date and Time"
                    size="md"
                    type="date"
                    value={finishDate}
                    onChange={finishDateHandler}
                    // onChange={(e) => setFinishDate(e.target.value)}
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
              <div className="w-full sm:w-1/2 md:w-auto">
              <div>
                  <label
                    htmlFor="line"
                    className="block text-sm font-medium leading-6 text-text"
                  >
                    Search Batch
                  </label>
                  <div className="search">
                    <Select
                      placeholder="Select Batch"
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                    >
                    {/* <option value="">Select Batch</option> */}
                    {cleanBatchData.length > 0 ? (
                      cleanBatchData.map((batch, index) => (
                        <option key={index} value={batch}>
                          {batch}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No Batch Data Available
                      </option>
                    )}
                    </Select>
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/2 md:w-auto">
                <div className="no-print">
                  <Button
                    className="w-40 mt-8 no-print"
                    colorScheme="blue"
                    type="submit"
                    //onSubmit={handleSubmit}
                     onClick={() => handleSubmit()}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
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
            <div className="flex justify-center">
            <TableContainer className="bg-card rounded-md mt-4 mx-6" sx={{ overflowX: "auto", maxWidth: "90%" }}>
                <Table key={colorMode} variant="simple" sx={{ minWidth: "1200px"}} >
                  <TableCaption sx={{
                      color: tulisanColor,
                      }}>Batch Record</TableCaption>
                  {renderTableHeader()}
                  <Tbody>{renderData()}</Tbody>
                </Table>
              </TableContainer>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-4 gap-4 mb-2">
              <Button
                onClick={handlePrevPage}
                isDisabled={currentPage === 1}
                colorScheme="blue"
              >
                Previous
              </Button>
              <span className="text-text">
                Page {currentPage} of {Math.ceil(allDataEBR.length / rowsPerPage)}
              </span>
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === Math.ceil(allDataEBR.length / rowsPerPage)}
                colorScheme="blue"
              >
                Next
              </Button>
            </div>
            
          </>
        );
      }

export default BatchRecordIsi