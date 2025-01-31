import React, { useEffect, useState, useRef } from "react";
import Header from "../components/header";
// import City from '../assets/3dcity.png';
import { Spinner } from "@chakra-ui/react";
import Chart01 from "./Chart01";
import Chart02 from "./chart02";
import NVMDP from "./NVMDP";
import PDAM from "./PDAM";

function Dashboard() {
  const [data, setData] = useState({});
  const socketRef = useRef(null);

  const [activeCard, setActiveCard] = useState(null); // Menyimpan card yang aktif
  const [loading, setLoading] = useState(false); // Mengontrol spinner
  const [error, setError] = useState(false); // Mengontrol pesan error


  const [wsMVMDP, setWSMVMDP ] = useState();

  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute("data-theme") === "dark"
  );

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
        setData(varWebSocket); // Simpan seluruh objek dalam satu state
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
           
        // if (topicMatch) {
        //   const topic = topicMatch[1];
        //   const jsonData = JSON.parse(message.replace(/.*]: /, "")); // Parse JSON
        //   const newMessages = varWebSocket
          
        //   // {
        //   //   ...messages,
        //   //   [topic]: jsonData.d || {},
        //   // };
         
         
          
        //   setMessages(newMessages);
        //   console.log(typeof(jsonData.MVMDP));
          
          
        //   // Ambil nilai spesifik (contoh untuk kwhmeter.MVMDP)
        //   if (topic === "MVMDP" && jsonData.d?.MVMDP) {
        //     setFilteredValue(jsonData.d.MVMDP[0]); // Ambil nilai pertama
        //   }
        //   if (topic === "dbwater" && jsonData.d?.PDAM) {
        //     setFilteredValue2(jsonData.d.PDAM[0]); // Ambil nilai pertama
        //   }
        //   if (topic === "totalgas" && jsonData.d?.gas_total_boiler) {
        //     setFilteredValue3(jsonData.d.gas_total_boiler[0]); // Ambil nilai pertama
        //   }
        //   if (topic === "masterbox" && jsonData.d) {
        //     console.log("Masterbox data:", jsonData.d);
        //     setMasterboxData(jsonData.d); // Update state
        //   }
          
        // }

  useEffect(() => {
    if (activeCard) {
      setLoading(true);
      setError(false); // Reset error saat card baru dipilih

      // Simulasi delay untuk loading
      const timer = setTimeout(() => {
        setLoading(false);

        // Simulasi error jika diperlukan
        if (activeCard === "NVMDP" && Math.random() < 0.2) {
          setError(true); // 20% kemungkinan terjadi error
        }
        if (activeCard === "PDAM" && Math.random() < 0.2) {
          setError(true); // 20% kemungkinan terjadi error
        }
      }, 2000); // Delay 2 detik

      return () => clearTimeout(timer); // Bersihkan timer saat component unmount
    }
  }, [activeCard]);

  //console.log("ini datanya",messages.totalgas);

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
    <div>
      <>
      <Header />
      </>
      
      <div className="min-h-screen bg-cobabg mx-auto p-4 md:p-6 2xl:p-10 relative">
        {/* Section Title */}
        <div className="text-text text-4xl font-sans font-bold mb-8 text-center">
          KALBE CONSUMER HEALTH OVERVIEW
        </div>
        <div class="flex flex-col space-y-6 md:space-y-0 md:flex-row-reverse justify-between">
          <div class="flex flex-wrap items-start justify-end -mb-3">
            <button class="inline-flex px-5 py-3 text-text border bg-coba border-meta-2 dark:border-meta-4 hover:bg-white dark:hover:bg-boxdark focus:bg-purple-700 dark:focus:bg-purple-700 rounded-md mb-3">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="flex-shrink-0 h-5 w-5 -ml-1 mt-0.5 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Manage dashboard
            </button>
            <button class="inline-flex px-5 py-3 text-text bg-coba border border-meta-2 dark:border-meta-4 hover:bg-white dark:hover:bg-boxdark focus:bg-purple-700 dark:focus:bg-purple-700 rounded-md ml-6 mb-3">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="flex-shrink-0 h-6 w-6 text-white -ml-1 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Bill
            </button>
          </div>
        </div>

        {/* Main Wrapper */}
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-3">
          <div className={`flex items-center p-8 bg-coba shadow-buatcard rounded-lg dark:border-strokedark cursor-pointer ${
            activeCard === "Water Consumption" ? "ring-4 ring-blue-500" : ""
          }`}
          onClick={() => setActiveCard("NVMDP")}>
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-purple-600 bg-purple-100 rounded-full mr-6">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl text-text font-bold font-DMSans">MVMDP</h1>
              <span className="block text-xl text-text font-semibold">{data.MVMDP ?? "Loading..."}</span>
              <span className="block text-gray-500">Kwh</span>
            </div>
          </div>
          <div className={`flex items-center p-8 shadow-buatcard bg-coba rounded-lg dark:border-strokedark cursor-pointer ${
            activeCard === "Water Consumption" ? "ring-4 ring-blue-500" : ""
          }`}
          onClick={() => setActiveCard("PDAM")}>
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 bg-green-100 rounded-full mr-6">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl text-black dark:text-white font-bold font-DMSans">PDAM</h1>
              <span className="block text-black dark:text-white text-xl font-semibold">{data.PDAM ?? "Loading..."}</span>
              <span className="block text-gray-500">kubik</span>
            </div>
          </div>
          <div className="flex items-center p-8 shadow-buatcard bg-coba rounded-lg dark:border-strokedark">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-red-600 bg-red-100 rounded-full mr-6">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl text-black dark:text-white font-bold font-DMSans">Gas Boiler</h1>
              <span className="inline-block text-xl text-black dark:text-white font-semibold">{data.Total_Gas_Boiler ?? "Loading..."}</span>
              <span className="block text-gray-500">Gas</span>
            </div>
          </div>
          <div className="flex items-center p-6 shadow-buatcard bg-coba rounded-lg dark:border-strokedark">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
              <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl text-text font-bold font-DMSans text-center">Output Master Box</h1>
              <div className="grid grid-cols-4 text-center border-b border-gray-300 text-text py-1">
                <div className="font-bold text-text">ID</div>
                <div className="font-bold text-text">Line 1</div>
                <div className="font-bold text-text">Line 2</div>
                <div className="font-bold text-text">Line 3</div>
              </div>
              <div className="grid grid-cols-4 text-center pt-2">
                <div className="text-text font-semibold">A</div>
                <div className="text-text">{data.MasterBoxL1 ?? "N/A"}</div>
                {/* <div role="status" class="max-w-sm animate-pulse">
                  <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <span class="sr-only">Loading...</span>
                </div> */}
                <div className="flex flex-row justify-center ">
                  <Spinner
                    thickness="2px"
                    speed="1.5s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="sm"
                    alignItems="center"
                  />
                </div>
                <div className="text-text">{data.MasterBoxL3_1 ?? "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 text-center">
                <div className="text-text font-semibold">B</div>
                <div className="text-text">N/A</div>
                <div className="text-text">{data.MasterBoxL2_2 ?? "N/A"}</div>
                <div className="text-text">{data.MasterBoxL3_2 ?? "N/A"}</div>
              </div>
              <div className="grid grid-cols-4 text-center">
                <div className="text-text font-semibold">C</div>
                <div className="text-text">N/A</div>
                <div className="flex flex-row justify-center ">
                  <Spinner
                    thickness="2px"
                    speed="1.5s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="sm"
                    alignItems="center"
                  />
                </div>
                <div className="flex flex-row justify-center ">
                  <Spinner
                    thickness="2px"
                    speed="1.5s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="sm"
                    alignItems="center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
      {/* Conditional Content Section */}
      <section className="mt-8">
        {activeCard === "NVMDP" && (
          <div>
            <h2 className="text-2xl font-bold text-center text-white mb-4">
              Power Consumption
            </h2>
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
              <div className="text-red-500 flex flex-col items-center">
                No available data
              </div>
            ) : (
              <NVMDP /> // Konten utama
            )}
          </div>
        )}
        {activeCard === "PDAM" && (
          <div>
            <h2 className="text-2xl font-bold text-center text-white mb-4">
              Water Consumption
            </h2>
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
              <div className="text-red-500 flex flex-col items-center">
                No available data
              </div>
            ) : (
              <PDAM /> // Konten utama
            )}
          </div>
        )}
        {!activeCard && (
          <div className="text-center mt-8">
            <p className="text-text">Please select a card to view details.</p>
          </div>
        )}
      </section>
        
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-[30px] 2xl:gap-[10px]">
          <Chart01 />
          <Chart02 />
          {/* <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4"> */}
          
          {/* </div> */}
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
