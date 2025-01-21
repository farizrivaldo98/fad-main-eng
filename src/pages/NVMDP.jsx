import React, { useState, useEffect } from "react";
import axios from "axios";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FireHydrantAltIcon from '@mui/icons-material/FireHydrantAlt';
import ConstructionIcon from '@mui/icons-material/Construction';
import { FaLandmark } from "react-icons/fa";

const NVMDP = () => {
    const [messages, setMessages] = useState({}); // Semua pesan
    const [filteredValue, setFilteredValue] = useState({
        Inverter_SP_1to6: [0],
        Inverter_SP_7to12: [0]
      });
    const [filteredValue2, setFilteredValue2] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredChiller, setFilteredChiller] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredHydrant, setFilteredHydrant] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredUtil, setFilteredUtil] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredProd1, setFilteredProd1] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredProd2, setFilteredProd2] = useState(null); // Nilai spesifik yang ditampilkan

    // const [masterboxData, setMasterboxData] = useState({
    //   masterboxL3_1: [0],
    //   masterboxL3_2: [0],
    //   masterboxL2_2: [0],
    // });
  
    useEffect(() => {
      const socket = new WebSocket("ws://10.126.15.141:8081");
  
      socket.onopen = () => {
        console.log("WebSocket connected");
      };
  
      socket.onmessage = (event) => {
        try {
          const message = event.data;
          const topicMatch = message.match(/MQTT \[(.+?)\]:/); // Ambil nama topik
          console.log(event.data);
          if (topicMatch) {
            const topic = topicMatch[1];
            const jsonData = JSON.parse(message.replace(/.*]: /, "")); // Parse JSON
            const newMessages = {
              ...messages,
              [topic]: jsonData.d || {},
            };
           
            
            setMessages(newMessages);
  
            // Ambil nilai spesifik (contoh untuk kwhmeter.MVMDP)
            if (topic === "kwhmeter" && jsonData.d) {
              console.log("kwhmeter data:", jsonData.d);
              setFilteredValue(jsonData.d); // Ambil nilai pertama
            }
            if (topic === "kwhmeter" && jsonData.d?.LVMDP1) {
              setFilteredValue2(jsonData.d.LVMDP1[0]); // Ambil nilai pertama
            }
            if (topic === "kwhmeter" && jsonData.d?.PP_1Chiller) {
              setFilteredChiller(jsonData.d.PP_1Chiller[0]); // Ambil nilai pertama
            }
            if (topic === "kwhmeter" && jsonData.d?.PP_2Hydrant) {
              setFilteredHydrant(jsonData.d.PP_2Hydrant[0]); // Ambil nilai pertama
            }
            if (topic === "kwhmeter" && jsonData.d?.SDP_1Utility) {
              setFilteredUtil(jsonData.d.SDP_1Utility[0]); // Ambil nilai pertama
            }
            if (topic === "kwhmeter" && jsonData.d?.SDP_1Produksi) {
              setFilteredProd1(jsonData.d.SDP_1Produksi[0]); // Ambil nilai pertama
            }
            if (topic === "kwhmeter" && jsonData.d?.SDP_2Produksi) {
              setFilteredProd2(jsonData.d.SDP_2Produksi[0]); // Ambil nilai pertama
            }
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
  
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      socket.onclose = () => {
        console.log("WebSocket disconnected");
      };
  
      return () => {
        
        socket.close(); // Tutup koneksi WebSocket
      };
    }, [messages]);
  
  return (
    <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-2 transition delay-200">
      <div className="rounded-md mt-2 flex flex-col border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primaryy dark:fill-secondary"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="green"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
                fill=""
              />
              <path
                d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
                fill=""
              />
            </svg>
          </div>
          <h1 className="text-text text-2xl font-semibold font-DMSans">Inverter</h1>
        </div>
        <div className="grid grid-cols-2 border-b border-gray-300 mt-1">
          <div className="py-1 px-4 text-center font-semibold text-black dark:text-white border-r border-gray-300">
            SP 1 - 6
          </div>
          <div className="py-1 px-4 text-center font-semibold text-black dark:text-white">
            SP 7 - 12
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="py-2 px-4 text-center text-text border-r border-gray-300">
            {filteredValue?.Inverter_SP_1to6?.[0] ?? "N/A"}
          </div>
          <div className="py-2 px-4 text-center text-text">
            {filteredValue?.Inverter_SP_7to12?.[0] ?? "N/A"}
          </div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">
            {/* kalau pake dollar / duit pake kode yg dibawah (yg di komenin) */}
            {/* ${((filteredValue?.Inverter_SP_1to6?.[0] ?? 0) + (filteredValue?.Inverter_SP_7to12?.[0] ?? 0)).toLocaleString("en-US")} */}
            {((filteredValue?.Inverter_SP_1to6?.[0] ?? 0) + (filteredValue?.Inverter_SP_7to12?.[0] ?? 0))}
            </h4>
            <span className="text-[16px] gap-1 font-medium font-poppins text-black dark:text-white">Total</span>
          </div>
          <span
            className="flex items-center gap-1 text-[16px] font-medium text-meta-3">0.43%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
                fill=""
              />
              <path
                d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
                fill=""
              />
              <path
                d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
                fill=""
              />
            </svg>
          </div>
          <h1 className="text-text text-2xl font-semibold font-DMSans">LVMDP</h1>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredValue2 ?? "N/A"}</h4>
            <span className="text-[16px] font-medium font-poppins text-black dark:text-white">Total</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">4.35%
            <svg
              class="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 relative">
            <AcUnitIcon sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
          </div>
          <h1 className="text-text text-2xl font-semibold font-DMSans">Chiller</h1>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredChiller ?? "N/A"}</h4>
            <span className="text-[16px] font-medium font-poppins text-black dark:text-white">Total</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">2.59%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 relative">
            <FireHydrantAltIcon sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
          </div>
          <h1 className="text-text text-2xl font-semibold font-DMSans">Hydrant</h1>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredHydrant ?? "N/A"}</h4>
            <span className="text-[16px] font-medium font-poppins text-black dark:text-white">Total</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">2.59%
            <svg
              className="fill-meta-1"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
{/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
    <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-2">
      <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 relative">
            <ConstructionIcon sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
          </div>
          <h1 className="text-text text-2xl font-semibold font-DMSans">Utility</h1>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredUtil ?? "N/A"}</h4>
            <span className="text-[16px] font-medium font-poppins text-black dark:text-white">Total</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">2.59%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 relative">
            <FaLandmark sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
          </div>
          <h1 className="text-text text-2xl font-semibold font-DMSans">SDP 1 Production</h1>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredProd1 ?? "N/A"}</h4>
            <span className="text-[16px] font-medium font-poppins text-black dark:text-white">Total</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">2.59%
            <svg
              className="fill-meta-3"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 relative">
            <FaLandmark sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
          </div>
          <h1 className="text-text text-2xl font-semibold font-DMSans">SDP 2 Production</h1>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredProd2 ?? "N/A"}</h4>
            <span className="text-[16px] font-medium font-poppins text-black dark:text-white">Total</span>
          </div>
          <span className="flex items-center gap-1 text-sm font-medium text-meta-3">2.59%
            <svg
              className="fill-meta-1"
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                fill=""
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
        <div className="text-center mt-8 p-2 dark:border-strokedark dark:bg-boxdark shadow rounded-lg relative">
            <h1 className="text-center text-text text-4xl antialiased hover:subpixel-antialiased mb-2">Grafana Chart</h1>
            <iframe
                src="https://snapshots.raintank.io/dashboard/snapshot/jrOsrw3oOzY8dUZ4nebvAvriZRtoNl7j?orgId=0&from=now-30d&to=now"
                // width="540"
                // height="480"
                style={{
                    border: 'none', // Removes border
                    position: 'relative',
                    width: '100%', // Full width of parent div
                    aspectRatio: '16 / 6' // Adjust aspect ratio as needed
                }}
                title="Grafana Chart">
            </iframe>
        </div>
        </>
  )
}

export default NVMDP