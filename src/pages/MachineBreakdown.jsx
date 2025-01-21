import React, { useEffect, useState, useRef } from "react";
import moment from "moment/moment";
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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import App from "./PareetoLine";
import Pareto from "./ParetoData";
import { useSelector, useDispatch } from "react-redux";
import { fetchPart } from "../features/part/partSlice";
import { deletePartListData } from "../features/part/partSlice";
import { getDateMaintenance } from "../features/part/partSlice";
import { dropdown } from "bootstrap-css";
import axios from "axios";
import { useColorMode, useColorModeValue, Box } from "@chakra-ui/react";
import { useReactToPrint } from "react-to-print";


function MaintenanceBreakdown() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userGlobal = useSelector((state) => state.user.user);

  const [inputText, setInputText] = useState("");
  const [dropDown, UseDropDown] = useState("");
  const [datePicker, SetDatePicker] = useState(4);
  const partValue = useSelector((state) => state.part.partValue);
  const dateValue = useSelector((state) => state.prod.date);
  const [Name, setName] = useState();
  const ComponentPDF= useRef();

  const [isTableVisible, setIsTableVisible] = useState(true);
  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");

  // const fetchDataPLC = async () => {
  //   let response = await axios.get("http://10.126.15.137:8002/plc");
  //   let ava = response.data
  //     .replace(/455|(\r\n|\n|\r)/g, "")
  //     .replace(/(\w+)\s*:/g, '"$1":')
  //     .replace(/:\s*(\w+)/g, ': "$1"')
  //     .replace(/}0$/, "}");

  //   console.log(ava);
  // };

  useEffect(() => {
    // fetchDataPLC();
  }, []);
  const idData = "";
  const getDate = (e) => {
    var dataInput = e.target.value;

    SetDatePicker(dataInput);
    dispatch(fetchPart(dataInput));
    dispatch(getDateMaintenance(dataInput));
  };
  const deleteData = (id) => {
    dispatch(deletePartListData(id));
  };

  const inputHandler = (e) => {
    var variableInputData =  e.target.value;
    setInputText(variableInputData.toUpperCase())
   
    
  };

  let doprDown = (e) => {
    var dataInput1 = e.target.value;
    UseDropDown(dataInput1);
  };

  const filteredData = partValue.filter((obj) => {
    const month = new Date(obj.Tanggal).getUTCMonth();
    return month === 1;
  });

  //console.log(filteredData);

  const renderPartList = () => {
    const filterData = partValue.filter((el) => {
      if (inputText == "" && dropDown == "") {
        return el;
      }
      if (!dropDown == "" && inputText == "") {
        return el.Line.includes(dropDown);
      }
      if (!inputText == "" && dropDown == "") {
        return el.Mesin.toUpperCase().includes(inputText);
      }
      if (!dropDown == "" && !inputText == "") {
        return el.Mesin.toUpperCase().includes(inputText) && el.Line.includes(dropDown);
      }
      // if (inputText !== "" && dropDown === "") {
      //   return el.Mesin.toUpperCase().includes(inputText.toUpperCase());
      // }
      // // Filter by both Mesin and Line (case-insensitive)
      // if (dropDown !== "" && inputText !== "") {
      //   return (
      //     el.Mesin.toUpperCase().includes(inputText.toUpperCase()) &&
      //     el.Line.includes(dropDown)
      //   );
      // }
    });

    return filterData
      .sort((a, b) => b.Total - a.Total)
      .map((partdata) => (
          <Tr>
            <Td>{partdata.Mesin}</Td>
            <Td>{partdata.Line}</Td>
            <Td>{partdata.Pekerjaan}</Td>
            <Td>{moment(partdata.Tanggal).format("DD/MM/YYYY")}</Td>
            <Td>{partdata.Quantity}</Td>
            <Td>{partdata.Unit}</Td>
            <Td>{partdata.Pic}</Td>
            <Td>{partdata.Tawal}</Td>
            <Td>{partdata.Tahir}</Td>
            <Td>{partdata.Total}</Td>
            <Td>
              {userGlobal.level > 2 ? (
                <Button
                  colorScheme="green"
                  onClick={() => {
                    navigate(`/createedite/${partdata.id}`);
                  }}
                >
                  Edit
                </Button>
              ) : (
                <></>
              )}

              <Button colorScheme="red" onClick={() => deleteData(partdata.id)}>
                Delete
              </Button>
            </Td>
          </Tr>
        ));
  };
  const generatePDF =  useReactToPrint({
    content: ()=> ComponentPDF.current,
    documentTitle: Name+" Data"
  });

  return (
    <div>
      <div>
        <h1 class="text-center text-4xl antialiased hover:subpixel-antialiased; p-8 mr-5">
          PARETO MACHINE BREAKDOWN
        </h1>
        {userGlobal.level == 1 ? (
          <></>
        ) : (
          <>
            <App />
            <Pareto />
          </>
        )}
      </div>

      <Stack
        className="flex flex-row justify-center   "
        direction="row"
        spacing={4}
        align="center"
      >
        <div className="main">
          <h6 className="mb-2">Search Mesin</h6>
          <div className="search">
            <input
              onChange={inputHandler}
              id="outlined-basic"
              data-type="instrument"
              variant="outlined"
              fullWidth
              label="Search"
              className="block w-full rounded-md pl-1 bg-background border border-border hover:border-border2 text-text py-1.5 focus:ring-1 focus:ring-blue-700 focus:outline-none sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <Box key={colorMode}>
          <h6 className="mb-2">Monthly Search</h6>
          <Select placeholder="Select Month" onChange={getDate} 
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

        <Box key={colorMode}>
          <h6 className="mb-2">Line</h6>
          <Select placeholder="Select Line" onChange={doprDown}
          sx={{
            border: "1px solid",
            borderColor: borderColor,
            borderRadius: "0.395rem",
            background: "var(--color-background)", // background color from Tailwind config
  
            _hover: {
              borderColor: hoverBorderColor,
            },
          }}>
            <option value="Line1">Line 1</option>
            <option value="Line2">Line 2</option>
            <option value="Line3">Line 3</option>
            <option value="Line4">Line 4</option>
          </Select>
        </Box>

        <div>
          <br />
          <Button
            className="w-40 font-sans"
            colorScheme="blue"
            onClick={() => {
              navigate(`/createnew`);
            }}
          >
            Create New
          </Button>
        </div>
        <div>
          <br />
          <Button
            className="w-40 font-sans"
            colorScheme="red"
            onClick={() => setIsTableVisible(!isTableVisible)}
          >
            {isTableVisible ? "Hide All Data" : "Show All Data"}
          </Button>
        </div>
        <div>
          <br />
          <Button
            className="w-40 font-sans"
            colorScheme="green"
            onClick={generatePDF}
          >
            Export to PDF
          </Button>
        </div>
      </Stack>
      <br />
      {isTableVisible && (
      <TableContainer className="bg-card rounded-md"           
      sx={{ 
        overflowX: "auto", 
        maxWidth: "90%", }}>
        <Table key={colorMode} variant="simple" ref={ComponentPDF} sx={{ minWidth: "1200px" /* Adjust as needed */ }}>
          <TableCaption
          sx={{
            color: tulisanColor,
          }}>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th sx={{
            color: tulisanColor,
          }}>Mesin</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Line</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Pekerjaan</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Tanggal</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Quantity</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Unit</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Pic</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Awal Pengerjaan</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Akhir Pengerjaan</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Total</Th>
              <Th sx={{
            color: tulisanColor,
          }}>Action</Th>
            </Tr>
          </Thead>
          <Tbody>{renderPartList()}</Tbody>
        </Table>
      </TableContainer>
      )}

    </div>
  );
}

export default MaintenanceBreakdown;
