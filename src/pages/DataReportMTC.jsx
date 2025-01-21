import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import {
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useColorMode, useColorModeValue, Box } from "@chakra-ui/react";

function DataReportMTC() {
  const [listData, setListData] = useState([]);
  const [dateData, setDateData] = useState(6);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  const dateHendeler = (e) => {
    var dataInput = e.target.value;
    setDateData(dataInput);
  };

  const fetchData = async () => {
    let response = await axios.get(
      "http://10.126.15.141:8002/part/dataReportMTC",
      {
        params: {
          date: dateData,
        },
      }
    );
    setListData(response.data);
    console.log(response.data);
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

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(listData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "DataReportMTC.xlsx");
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(listData.length / rowsPerPage)));
  };

  const renderListData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const visibleData = listData.slice(startIndex, startIndex + rowsPerPage);

    if (listData.length === 0) {
      return (
        <Tr>
          <Td colSpan={13} className="text-center text-text">
            No data available
          </Td>
        </Tr>
      );
    }

    return visibleData.map((users, index) => (
      <Tr key={index}>
        <Td>{users.id}</Td>
        <Td>{moment(users.tanggal).format("DD/MM/YYYY")}</Td>
        <Td>{users.line}</Td>
        <Td>{users.proces}</Td>
        <Td>{users.machine}</Td>
        <Td sx={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          maxWidth: "118px", // Adjust max width to your needs
        }}
        >{users.location}</Td>
        <Td>{users.pic}</Td>
        <Td>{users.start}</Td>
        <Td>{users.finish}</Td>
        <Td>{users.total}</Td>
        <Td>{users.status}</Td>
        <Td>{users.breakdown}</Td>
        <Td sx={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          minWidth: "260px", // Adjust max width to your needs
        }}>{users.jobDetail}</Td>
      </Tr>
    ));
  };

  return (
    <div>
      <div>
        <h1 className="text-center text-text text-4xl antialiased hover:subpixel-antialiased p-8">
          REPORT MAINTENANCE
        </h1>
      </div>

      <Stack
        className="flex flex-row justify-center"
        direction="row"
        spacing={4}
        align="center"
      >
        {/* <div className="main">
          <h1>Search Mesin</h1>
          <div className="search">
            <input
              id="outlined-basic"
              variant="outlined"
              fullWidth
              label="Search"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div> */}
        <Box key={colorMode}>
          <h6 className="mb-2">Monthly Search</h6>
          <Select placeholder="Select Month" onChange={dateHendeler} 
          sx={{
            border: "1px solid",
            borderColor: borderColor,
            borderRadius: "0.395rem",
            background: "var(--color-background)", // background color from Tailwind config
  
            _hover: {
              borderColor: hoverBorderColor,
            },
          }}>
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Mar</option>
            <option value="4">Apr</option>
            <option value="5">Mei</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Agu</option>
            <option value="9">Sep</option>
            <option value="10">Okt</option>
            <option value="11">Nov</option>
            <option value="12">Des</option>
          </Select>
        </Box>
        {/* <div>
          <h2>Line</h2>
          <Select placeholder="Select Line">
            <option value="Line4">FULL</option>
            <option value="Line1">Line 1</option>
            <option value="Line2">Line 2</option>
            <option value="Line3">Line 3</option>
            <option value="Line4">Line 4</option>
          </Select>
        </div> */}
        <div className="mt-4">
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
            className="w-40"
            colorScheme="blue"
            onClick={() => fetchData()}
          >
            Submit
          </Button>
        </div>
        <div>
          <br />
          <Button className="w-40" colorScheme="green" onClick={exportToExcel} >
            Export to Excel
          </Button>
        </div>
      </Stack>
      <br />
      <TableContainer className="bg-card rounded-md" sx={{ overflowX: "auto" }}>
        <Table key={colorMode} variant="simple">
          <Thead>
            <Tr>
              <Th sx={{
          color: tulisanColor,
        }}>Id</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Tanggal</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Line</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Process</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Machine</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Location</Th>
              <Th sx={{
          color: tulisanColor,
        }}>PIC</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Start</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Finish</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Total</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Status</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Breakdown</Th>
              <Th sx={{
          color: tulisanColor,
        }}>Job Detail</Th>
            </Tr>
          </Thead>
          <Tbody>{renderListData()}</Tbody>
        </Table>
      </TableContainer>
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
          Page {currentPage} of {Math.ceil(listData.length / rowsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          isDisabled={currentPage === Math.ceil(listData.length / rowsPerPage)}
          colorScheme="blue"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default DataReportMTC;
