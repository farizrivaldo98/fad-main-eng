import React, { useState, useEffect, useRef } from "react";
import YardIcon from '@mui/icons-material/Yard';
import { GrFanOption } from "react-icons/gr";
import { GiBaseDome } from "react-icons/gi";
import { PiPlantFill } from "react-icons/pi";
import { IoLogoElectron } from "react-icons/io5";

const PDAM = () => {
    const [inlet, setInlet] = useState(null);
    const [domestic, setDomestic] = useState(null);
    const [tamanpos, setTamanPos] = useState(null);
    const [rejectosmo, setRejectOsmo] = useState(null);
    const [boiler, setBoiler] = useState(null);

    const socketRef = useRef(null);

    const [showInlet, setShowInlet] = useState(false); // ini kode bikin pop-up coba dulu dah
    const [showDomestic, setShowDomestic] = useState(false);
    const [showTamanPos, setShowTamanPos] = useState(false); 
    const [showOsmo, setShowOsmo] = useState(false); 
    const [showBoiler, setShowBoiler] = useState(false); 

    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.getAttribute("data-theme") === "dark"
    );

    const grafanaInlet = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/qu9c61rKSAKBVDFnELoLGbigEa2bEFhK?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/qu9c61rKSAKBVDFnELoLGbigEa2bEFhK?orgId=0&kiosk&theme=light";
    const grafanaDomestic = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/F2S4hzK528lnJKXhrqXuuXuANZ2ukGiJ?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/F2S4hzK528lnJKXhrqXuuXuANZ2ukGiJ?orgId=0&kiosk&theme=light";
    const grafanaTaman = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/lIetxbn0LnxATh9nkYk9af7lvnaSFeg8?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/lIetxbn0LnxATh9nkYk9af7lvnaSFeg8?orgId=0&kiosk&theme=light";
    const grafanaOsmo = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/v1Ret7UfE1QbpyhYNOkEh98jlcc0IatX?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/v1Ret7UfE1QbpyhYNOkEh98jlcc0IatX?orgId=0&kiosk&theme=light";
    const grafanaBoiler = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/rjp6mbq3O8HEpUwdOKfZ7FYpif7XMu4Y?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/rjp6mbq3O8HEpUwdOKfZ7FYpif7XMu4Y?orgId=0&kiosk&theme=light";
    const grafanaPDAMMonth = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/T7IQgfFb5B4gGT16l7u7mV7RKmzoBJSW?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/T7IQgfFb5B4gGT16l7u7mV7RKmzoBJSW?orgId=0&kiosk&theme=light";
    const grafanaPDAMYear = isDarkMode 
    ? "https://snapshots.raintank.io/dashboard/snapshot/hV5Qr0FJLj4uBZ2EIkhChrfJwibVyrUz?orgId=0&kiosk"
    : "https://snapshots.raintank.io/dashboard/snapshot/hV5Qr0FJLj4uBZ2EIkhChrfJwibVyrUz?orgId=0&kiosk&theme=light";

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
            setInlet(varWebSocket["Inlet"]);
            setDomestic(varWebSocket["Domestic"]);
            setTamanPos(varWebSocket["TamanPosJaga"]);
            setBoiler(varWebSocket["Boiler"]);
            setRejectOsmo(varWebSocket["RejectOsmotron"]);
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-2 transition delay-300">
            <div className="rounded-md mt-2 flex flex-col border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
            onClick={() => setShowBoiler(true)}>
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran">
                        <GrFanOption size={31} className="flex-shrink-0 m-1 z-10 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Boiler</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins relative text-black dark:text-white">{boiler !== null && boiler !== undefined 
                            ? parseFloat(boiler).toFixed(2) 
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
            {/* Pop-Up */}
            {showBoiler && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                    <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
                    <p className="text-text my-2">Ini adalah pop-up dari card Reject Osmotron.</p>
                    <iframe
                        src={grafanaBoiler}
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
                        onClick={() => setShowBoiler(false)}
                        className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
                    >
                        X
                    </button>
                    </div>
                </div>
            )}
{/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
            onClick={() => setShowDomestic(true)}>
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran">
                        <GiBaseDome size={31} className="flex-shrink-0 m-1 z-10 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Domestik</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{domestic ?? "N/A"}</h4>
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
            {/* Pop-Up */}
            {showDomestic && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
                <p className="text-text my-2">Ini adalah pop-up dari card Domestik.</p>
                <iframe
                    src={grafanaDomestic}
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
                    onClick={() => setShowDomestic(false)}
                    className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
                >
                    X
                </button>
                </div>
            </div>
            )}
{/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
            <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
            onClick={() => setShowInlet(true)}>
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran relative">
                        <PiPlantFill size={32} className="flex-shrink-0 m-1 z-10 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Inlet Pre-Treatment</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{inlet ?? "N/A"}</h4>
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
        {/* Pop-Up */}
        {showInlet && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text my-2">Ini adalah pop-up dari card Inlet.</p>
              <iframe
                src={grafanaInlet}
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
                onClick={() => setShowInlet(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
{/* -----------------------------------------------------------   &&&  -------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-2 transition delay-300">
            <div className="rounded-md mt-2 flex flex-col border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
            onClick={() => setShowOsmo(true)}>
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran">
                        <IoLogoElectron size={32}  className="flex-shrink-0 m-1 z-10 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Reject Osmotron</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins relative text-black dark:text-white">{rejectosmo !== null && rejectosmo !== undefined 
                            ? parseFloat(rejectosmo).toFixed(2) 
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
            {/* Pop-Up */}
            {showOsmo && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
                <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
                <p className="text-text my-2">Ini adalah pop-up dari card Reject Osmotron.</p>
                <iframe
                    src={grafanaOsmo}
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
                    onClick={() => setShowOsmo(false)}
                    className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
                >
                    X
                </button>
                </div>
            </div>
            )}
{/* --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <div className="rounded-md mt-2 border border-border px-7.5 py-6 shadow-buatcard bg-coba cursor-pointer"
            onClick={() => setShowTamanPos(true)}>
                <div className="flex items-center gap-4">
                    <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-lingkaran relative">
                        <YardIcon sx={{ fontSize: 32 }} className="flex-shrink-0 m-1 z-10 "/>
                    </div>
                    <h1 className="text-text text-2xl font-semibold font-DMSans">Taman Pos Jaga</h1>
                </div>
                <div className="mt-4 flex items-end justify-between">
                    <div>
                        <h4 className="text-[28px] font-bold font-poppins text-black dark:text-white">{tamanpos !== null && tamanpos !== undefined 
                            ? parseFloat(tamanpos).toFixed(2) 
                            : "N/A"}</h4>
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
        {/* Pop-Up */}
        {showTamanPos && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="rounded-md border border-border shadow-buatcard bg-coba p-6 relative w-full">
              <p className="text-text my-2">Ini adalah pop-up dari card Taman Pos Jaga.</p>
              <iframe
                src={grafanaTaman}
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
                onClick={() => setShowTamanPos(false)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full"
              >
                X
              </button>
            </div>
          </div>
        )}
{/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------         */}
        <div className="text-center mt-8 p-2 shadow-buatcard bg-coba rounded-md relative">
        <h1 className="text-center text-text text-4xl antialiased hover:subpixel-antialiased mb-2">PDAM Chart</h1>
        <iframe
          src={grafanaPDAMMonth}
          // width="540"
          // height="480"
          style={{
            border: 'none', // Removes border
            position: 'relative',
            width: '100%', // Full width of parent div
            aspectRatio: '16 / 6', // Adjust aspect ratio as needed
            height: '800px' // Set a fixed height for the iframe
          }}
          title="Grafana Chart">
        </iframe>
        <br/>
        <iframe
          src={grafanaPDAMYear}
          // width="540"
          // height="480"
          style={{
            border: 'none', // Removes border
            position: 'relative',
            width: '100%', // Full width of parent div
            aspectRatio: '16 / 6', // Adjust aspect ratio to match the desired size
            height: '800px', // Set a fixed height for the iframe
          }}
          title="Grafana Chart">
        </iframe>
      </div>

    </>
  )
}

export default PDAM