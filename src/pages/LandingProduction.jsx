import React, { useEffect, Component, useState } from "react";
import axios from "axios";
import CanvasJSReact from "../canvasjs.react";
import {
  CircularProgress,
  CircularProgressLabel,
  Progress,
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
  CardBody,
  CardFooter,
  Heading,
  StackDivider,
  Box,
  Text,
  Card,
  CardHeader,
} from "@chakra-ui/react";
import { getDateProd } from "../features/part/prodSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/header";

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function LandingProduction() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dateValue = useSelector((state) => state.prod.date);

  const [opeVar, setOpeVar] = useState([{ Ava: 0, Per: 0, Qua: 0, oee: 0 }]);
  const [dateGlobal, setDate] = useState();
  const [datawidth, setWidth] = useState(window.innerWidth);
  const [dataheight, setHeight] = useState(500);

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

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

  useEffect(() => {
    const handleResize = () => {
      setWidth(document.body.clientWidth);
      setHeight(document.body.clientHeight > 600 ? 500 : 800); // Adjust height based on conditions
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setDate(dateValue);
    fetchOPE(dateValue);
  }, [dateValue]);

  let opeCalculation =
    (opeVar[0].Ava / 100) * (opeVar[0].Per / 100) * (opeVar[0].Qua / 100) * 100;

  const fetchOPE = async (date) => {
    let response = await axios.get("http://10.126.15.141:8002/part/ope", {
      params: {
        date: date,
      },
    });
    setOpeVar(response.data);
  };

  var visitorsChartDrilldownHandler = (e) => {
    let chartClick = e.dataPoint.name;
    if (chartClick == "Availability") {
      navigate("/avabilityope");
    }
  };

  var visitorsCentralClick = (e) => {
    //console.log(e);
  };

  const getDate = (e) => {
    var dataInput = e.target.value;

    dispatch(getDateProd(dataInput));
  };

  const headerHendeler = (e) => {
    navigate("/oeeLine");
  };

  const options = {
    zoomEnabled: true,
    theme: isDarkMode ? "dark2" : "light2",
    backgroundColor: isDarkMode ? "#171717" : "#ffffff",
    width: datawidth > 800 ? 1360 : datawidth - 450,
    height: dataheight,
    title: {},
    subtitles: [
      {
        //text: `${oeeCalculation.oee.toFixed(2)}% OEE`,

        text: `${opeCalculation.toFixed(2)}% OEE`,
        verticalAlign: "center",
        
        fontColor: isDarkMode ? "white" : "black",

        fontSize: 36,
        fontStyle: "oblique",
        dockInsidePlotArea: true,
      },
    ],

    data: [
      {
        click: visitorsChartDrilldownHandler,

        type: "doughnut",
        showInLegend: true,
        indexLabel: "{name}: {y}",
        indexLabelFontSize: 20, // Adjust this value as needed
        yValueFormatString: "#,###'%'",

        dataPoints: [
          { name: "Availability", y: opeVar[0].Ava },
          { name: "Performance", y: opeVar[0].Per },
          { name: "Quality", y: opeVar[0].Qua },
        ],
      },
    ],
  };

  return (
    <div>
    <Header />
      <div class="flex flex-col sm:grid-cols-6 mt-4 ">
        <div class="flex justify-center">
          <div className="mr-10">
            <h2 className="mb-1">Year Search</h2>
            <Select>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </Select>
          </div>
          <div>
            <h2 className="mb-1">Month Search</h2>
            <Select onChange={getDate} value={dateValue}>
              <option value="0">All</option>
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
          </div>
        </div>
        <br />
        <div className="flex flex-col ">
          <h1
            onClick={() => headerHendeler()}
            class="text-center text-text text-5xl font-bold cursor-pointer mb-1 ml-12">
            Overall Plant Effectiveness
          </h1>
          <Card overflow="hidden"
          className="my-3 mx-5 flex justify-center">
          <CanvasJSChart options={options} />
          </Card>
        </div>      
      </div>
    </div>
  );
}

export default LandingProduction;
