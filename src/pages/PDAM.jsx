import React, { useState, useEffect } from "react";
import axios from "axios";
import YardIcon from '@mui/icons-material/Yard';
import { GrFanOption } from "react-icons/gr";
import { GiBaseDome } from "react-icons/gi";
import { PiPlantFill } from "react-icons/pi";
import { IoLogoElectron } from "react-icons/io5";

const PDAM = () => {
    const [messages, setMessages] = useState({}); // Semua pesan
    const [filteredBoiler, setFilteredBoiler] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredDomestik, setFilteredDomestik] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredInlet, setFilteredInlet] = useState(null); // Nilai spesifik yang ditampilkan
    const [filteredOsmotron, setFilteredOsmotron] = useState(null);
    const [filteredTamanPos, setFilteredTamanPos] = useState(null); 

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
                if (topic === "dbwater" && jsonData.d?.Boiler) {
                  setFilteredBoiler(jsonData.d.Boiler[0]); // Ambil nilai pertama
                }
                if (topic === "dbwater" && jsonData.d?.Domestik) {
                  setFilteredDomestik(jsonData.d.Domestik[0]); // Ambil nilai pertama
                }
                if (topic === "dbwater" && jsonData.d?.inlet_pretreatment) {
                  setFilteredInlet(jsonData.d.inlet_pretreatment[0]); // Ambil nilai pertama
                }
                if (topic === "dbwater" && jsonData.d?.reject_osmotron) {
                  setFilteredOsmotron(jsonData.d.reject_osmotron[0]); // Ambil nilai pertama
                }
                if (topic === "dbwater" && jsonData.d?.taman_posjaga) {
                  setFilteredTamanPos(jsonData.d.taman_posjaga[0]); // Ambil nilai pertama
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-2 transition delay-300">
            <div className="rounded-md mt-2 flex flex-col border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <GrFanOption sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Boiler</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins relative text-black dark:text-white">{filteredBoiler !== null && filteredBoiler !== undefined 
                            ? parseFloat(filteredBoiler).toFixed(2) 
                            : "N/A"}
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
                        <GiBaseDome sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Domestik</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredDomestik ?? "N/A"}</h4>
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
                            d="M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z"
                            fill=""
                        />
                        </svg>
                    </span>
                </div>
            </div>
            <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 relative">
                        <PiPlantFill sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Inlet Pre-Treatment</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredInlet ?? "N/A"}</h4>
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
        </div>
        {/* -----------------------------------------------------------   &&&  -------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-2 transition delay-300">
            <div className="rounded-md mt-2 flex flex-col border border-border px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                        <IoLogoElectron sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Reject Osmotron</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins relative text-black dark:text-white">{filteredOsmotron !== null && filteredOsmotron !== undefined 
                            ? parseFloat(filteredOsmotron).toFixed(2) 
                            : "N/A"}
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
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4 relative">
                        <YardIcon sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-50 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Taman Pos Jaga</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{filteredTamanPos ?? "N/A"}</h4>
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
        </div>

    </>
  )
}

export default PDAM