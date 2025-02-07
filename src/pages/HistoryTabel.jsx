import React, { useState } from 'react';
import Header from "../components/header";
import HistoryTabelIsi from "./HistoryTabelIsi";

const HistoryTabel = () => {  
  
    return (
      <div>
        <Header />
        <br />
        <HistoryTabelIsi className="overflow-hidden"/>
      </div>
  )
}

export default HistoryTabel