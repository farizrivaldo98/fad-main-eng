import React from 'react';
import Header from './header';

const HeroSection = () => {
  return (
    <section className="flex relative flex-col items-start px-16 pt-7 pb-1 w-full min-h-[547px] shadow-[50px_4px_6px_rgba(0,0,0,0.25)] max-md:px-5 max-md:max-w-full">
      {/* <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8ce4099c7ccfff2e918ceb874e95964edd0ff1be48b1c83b27b3a3ca8fcd4414?placeholderIfAbsent=true&apiKey=1b9add1fe9cd4231acb4cdffd2ffc985" alt="" className="object-cover absolute inset-0 size-full" /> */}
      <h1 className="relative mt-28 ml-16 text-7xl font-extrabold tracking-tighter leading-[82px] text-zinc-100 max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
        HISTORICAL MACHINERY
      </h1>
      <p className="relative mt-11 ml-28 text-xl font-semibold tracking-tight leading-6 text-neutral-400 w-[440px] max-md:mt-10 max-md:max-w-full">
        Pantau dan kendalikan seluruh proses produksi Anda secara real-time dan historis. Dapatkan data akurat dan visualisasi yang jelas untuk pengambilan keputusan yang lebih baik.
      </p>
    </section>
  );
};

export default HeroSection;