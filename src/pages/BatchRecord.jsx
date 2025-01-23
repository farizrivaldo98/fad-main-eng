import { React, useState, useEffect } from "react";
import Header from "../components/header";
import BatchRecordIsi from "./BatchRecordIsi";

function BatchRecord() {

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

  return (
    <div className="overflow-x-hidden">
      <Header />
      <div>
        <h1 className="text-center text-text text-4xl antialiased hover:subpixel-antialiased p-8">
          BATCH RECORD
        </h1>
      </div>
      <BatchRecordIsi />
      
    </div>
  );
}

export default BatchRecord;
