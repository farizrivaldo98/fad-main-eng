import moment from "moment-timezone";

import React, { useEffect, useState } from "react";
import CanvasJSReact from "../canvasjs.react";

import {
  CircularProgress,
  CircularProgressLabel,
  Progress,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Stack,
  Input,
  Select,
  Card,
  CardBody,
  Heading,
  Text,
  Spinner
} from "@chakra-ui/react";
import Header from "../components/header";
import { useColorMode, useColorModeValue } from "@chakra-ui/react";
import ProductionIsi from "./ProductionIsi";
//import { useNavigate } from "react-router-dom";

//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


function Production() {

  return (
    <div className="overflow-x-hidden">
      <Header />
      <br />
      <ProductionIsi />
    </div>
  );
}

export default Production;
