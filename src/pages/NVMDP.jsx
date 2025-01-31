import React, { useState, useEffect, useRef } from "react";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FireHydrantAltIcon from '@mui/icons-material/FireHydrantAlt';
import ConstructionIcon from '@mui/icons-material/Construction';
import { FaLandmark } from "react-icons/fa";

const NVMDP = () => {
    const [sdp1Produksi, setSdp1Produksi] = useState(null);
    const [sdp2Produksi, setSdp2Produksi] = useState(null);
    const [pp2Hydrant, setPp2Hydrant] = useState(null);
    const [pp1Chiller, setPp1Chiller] = useState(null);
    const [sdp1Utility, setSdp1Utility] = useState(null);
    const [lvmdp1, setLvmdp1] = useState(null);
    const [solarPanel, setSolarPanel] = useState(null);
    const [solarPanel2, setSolarPanel2] = useState(null);

    const socketRef = useRef(null);

    const [showPopup, setShowPopup] = useState(false); // ini kode bikin pop-up coba dulu dah
    const [showChillerPopup, setShowChillerPopup] = useState(false); //ternyata kita perlu ngasih state pop-up buat masing-masing card
    const [showHydrantPopup, setShowHydrantPopup] = useState(false); // kalau gak dia bakal nimpa yang sebelumnya
    const [showSolarPanel, setShowSolarPanel] = useState(false); 
    const [showSolarPanel2, setShowSolarPanel2] = useState(false); 
    const [showUtil, setShowUtil] = useState(false); 
    const [showProd, setShowProd] = useState(false); 
    const [showProd2, setShowProd2] = useState(false); 

    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.getAttribute("data-theme") === "dark"
    );

    const grafanaLVMDP = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/uHORrfazbB1SNbhktJ03Du8ywyqoabrj?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/uHORrfazbB1SNbhktJ03Du8ywyqoabrj?orgId=0&kiosk&theme=light";
    const grafanaMVMDPMonth = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/sxKIJvabjpjQB6qzN01qxrktG81CEd4p?orgId=0&viewPanel=38&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/sxKIJvabjpjQB6qzN01qxrktG81CEd4p?orgId=0&viewPanel=38&kiosk&theme=light";
    const grafanaSP = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/154zKTyB2ZXLet4VzOziZYpGLts7FkGI?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/154zKTyB2ZXLet4VzOziZYpGLts7FkGI?orgId=0&kiosk&theme=light";
    const grafanaSP2 = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/X9xTfUnwmijvtngT69lZ2xSQlrFJ02sZ?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/X9xTfUnwmijvtngT69lZ2xSQlrFJ02sZ?orgId=0&kiosk&theme=light";
    const grafanaMVMDPYear = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/nKXeg5CtNW9M1GfW8MrLSHJlKtifwHze?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/nKXeg5CtNW9M1GfW8MrLSHJlKtifwHze?orgId=0&kiosk&theme=light";
    const grafanaChiller = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/tbLnho9XgLzli5nWWKd0NtFScAEXKjSq?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/tbLnho9XgLzli5nWWKd0NtFScAEXKjSq?orgId=0&kiosk&theme=light";
    const grafanaHydrant = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/JhN10xGaL2SoMZ5bIqRJMJWbQ6DxAv4A?orgId=0&viewPanel=43&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/JhN10xGaL2SoMZ5bIqRJMJWbQ6DxAv4A?orgId=0&viewPanel=43&kiosk&theme=light";

    const grafanaUtil = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/1JLFrNa85BjHb86IaP0e76KWqg7HFQ4o?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/1JLFrNa85BjHb86IaP0e76KWqg7HFQ4o?orgId=0&kiosk&theme=light";
    const grafanaProd1 = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/DOjYtx3f7gavnfapXkgoHyISTBYL1Vfu?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/DOjYtx3f7gavnfapXkgoHyISTBYL1Vfu?orgId=0&kiosk&theme=light";
    const grafanaProd2 = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/DGARCPDLcEQknBXOmReLJ8Zm8omafpZz?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/DGARCPDLcEQknBXOmReLJ8Zm8omafpZz?orgId=0&kiosk&theme=light";


  
    useEffect(() => {
      // Buat koneksi WebSocket
      socketRef.current = new WebSocket("ws://10.126.15.137:1880/ws/test");
  
      socketRef.current.onopen = () => {
        console.log("WebSocket connected");
      };
  
      socketRef.current.onmessage = (event) => {
        try {
          const message = event.data;
          const varWebSocket = JSON.parse(message);
          console.log(varWebSocket);
  
          // Set state untuk masing-masing nilai
          setSdp1Produksi(varWebSocket["SDP_1Produksi"]);
          setSdp2Produksi(varWebSocket["SDP_2Produksi"]);
          setPp2Hydrant(varWebSocket["PP_2_Hydrant"]);
          setPp1Chiller(varWebSocket["PP_1_Chiler"]);
          setSdp1Utility(varWebSocket["SDP_1Utility"]);
          setLvmdp1(varWebSocket["LVMDP1"]);
          setSolarPanel(varWebSocket["SolarPanel"]);
          setSolarPanel2(varWebSocket["SolarPanel2"]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
  
      socketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
  
      socketRef.current.onclose = () => {
        console.log("WebSocket disconnected");
      };
  
      // Tutup koneksi WebSocket saat komponen akan di-unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }, []); // Kosongkan dependency array sehingga useEffect hanya berjalan sekali saat komponen di-mount

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-2 transition delay-200">
        <div className="rounded-md mt-2 flex flex-col border border-border px-7.5 py-6 shadow-buatcard bg-coba">
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran">
              <svg
                className="fill-primary dark:fill-secondary"
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
            <div className="py-1 px-4 text-center font-semibold text-text border-r border-gray-400 cursor-pointer
            transform transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95"
            onClick={() => setShowSolarPanel(true)}>
              Solar Panel 1 - 6
            </div>
            <div className="py-1 px-4 text-center font-semibold text-text cursor-pointer
            transform transition duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105 active:scale-95"
            onClick={() => setShowSolarPanel2(true)}>
              Solar Panel 7 - 12
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="py-2 px-4 text-center text-text">
              {solarPanel ?? "N/A"}
            </div>
            <div className="py-2 px-4 text-center text-text">
              {solarPanel2 ?? "N/A"}
            </div>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">
              {/* kalau pake dollar / duit pake kode yg dibawah (yg di komenin) */}
              {/* ${((filteredValue?.Inverter_SP_1to6?.[0] ?? 0) + (filteredValue?.Inverter_SP_7to12?.[0] ?? 0)).toLocaleString("en-US")} */}
              {((solarPanel ?? 0) + (solarPanel2 ?? 0))}
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

        {/* Pop-Up */}
        {showSolarPanel && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text my-2">Ini adalah pop-up dari card Solar Panel 1 - 6.</p>
              <iframe
                src={grafanaSP}
                style={{
                  border: 'none', // Removes border
                  position: 'relative',
                  width: '100%', // Full width of parent div
                  aspectRatio: '16 / 6', // Adjust aspect ratio as needed
                  
                }}
                title="Grafana Chart">
              </iframe>
              <button
                onClick={() => setShowSolarPanel(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
        {/* Pop-Up */}
        {showSolarPanel2 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text my-2">Ini adalah pop-up dari card Solar Panel 7 - 12.</p>
              <iframe
                src={grafanaSP2}
                style={{
                  border: 'none', // Removes border
                  position: 'relative',
                  width: '100%', // Full width of parent div
                  aspectRatio: '16 / 6', // Adjust aspect ratio as needed
                  height: '580px'
                }}
                title="Grafana Chart">
              </iframe>
              <button
                onClick={() => setShowSolarPanel2(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
{/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
        <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
        onClick={() => setShowPopup(true)}>
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran">
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
          <div className="mt-7 flex items-end justify-between">
            <div>
              <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{lvmdp1 ?? "N/A"}</h4>
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

        {/* Pop-Up */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text my-2">Ini adalah pop-up dari card LVMDP.</p>
              <iframe
                src={grafanaLVMDP}
                style={{
                  border: 'none', // Removes border
                  position: 'relative',
                  width: '100%', // Full width of parent div
                  aspectRatio: '16 / 6', // Adjust aspect ratio as needed
                  
                }}
                title="Grafana Chart">
              </iframe>
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
{/* ---------------------------------------------------------------------------------------------------------------------------------------------------------- */}
        <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
        onClick={() => setShowChillerPopup(true)}>
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran relative">
              <AcUnitIcon sx={{ fontSize: 32 }} className="overflow-hidden m-1 z-10 "/>
            </div>
            <h1 className="text-text text-2xl font-semibold font-DMSans">Chiller</h1>
          </div>
          <div className="mt-7 flex items-end justify-between">
            <div>
              <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{pp1Chiller ?? "N/A"}</h4>
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

        {/* Pop-Up */}
        {showChillerPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
            <p className="text-text my-2">Ini adalah pop-up dari card Chiller.</p>
            <iframe
              src={grafanaChiller}
              style={{
                border: 'none', // Removes border
                position: 'relative',
                width: '100%', // Full width of parent div
                aspectRatio: '16 / 5' // Adjust aspect ratio as needed
              }}
              title="Grafana Chart">
            </iframe>
            <button
              onClick={() => setShowChillerPopup(false)}
              className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
            >
              X
            </button>
          </div>
        </div>
        )}
  {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------      */}
        <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
        onClick={() => setShowHydrantPopup(true)}>
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran relative">
              <FireHydrantAltIcon sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-10 "/>
            </div>
            <h1 className="text-text text-2xl font-semibold font-DMSans">Hydrant</h1>
          </div>
          <div className="mt-7 flex items-end justify-between">
            <div>
              <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{pp2Hydrant ?? "N/A"}</h4>
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

      {/* Pop-Up */}
      {showHydrantPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
          <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
            <p className="text-text my-2">Ini adalah pop-up dari card Hydrant.</p>
            <iframe
              src={grafanaHydrant}
              style={{
                border: 'none', // Removes border
                position: 'relative',
                width: '100%', // Full width of parent div
                aspectRatio: '16 / 5' // Adjust aspect ratio as needed
              }}
              title="Grafana Chart">
            </iframe>
            <button
              onClick={() => setShowHydrantPopup(false)}
              className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
            >
              X
            </button>
          </div>
        </div>
        )}
  {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 justify-center gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-2">
        <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
        onClick={() => setShowUtil(true)}>
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran relative">
              <ConstructionIcon sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-10 "/>
            </div>
            <h1 className="text-text text-2xl font-semibold font-DMSans">Utility</h1>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{sdp1Utility ?? "N/A"}</h4>
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
        {/* Pop-Up */}
        {showUtil && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text my-2">Ini adalah pop-up dari card Utility.</p>
              <iframe
                src={grafanaUtil}
                style={{
                  border: 'none', // Removes border
                  position: 'relative',
                  width: '100%', // Full width of parent div
                  aspectRatio: '16 / 5' // Adjust aspect ratio as needed
                }}
                title="Grafana Chart">
              </iframe>
              <button
                onClick={() => setShowUtil(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
{/* -----------------------------------------------------------------------------------------------------------------------------------------------------------------------         */}
        <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
        onClick={() => setShowProd(true)}>
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran relative">
              <FaLandmark sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-10 "/>
            </div>
            <h1 className="text-text text-2xl font-semibold font-DMSans">SDP 1 Production</h1>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{sdp1Produksi ?? "N/A"}</h4>
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
        {/* Pop-Up */}
        {showProd && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text my-2">Ini adalah pop-up dari card SDP 1 Production.</p>
              <iframe
                src={grafanaProd1}
                style={{
                  border: 'none', // Removes border
                  position: 'relative',
                  width: '100%', // Full width of parent div
                  aspectRatio: '16 / 5' // Adjust aspect ratio as needed
                }}
                title="Grafana Chart">
              </iframe>
              <button
                onClick={() => setShowProd(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
{/* -----------------------------------------------------------------------------------------------------------------------------------------------------------------------         */}
        <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
        onClick={() => setShowProd2(true)}>
          <div className="flex items-center gap-4">
            <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran relative">
              <FaLandmark sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-10 "/>
            </div>
            <h1 className="text-text text-2xl font-semibold font-DMSans">SDP 2 Production</h1>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{sdp2Produksi ?? "N/A"}</h4>
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
        {/* Pop-Up */}
        {showProd2 && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text mt-2">Ini adalah pop-up dari card SDP 2 Production.</p>
              <iframe
                src={grafanaProd2}
                style={{
                  border: 'none', // Removes border
                  position: 'relative',
                  width: '100%', // Full width of parent div
                  aspectRatio: '16 / 5' // Adjust aspect ratio as needed
                }}
                title="Grafana Chart">
              </iframe>
              <button
                onClick={() => setShowProd2(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="text-center mt-8 p-2 shadow-buatcard bg-coba rounded-md relative">
        <h1 className="text-center text-text text-4xl antialiased hover:subpixel-antialiased mb-2">MVMDP Chart</h1>
        <iframe
          src={grafanaMVMDPMonth}
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
        <br/>
        <iframe
          src={grafanaMVMDPYear}
          // width="540"
          // height="480"
          style={{
            border: 'none', // Removes border
            position: 'relative',
            width: '100%', // Full width of parent div
            aspectRatio: '16 / 6', // Adjust aspect ratio to match the desired size
            height: '840px', // Set a fixed height for the iframe
          }}
          title="Grafana Chart">
        </iframe>
      </div>
    </>
  )
}

export default NVMDP