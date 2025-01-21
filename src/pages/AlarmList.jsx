import React, { useEffect, Component, useState } from "react";
import { Button, 
    ButtonGroup, 
    Stack, 
    Input, 
    Select, 
    Radio, 
    RadioGroup, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    TableContainer 
} from "@chakra-ui/react";
import axios from "axios";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

function AlarmList() {
  const [AlarmType, setAlarmType] = useState();
  const [startDate, setStartDate] = useState();
  const [finishDate, setFinishDate] = useState();
  const [AlarmData, setAlarmData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  const fetchAlarm = async () => {
    let response = await axios.get(
      "http://10.126.15.141:8002/part/AlarmList", 
      {
        params: {
          type: AlarmType,
          start: startDate,
          finish: finishDate,
        }
      }
    );
      setAlarmData(response.data);console.log(AlarmData);
    };

    let dateStart = (e) =>{
        var dataInput = e.target.value;
        setStartDate(dataInput);  
    };
    let dateFinish = (e) =>{
        var dataInput = e.target.value;
        setFinishDate(dataInput);
    };
    let getAlarmType = (e) => {
        var dataInput = e.target.value;
        setAlarmType(dataInput);
    };

    const handlePrevPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    
    const handleNextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(AlarmData.length / rowsPerPage)));
    };
  
    const table = () => {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const visibleData = AlarmData.slice(startIndex, startIndex + rowsPerPage);

      if (AlarmData.length === 0) {
        return (
          <Tr>
            <Td colSpan={3} margin="20px" className="text-center text-text">
              No data available
            </Td>
          </Tr>
        );
      }

      return visibleData.map((data, index) => (
        <Tr key={startIndex + index}>
          <Td border="1px">{startIndex + index + 1}</Td> {/* No column */}
          <Td border="1px">{data.Tanggal}</Td>
          <Td border="1px">{data.Event}</Td>
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
      
  return (
    <div>
      <div align="center" className="text-text">
        <h1 style={{ fontSize: "2rem"}}><b>Alarm Event List </b></h1>
      </div>
      <br />
      <Stack
        className="flex flex-row justify-center mb-4  "
        direction="row"
        spacing={4}
        align="center">
        <div>
          <h2 className="mb-1">Parameter</h2>
          <Select placeholder="Select Alarm" onChange={getAlarmType}>
            <option value="Alarm_Air_Event_Log">Pemakaian Air</option>
            <option value="Alarm_Loopo_Event_Log">Loopo</option>
            <option value="Alarm_Osmotron_Event_Log">Osmotron</option>
            <option value="Alarm_Suhu_Event_Log">Suhu</option>
            <option value="Alarm_RH_Event_Log">RH</option>
            <option value="Alarm_DP_Event_Log">DP</option>
          </Select>
        </div>
        <div>
          <h2 className="mb-1">Start Time</h2>
          <Input
            onChange={dateStart} 
            placeholder="Select Date"
            size="md"
            type="date"
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
          <h2 className="mb-1">Finish Time</h2>
          <Input
            onChange={dateFinish}
            placeholder="Select Date"
            size="md"
            type="date"
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
        <div className="mt-2">
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
        <div>
          <br />
          <Button
            className="m1-4"
            colorScheme="blue"
            onClick={() => fetchAlarm()}
          >
            Submit
          </Button>
        </div>
      </Stack>
      <br />
      <div className="bg-card rounded-md">
        <TableContainer class="center" marginLeft={"25%"} marginRight={"25%"}>
          <Table key={colorMode} variant="simple">
            <Thead>
              <Tr backgroundColor="blue.200" border="1px">
                <Th border="1px" 
                sx={{
                  color: tulisanColor,
                  }}
                  textAlign={"center"}>No</Th>
                <Th border="1px"
                sx={{
                  color: tulisanColor,
                  }}
                  textAlign={"center"}>Date Time</Th>
                <Th border="1px"
                sx={{
                  color: tulisanColor,
                  }} 
                  textAlign={"center"}>Event</Th>
              </Tr>
            </Thead>
            <Tbody >{table()}</Tbody>
          </Table>
        </TableContainer>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <Button
          onClick={handlePrevPage}
          isDisabled={currentPage === 1}
          colorScheme="blue"
        >
          Previous
        </Button>
        <span className="text-text">
          Page {currentPage} of {Math.ceil(AlarmData.length / rowsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          isDisabled={currentPage === Math.ceil(AlarmData.length / rowsPerPage)}
          colorScheme="blue"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
export default AlarmList;