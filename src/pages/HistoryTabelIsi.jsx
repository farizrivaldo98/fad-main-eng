import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableContainer, TableCaption, Thead, Tr, Th, Tbody, Td, Button, Select
} from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

const HistoryTabelIsi = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedEndpoint, setSelectedEndpoint] = useState('');

    const { colorMode } = useColorMode();
    const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
    const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
    const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");
    const kartuColor = useColorModeValue("rgba(var(--color-card))", "rgba(var(--color-card))");
  
    const [isDarkMode, setIsDarkMode] = useState(
      document.documentElement.getAttribute("data-theme") === "dark"
    );

    const endpoints = [
        { value: '/GetDailyVibrasi138', label: 'Get Daily Vibrasi 138' },
        { value: '/GetDailyGedung138', label: 'Get Daily Gedung 138' },
        { value: '/GetDailyChiller138', label: 'Get Daily Chiller 138' },
        { value: '/GetDailyBoiler138', label: 'Get Daily Boiler 138' },
        { value: '/GetDailyInstrumentIPC', label: 'Get Daily Instrument IPC' },
        { value: '/GetDailyPower55', label: 'Get Daily Power 55' },
      ];
    
      const fetchData = async () => {
        if (!selectedEndpoint) {
          alert('Please select an endpoint');
          return;
        }
    
        setLoading(true);
        setError(false);
        try {
          const response = await axios.get(`http://10.126.15.137:8002/part${selectedEndpoint}`);
          setData(response.data);
          setIsTableVisible(true);
        } catch (error) {
          console.error('Error fetching data: ', error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
    
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      };
    
      const renderData = () => {
        const flattenedData = data.flat();
        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        const currentData = flattenedData.slice(indexOfFirstRow, indexOfLastRow);
    
        if (flattenedData.length === 0) {
          return (
            <Tr>
              <Td colSpan={3} className="text-center text-text">
                No data available
              </Td>
            </Tr>
          );
        }
    
        return currentData.map((row, index) => {
          const [name, value] = Object.entries(row)[0];
          return (
            <Tr key={index}>
              <Td className="text-center">{indexOfFirstRow + index + 1}</Td>
              <Td className="text-center">{name.replace(/_/g, ' ')}</Td>
              <Td className="text-center">{formatDate(value)}</Td>
            </Tr>
          );
        });
      };
    
      const handleNextPage = () => {
        if (currentPage < Math.ceil(data.flat().length / rowsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      };
    
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
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

  return (
    <>
    <div className="w-full max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Data Viewer</h1>
      </div>   
      <div>
        <div className="space-y-6 md:space-y-0 xl:flex xl:items-start xl:space-x-4">
          <div className="flex flex-col space-y-4 xl:w-1/3">
            <div className="space-y-2">
            
            </div>
           </div>
        </div>
        <Select value={selectedEndpoint} onChange={(e) => setSelectedEndpoint(e.target.value)}>
          <option value="">Select an option</option>
          {endpoints.map((endpoint) => (
            <option key={endpoint.value} value={endpoint.value}>
              {endpoint.label}
            </option>
          ))}
        </Select>
        <Button onClick={fetchData} colorScheme="blue" className="w-40 mt-8">Submit</Button>
      </div>
      <div>
      <div className="col-span-1 xl:flex xl:flex-none xl:w-20 flex-col ">
          <label className="block text-sm font-medium leading-4 text-text">
            Rows
          </label>
          <Select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            width="80px"
            sx={{
              border: "1px solid",
              borderColor: borderColor,
              borderRadius: "0.395rem",
              background: "var(--color-background)",
              _hover: {
                borderColor: hoverBorderColor,
              },
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={100}>100</option>
          </Select>
        </div>
        <Button
          className="w-40 mt-2"
          colorScheme="red"
          onClick={() => setIsTableVisible(!isTableVisible)}
        >
          {isTableVisible ? "Hide All Data" : "Show All Data"}
        </Button>
      </div>
      {isTableVisible && (
        <div className="table-fixed mt-6">
          <TableContainer className="bg-card rounded-md">
            <Table variant="simple">
              <TableCaption>Motor Vibration Data</TableCaption>
              <Thead>
                <Tr>
                  <Th className="w-3/12 text-center px-6"
                  sx={{
                    color: tulisanColor,
                    }}>No</Th>
                  <Th className="w-6/12 text-center px-6"
                  sx={{
                    color: tulisanColor,
                    }}>Data Name</Th>
                  <Th className="w-3/12 text-center px-6"
                  sx={{
                    color: tulisanColor,
                    }}>Date</Th>
                </Tr>
              </Thead>
              <Tbody>{renderData()}</Tbody>
            </Table>
          </TableContainer>

          <div className="flex justify-center items-center mt-4 gap-4">
            <Button onClick={handlePrevPage} isDisabled={currentPage === 1} colorScheme="blue">
              Previous
            </Button>
            <span className="text-text">Page {currentPage} of {Math.ceil(data.flat().length / rowsPerPage)}</span>
            <Button onClick={handleNextPage} isDisabled={currentPage === Math.ceil(data.flat().length / rowsPerPage)} colorScheme="blue">
              Next
            </Button>
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p>Error fetching data</p>}
      </div>
    </>
  )
}

export default HistoryTabelIsi