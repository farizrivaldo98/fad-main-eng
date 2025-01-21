import React, { useEffect, Component, useState } from "react";
import CanvasJSReact from "../canvasjs.react";
import { Button, ButtonGroup, Stack, Input, Select, Tbody, Tr, Th, Td, Table, Box, TableContainer, Thead, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { ExportToExcel } from "../ExportToExcel";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default function HVACchillerChart() {
  const [data, setData] = useState([])
  const [data1, setData1] = useState([])
  const [data2, setData2] = useState([])
  const [data3, setData3] = useState([])
  const [area, setArea] = useState();
  const [label1, setlabel1] = useState([]);
  const [label2, setlabel2] = useState([]);
  const [label3, setlabel3] = useState([]);
  const [label4, setlabel4] = useState([]);
  const [ChillerTable, setChillerTable] = useState();
  const [KompTable, setKomTable] = useState();
  const [DataTable1, setDataTable1] = useState([]);
  const [DataTable2, setDataTable2] = useState([]);
  const [DataTable3, setDataTable3] = useState([]);
  const [DataTable4, setDataTable4] = useState([]);
  const [DataTable5, setDataTable5] = useState([]);
  const [DataTable6, setDataTable6] = useState([]);
  const [DataTable7, setDataTable7] = useState([]);
  const [DataTable8, setDataTable8] = useState([]);
  const [DataTable9, setDataTable9] = useState([]);
  const [DataTable10, setDataTable10] = useState([]);
  const [DataTable11, setDataTable11] = useState([]);
  const [DataTable12, setDataTable12] = useState([]);
  const [ChooseData, setChooseData] = useState();
  const [startDate, setStartDate] = useState();
  const [oliatas, setoliatas] = useState();
  const [finishDate, setFinishDate] = useState();
  const [list, setList] = useState([{ area: "", chiller: "",komp: "", start: "", finish: "" }]);
  const [state, setState] = useState();
  const [deletestate, setdelete] = useState();
  const [fileName, setfilename] = useState();
  const [fanoutdoor, setfanoutdoor] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loadingTable, setLoadingTable] = useState(false);
  const [errorTable, setErrorTable] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  

  const { colorMode } = useColorMode();
  const borderColor = useColorModeValue("rgba(var(--color-border))", "rgba(var(--color-border))");
  const tulisanColor = useColorModeValue("rgba(var(--color-text))", "rgba(var(--color-text))");
  const hoverBorderColor = useColorModeValue("rgba(var(--color-border2))", "rgba(var(--color-border2))");
  const kartuColor = useColorModeValue("rgba(var(--color-card))", "rgba(var(--color-card))");

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

  const fetchDataChiller = async () => {
    console.log("Fetching data...");
    setLoading(true); // Start spinner
    setError(null); // Clear previous errors

    try {
      let arr = list.map((item) => ({ params: item })); // Create array of request params

      console.log("Requesting data for all 4 areas...");

       // Fetch all data concurrently
      const [response, response1, response2, response3] = await Promise.all([
        axios.get("http://10.126.15.141:8002/part/ChillerGraph", arr[0]),
        axios.get("http://10.126.15.141:8002/part/ChillerGraph", arr[1]),
        axios.get("http://10.126.15.141:8002/part/ChillerGraph", arr[2]),
        axios.get("http://10.126.15.141:8002/part/ChillerGraph", arr[3]),
      ]);

      console.log("Data fetched successfully for all areas.");
    console.log("Response 1:", response.data); // Log responses to verify the data
    console.log("Response 2:", response1.data);
    console.log("Response 3:", response2.data);
    console.log("Response 4:", response3.data);

     // Handle empty responses by setting default values if no data
     if (!response.data.length) {
      console.warn("Response 1 has no data, using default values.");
      response.data = []; // Set default empty array if no data
    }
    if (!response1.data.length) {
      console.warn("Response 2 has no data, using default values.");
      response1.data = []; // Set default empty array if no data
    }
    if (!response2.data.length) {
      console.warn("Response 3 has no data, using default values.");
      response2.data = []; // Set default empty array if no data
    }
    if (!response3.data.length) {
      console.warn("Response 4 has no data, using default values.");
      response3.data = []; // Set default empty array if no data
    }

      const mappedData = mapData(response.data, area);
      setData(mappedData); // Set the mapped data

      const mappedData1 = mapDataResponse1(response1.data, area); // Mapping response1 data
      setData1(mappedData1); // Set mapped data for the second response

      const mappedData2 = mapDataResponse2(response2.data, area); // Mapping response2 data
      setData2(mappedData2); // Set mapped data for the third response

      const mappedData3 = mapDataResponse3(response3.data, area); // Mapping response3 data
      setData3(mappedData3); // Set mapped data for the fourth response

        console.log("All data fetched successfully");
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      } finally {
        const delay = 2000; // 2 seconds in milliseconds
        setTimeout(() => {
          setLoading(false); // Stop spinner after requests finish
          console.log("Finished fetching data, stopping spinner...");
        }, delay);
        
      }             
    };
        const fetchName = () => {
          setlabel1(list.at(0).area);
          setlabel2(list.at(1).area);
          setlabel3(list.at(2).area);
          setlabel4(list.at(3).area);
        };
        const mapData = (data, area) => {
          return data.map((item) => {
            // Define the default structure for each item
            let mappedItem = {
              label: item.label,
              y: item.y,
              x: item.x,
            };
        
            // Apply transformations based on specific areas
            if (area === "R-EvapPress") {
              mappedItem.y = item.y * 2; // Example of modifying y for "R-EvapPress"
            } else if (area === "R-UnitCap" || area === "R-Status" || area === "R-Alarm") {
              mappedItem.x = item.x + 10; // Example of modifying x for other areas
            } else {
              // The default transformation when area doesn't match any condition
              // Here you can modify the data in the default way you need
              mappedItem.y = item.y;  // Or apply any default transformation if needed
              mappedItem.x = item.x;  // Default behavior for "x"
            }
        
            // Return the mapped item
            return mappedItem;
          });
        };
        const mapDataResponse1 = (data, area) => {
          return data.map((item) => {
            let mappedItem = {
              label: item.label,
              y: item.y,
              x: item.x,
            };
        
            if (area === "R-EvapPress") {
              mappedItem.y = item.y * 2; // Example of modifying y for "R-EvapPress"
            } else if (area === "R-UnitCap" || area === "R-Status" || area === "R-Alarm") {
              mappedItem.x = item.x + 10; // Example of modifying x for other areas
            } else {
              mappedItem.y = item.y;  // Default behavior for "y"
              mappedItem.x = item.x;  // Default behavior for "x"
            }
        
            return mappedItem;
          });
        };
        const mapDataResponse2 = (data, area) => {
          return data.map((item) => {
            let mappedItem = {
              label: item.label,
              y: item.y,
              x: item.x,
            };
        
            if (area === "R-EvapPress") {
              mappedItem.y = item.y * 2; // Example of modifying y for "R-EvapPress"
            } else if (area === "R-UnitCap" || area === "R-Status" || area === "R-Alarm") {
              mappedItem.x = item.x + 10; // Example of modifying x for other areas
            } else {
              mappedItem.y = item.y;  // Default behavior for "y"
              mappedItem.x = item.x;  // Default behavior for "x"
            }
        
            return mappedItem;
          });
        };
        const mapDataResponse3 = (data, area) => {
          return data.map((item) => {
            let mappedItem = {
              label: item.label,
              y: item.y,
              x: item.x,
            };
        
            if (area === "R-EvapPress") {
              mappedItem.y = item.y * 2; // Example of modifying y for "R-EvapPress"
            } else if (area === "R-UnitCap" || area === "R-Status" || area === "R-Alarm") {
              mappedItem.x = item.x + 10; // Example of modifying x for other areas
            } else {
              mappedItem.y = item.y;  // Default behavior for "y"
              mappedItem.x = item.x;  // Default behavior for "x"
            }
        
            return mappedItem;
          });
        };     
                
    const handleAddlist = () => {  
        setList ([...list, {area: "", chiller: "",komp: "", start: "", finish: ""}])
    };
        
    const handleDeleteList = (i) => {
        const newList = [...list];
        newList.splice(i, 1);
        setList(newList);
        if (i === 1){
          setData1()}
        else if (i === 0){
          setData()
        }
        else if (i === 2){
          setData2()
        }
        else if (i === 3){
          setData3()
        }
    };
    const handleListChange = (e, i) => {
        const field = e.target.name;
        const newList = [...list];
        newList[i][field] = e.target.value;
        setList(newList); 
    };

    useEffect(() => {
      console.log("loading state changed:", loading);
      console.log("error state changed:", error);
    }, [loading, error]); // Runs whenever `loading` or `error` state changes
    
    
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

    var localeOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "UTC",
      hour12: false
    };

    const options = {
      zoomEnabled: true,
      theme: isDarkMode ? "dark2" : "light2",
      backgroundColor: isDarkMode ? "#171717" : "#ffffff",
      title: {
        text: "HVAC Chiller",
        fontColor: isDarkMode ? "white" : "black"
      },
      axisY: {
        prefix: "",
      },
      axisX: {
        valueFormatString: "YYYY-MMM-DD HH:mm K",
        labelFormatter: function(e) {
          let date = new Date(e.value);
          let content = date.toLocaleDateString("en-US", localeOptions);
          return content;
        }
      },
      toolTip: {
        shared: true,
      }, 
      data: [
        {
          type: "spline",
          name: "1."+label1,
          showInLegend: true,
          markerType: "circle",
          yValueFormatString: "",
          xValueType: "dateTime",
          dataPoints: data,
          color: "red"
        },
        {
          type: "spline",
          name: "2."+label2,
          showInLegend: true,
          markerType: "circle",
          yValueFormatString: "",
          xValueType: "dateTime",
          dataPoints: data1,
          color: "blue"
        },
        {
          type: "spline",
          name: "3."+label3,
          showInLegend: true,
          markerType: "circle",
          yValueFormatString: "",
          xValueType: "dateTime",
          dataPoints: data2,
          color: "green"
        },
        {
          type: "spline",
          name: "4."+label4,
          showInLegend: true,
          markerType: "circle",
          yValueFormatString: "",
          xValueType: "dateTime",
          dataPoints: data3,
          color: "magenta"
        },
      ],
    };
      useEffect(()=>{
        if (list.length >=4){
            setState(true);
        } else {
            setState(false);
        }
        
      });
      let dateStart = (e) =>{
        var dataInput = e.target.value;
        setStartDate(dataInput);
        
      };
      let dateFinish = (e) =>{
        var dataInput = e.target.value;
         setFinishDate(dataInput);
      };
      let DataType = (e) =>{
        var dataInput = e.target.value;
         setChooseData(dataInput);
      };
      let chillerData = (e) =>{
        var dataInput = e.target.value;
         setChillerTable(dataInput);
      };
      let KompData = (e) =>{
        var dataInput = e.target.value;
         setKomTable(dataInput);
      };
      useEffect(() =>{
        if (KompTable ==="K2CH"){
          setoliatas("OlGlas");
        } else if (KompTable ==="K1CH"){
          setoliatas("OliGls")
        } 
      });
      useEffect(() =>{
        if (KompTable ==="K2CH"){
          setfanoutdoor("dr");
        } else if (KompTable ==="K1CH"){
          setfanoutdoor("dor")
        } 
      });

      const fetchChillerTable = async () => {
        try {
          setLoadingTable(true); // Start spinner
          setErrorTable(null);   // Clear previous errors
          let response4 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerStatus", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          );
          let response5 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerKondisi", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
                oliats: oliatas,
              }
            }
          );
          let response6 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerNama", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          let response7 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData1", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          let response8 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData2", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          let response9 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData3", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          let response10 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData4", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          );
          let response11 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData5", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
                fan: fanoutdoor,
              }
            }
          ); 
          let response12 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData6", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          let response13 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData7", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          let response14 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData8", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          let response15 = await axios.get(
            "http://10.126.15.141:8002/part/ChillerData9", 
            {
              params: {
                start: startDate,
                finish: finishDate,
                chiller: ChillerTable,
                komp: KompTable,
              }
            }
          ); 
          setfilename("Data HVAC "+ KompTable +ChillerTable)
          
          setDataTable1(response4.data);
          setDataTable2(response5.data);
          setDataTable3(response6.data);
          setDataTable4(response7.data);
          setDataTable5(response8.data);
          setDataTable6(response9.data);
          setDataTable7(response10.data);
          setDataTable8(response11.data);
          setDataTable9(response12.data);
          setDataTable10(response13.data);
          setDataTable11(response14.data);
          setDataTable12(response15.data);
          setIsTableVisible(true); // Show the table
        } catch (err) {
          console.error("Error fetching table data:", err);
          setErrorTable("No available data"); // Handle error
        } finally {
          setLoadingTable(false); // Stop spinner
        }
        };
        const TableDataFull = DataTable1.concat(DataTable2,
          DataTable3,
          DataTable4,
          DataTable5,
          DataTable6,
          DataTable7,
          DataTable8,
          DataTable9,
          DataTable10,
          DataTable11,
          DataTable12
        );
        var obj = {};
        for (var i = 0; i <TableDataFull.length; i++){
          var time = TableDataFull[i].time;
          var p_time = obj[time] || {};
          obj[time] = Object.assign(p_time, TableDataFull[i]);
        }
        const result = Object.values(obj); 

      const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      };  
      const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(result.length / rowsPerPage)));
      };

      const TableFull = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const visibleData = result.slice(startIndex, startIndex + rowsPerPage);

        if (result.length === 0) {
          return (
            <Tr>
              <Td colSpan={10} className="text-center">
                No data available
              </Td>
            </Tr>
          );
        }

        return visibleData.map((data, index) => (
          <Tr key={index}>
            <Td>{data.time}</Td>
            <Td>{data.Alarm_Chiller}</Td>
            <Td>{data.Status_Chiller}</Td>
            <Td>{data.Fan_Kondensor}</Td>
            <Td>{data.Status_Kompresor}</Td>
            <Td>{data.Bodi_Chiller}</Td>
            <Td>{data.KisiKisi_Kondensor}</Td>
            <Td>{data.Lvl_Oil_Sight_Glass_Atas}</Td>
            <Td>{data.Lvl_Oil_Sight_Glass_Bawah}</Td>
            <Td>{data.Jalur_Sight_Glass_EXP_Valve}</Td>
            <Td>{data.Operator}</Td>
            <Td>{data.Engineer}</Td>
            <Td>{data.Utility_SPV}</Td>
            <Td>{data.Active_Setpoint}</Td>
            <Td>{data.Evap_LWT}</Td>
            <Td>{data.Evap_EWT}</Td>
            <Td>{data.Unit_Capacity_Full}</Td>
            <Td>{data.Outdoor_Temperature}</Td>
            <Td>{data.Unit_Capacity_Kompresor}</Td>
            <Td>{data.Evap_Pressure_Kompresor}</Td>
            <Td>{data.Cond_Pressure_Kompresor}</Td>
            <Td>{data.Evap_Sat_Temperature_Kompresor}</Td>
            <Td>{data.Cond_Sat_Temperature_Kompresor}</Td>
            <Td>{data.Suction_Temperature_Kompresor}</Td>
            <Td>{data.Discharge_Temperature_Kompresor}</Td>
            <Td>{data.Suction_SH_Kompresor}</Td>
            <Td>{data.Discharge_SH_Kompresor}</Td>
            <Td>{data.Evap_Approach_Kompresor}</Td>
            <Td>{data.Evap_Design_Approach_Kompresor}</Td>
            <Td>{data.Cond_Approach_Kompresor}</Td>
            <Td>{data.Oil_Pressure_Kompresor}</Td>
            <Td>{data.Oil_Pressure_Differential_Kompresor}</Td>
            <Td>{data.EXV_Position_Kompresor}</Td>
            <Td>{data.Run_Hour_Kompressor}</Td>
            <Td>{data.Ampere_Kompressor}</Td>
            <Td>{data.No_Of_Start_Kompresor}</Td>
            <Td>{data.Total_Fan_ON_Kompresor}</Td>
            <Td>{data.Tekanan_Return_Chiller}</Td>
            <Td>{data.Tekanan_Supply_Chiller}</Td>
            <Td>{data.Inlet_Softwater}</Td>
            <Td>{data.Pompa_CHWS_1}</Td>
            <Td>{data.Suhu_sebelum_Pompa_Supply}</Td>
            <Td>{data.Suhu_sesudah_Pompa_Supply}</Td>
            <Td>{data.Tekanan_Sebelum_Pompa_Supply}</Td>
            <Td>{data.Tekanan_Sesudah_Pompa_Supply}</Td>
            <Td>{data.Pompa_CHWR_1}</Td>
            <Td>{data.Suhu_sebelum_Pompa_Return}</Td>
            <Td>{data.Suhu_sesudah_Pompa_Return}</Td>
            <Td>{data.Tekanan_Sebelum_Pompa_Return}</Td>
            <Td>{data.Tekanan_Sesudah_Pompa_Return}</Td>
            <Td>{data.Tegangan_RS}</Td>
            <Td>{data.Tegangan_ST}</Td>
            <Td>{data.Tegangan_TR}</Td>
            <Td>{data.Ampere_RS}</Td>
            <Td>{data.Ampere_ST}</Td>
            <Td>{data.Ampere_TR}</Td>
            <Td>{data.Grounding_Ampere}</Td>
          </Tr>
        ));
      };
  return (
    <div>
      <br />
      <form>
        {list.map((list, index) => (   
        <div key={index}>
          <Stack className="flex flex-row justify-center mb-4  "
            direction="row"
            spacing={4}
            align="center">
            <div>
              <h2 className="mb-1">Area</h2>
              <Select value = {list.area} name="area" placeholder="Select Area" onChange={(e) => handleListChange(e, index)}>
                <option value="R-ActiSetpoiCH">Active Setpoint</option>
                <option value="R-EvapLWTCH">Evap LWT</option>
                <option value="R-EvapEWTCH">Evap EWT</option>
                <option value="R-UnitCapCH">Unit Capacity Full</option>
                <option value="R-OutTempCH">Outdoor Temperature</option>

                <option value="R-Capacity">Unit Capacity Kompresor</option>
                <option value="R-EvapPress">Evap Pressure Kompresor</option>
                <option value="R-CondPress">Cond Pressure Kompresor</option>
                <option value="R-EvapSatTe">Evap Sat Temperature Kompresor</option>
                <option value="R-ConSatTem">Cond Sat Temperature Kompresor</option>
                <option value="R-SuctiTemp">Suction Temperature Kompresor</option>
                <option value="R-DischTemp">Discharge Temperature Kompresor</option>
                <option value="R-SuctionSH">Suction SH Kompresor</option>
                <option value="R-DischarSH">Discharge SH Kompresor</option>
                <option value="R-EvapAppro">Evap Approach Kompresor</option>
                <option value="R-EvaDsgApp">Evap Design Approach Kompresor</option>
                <option value="R-CondAppro">Cond Approach Kompresor</option>
                <option value="R-OilPress">Oil Pressure Kompresor</option>
                <option value="R-OilPresDf">Oil Pressure Differential Kompresor</option>
                <option value="R-EXVPositi">EXV Position Kompresor</option>
                <option value="R-RunHour">Run Hour Kompressor </option>
                <option value="R-Ampere">Ampere Kompressor </option>
                <option value="R-No.Start">No. Of Start Kompresor</option>
                <option value="H-FanOutdor">Total Fan ON Kompresor</option>

                <option value="H-TknReturnCH">Tekanan Return Chiller</option>
                <option value="H-TknSupplyCH">Tekanan Supply Chiller</option>
                <option value="H-InletSoftCH">Inlet Softwater</option>
                <option value="O-StatONPS">Pompa CHWS 1</option>
                <option value="H-ShuSebPmSupCH">Suhu sebelum Pompa Supply</option>
                <option value="H-ShuSesPmSupCH">Suhu sesudah Pompa Supply</option>
                <option value="H-PreSebPmSupCH">Tekanan Sebelum Pompa Supply</option>
                <option value="H-PreSesPomSpCH">Tekanan Sesudah Pompa Supply</option>
                <option value="O-StatONPR">Pompa CHWR 1</option>
                <option value="H-SuhSbPomRetCH">Suhu sebelum Pompa Return</option>
                <option value="H-SuhSesPmRetCH">Suhu sesudah Pompa Return</option>
                <option value="H-PreSebPomRtCH">Tekanan Sebelum Pompa Return</option>
                <option value="H-PrSesPomRetCH">Tekanan Sesudah Pompa Return</option>
                <option value="RP-TegR-SCH">Tegangan R-S</option>
                <option value="RP-TegS-TCH">Tegangan S-T</option>
                <option value="RP-TegT-RCH">Tegangan T-R</option>
                <option value="RP-AmpR-SCH">Ampere R-S</option>
                <option value="RP-AmpS-TCH">Ampere S-T</option>
                <option value="RP-AmpT-RCH">Ampere T-R</option>
                <option value="H-GroundAmperCH">Grounding Ampere</option>
              </Select>
            </div>
            <div>
              <h2 className="mb-1">Chiller</h2>
              <Select value = {list.chiller} name="chiller" placeholder="Select Chiller" onChange={(e) => handleListChange(e, index)}>
                  <option value="1">Chiller 1</option>
                  <option value="2">Chiller 2</option>
                  <option value="3">Chiller 3</option>
              </Select>
            </div>
            <div>
              <h2 className="mb-1">Kompresor</h2>
              <Select value = {list.komp} name="komp" placeholder="Full Chiller" onChange={(e) => handleListChange(e, index)}>
                  <option value="K1CH">Kompresor 1</option>
                  <option value="K2CH">Kompresor 2</option>
              </Select>
            </div>
            <div>
              <h2 className="mb-1">Start Time</h2>
              <Input
                onChange={(e) => handleListChange(e, index)}
                placeholder="Select Date and Time"
                size="md"
                type="date"
                value = {list.start} name="start"
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
                }}/> 
            </div>
            <div className="mb-1">Finish Time
              <Input
                onChange={(e) => handleListChange(e, index)}
                placeholder="Select Date and Time"
                size="md"
                type="date"
                value = {list.finish} name="finish"
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
                }}/>
            </div>
            <div className="mb-1">
              <br />
              <Button
                className="m1-4"
                colorScheme="red"
                onClick={() => handleDeleteList(index)}>
                Delete
              </Button>
            </div>
          </Stack>
        </div> 
        ))}
      </form>
      <Stack
        className="flex flex-row justify-center mb-4  "
        direction="row"
        spacing={4}
        align="center">
        <div>
          <Button
            isDisabled={state}
            className="m1-4"
            colorScheme="cyan"
            onClick={handleAddlist}>
            Compare
          </Button>
        </div>
        <div>
          <Button
            className="m1-4"
            colorScheme="blue"
            onClick={() => {fetchDataChiller();fetchName()}}>
            Submit
          </Button>
        </div>
      </Stack>
      <div className="flex flex-row justify-center mx-12 bg-card rounded-md p-2 "> 
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
        <CanvasJSChart className="" options={options} />
      )}
      </div>
      <br />
      <Stack
        className="flex flex-row justify-center mb-4  "
        direction="row"
        spacing={4}
        align="center">
        <div>
          <h2 className="mb-1">Chiller</h2>
          <Select  placeholder="Select Chiller" onChange={chillerData}>
            <option value="1">Chiller 1</option>
            <option value="2">Chiller 2</option>
            <option value="3">Chiller 3</option>
          </Select>
        </div>
        <div>
          <h2 className="mb-1">Kompresor</h2>
          <Select  placeholder="Select Kompresor" onChange={KompData}>
            <option value="K1CH">Kompresor 1</option>
            <option value="K2CH">Kompresor 2</option>
          </Select>
        </div>
        <div>
          <h2 className="mb-1">Start Time</h2>
          <Input
            onChange={dateStart}
            placeholder="Select Date and Time"
            size="md"
            type="date"
            css={{
              "&::-webkit-calendar-picker-indicator": {
                color: isDarkMode ? "white" : "black",
                filter: isDarkMode ? "invert(1)" : "none",
              },
            }}/> 
        </div>
        <div>
          <h2 className="mb-1">Finish Time</h2>
          <Input
            onChange={dateFinish}
            placeholder="Select Date and Time"
            size="md"
            type="date"
            css={{
              "&::-webkit-calendar-picker-indicator": {
                color: isDarkMode ? "white" : "black",
                filter: isDarkMode ? "invert(1)" : "none",
              },
            }}/>
        </div>
        <div>
          <br />
          <Button
            className="m1-4"
            colorScheme="blue"
            onClick={() => fetchChillerTable()}
            disabled={loadingTable}
            >
            {loadingTable ? "Loading..." : "Submit"}
          </Button>
        </div>
        <div>
          <br />
          <ExportToExcel apiData={result} fileName={fileName} />
        </div>
        <div>
          <Button
            className="w-32 mt-4"
            colorScheme="red"
            onClick={() => setIsTableVisible(!isTableVisible)}>
            {isTableVisible ? "Hide All Data" : "Show All Data"}
          </Button>
        </div>
      </Stack>
      <Stack className="flex flex-row justify-center gap-2"
        direction="row"
        spacing={2}
        align="center">
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
      </Stack>
      <br />
      <div className="flex flex-col items-center bg-card shadow-lg">
        {loadingTable && <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl" />}
        {errorTable && <p className="text-red-500">{errorTable}</p>}
      </div>
      {isTableVisible && !loadingTable && !errorTable && (
      <TableContainer sx={{
        background: kartuColor,
        borderRadius: "0.395rem",
        }}>
        <Table key={colorMode} variant="simple">
          <Thead>
            <Tr>
              <Th sx={{
                color: tulisanColor,
                }}>Date Time</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Alarm Chiller</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Status Chiller</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Fan Kondensor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Status Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Body Chiller</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Kisi-Kisi Kondensor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Lvl Oil Sight Glass Atas</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Lvl Oil Sight Glass Bawah</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Jalur Sight Glass EXP Valve</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Operator</Th>
              <Th sx={{
                color: tulisanColor,
                }}>OEngineer</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Utility SPV</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Active Setpoint</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Evap LWT</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Evap EWT</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Unit Capacity Full</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Outdoor Temperature</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Unit Capacity Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Evap Pressure Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Cond Pressure Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Evap Sat Temperature Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Cond Sat Temperature Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Suction Temperature Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Discharge Temperature Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Suction SH Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Discharge SH Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Evap Approach Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Evap Design Approach Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Cond Approach Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Oil Pressure Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Oil Pressure Differential Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>EXV Position Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Run Hour Kompressor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Ampere Kompressor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>No. Of Start Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Total Fan ON Kompresor</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tekanan Return Chiller</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tekanan Supply Chiller</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Inlet Softwater</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Pompa CHWS 1</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Suhu sebelum Pompa Supply</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Suhu sesudah Pompa Supply</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tekanan Sebelum Pompa Supply</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tekanan Sesudah Pompa Supply</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Pompa CHWR 1</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Suhu sebelum Pompa Return</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Suhu sesudah Pompa Return</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tekanan Sebelum Pompa Return</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tekanan Sesudah Pompa Return</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tegangan R-S</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tegangan S-T</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Tegangan T-R</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Ampere R-S</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Ampere S-T</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Ampere T-R</Th>
              <Th sx={{
                color: tulisanColor,
                }}>Grounding Ampere</Th>
            </Tr>
          </Thead>
          <Tbody>{TableFull()}</Tbody>
        </Table>
      </TableContainer>
      )}
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
          Page {currentPage} of {Math.ceil(result.length / rowsPerPage)}
        </span>
        <Button
          onClick={handleNextPage}
          isDisabled={currentPage === Math.ceil(result.length / rowsPerPage)}
          colorScheme="blue"
        >
          Next
        </Button>
      </div>
    </div>
  );
}