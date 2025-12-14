'use client'

import { useEffect, useState } from "react";
import { Download } from "./download";
import { useRouter } from "next/navigation";
import Image from "next/image";

type TabType = 'samachar' | 'vichaar' | 'vyapaar';

const data = {
  samachar: {
    heading: "Be in the know",
    text: "From Sports to Entertainment, Economy, Finance and more. Keep an eye on events in your field of interest.",
  },
  vichaar: {
    heading: "Use what you know",
    text: "Build your knowledge and form your opinions and views about upcoming events in the world.",
  },
  vyapaar: {
    heading: "Trade and grow",
    text: "Invest in your opinions about future events and use your knowledge to trade & benefit.",
  },
};

export const LandingComp = () => {
  const [validAge, setValidAge] = useState(true);
  const [isDownload, setIsDownload] = useState(false);
  const [sectionTab, setSectionTab] = useState<TabType>("samachar");
  const router = useRouter();

  useEffect(() => {
    const tabs = ["samachar", "vichaar", "vyapaar"];
    let currentIndex = 0;

    const timeId = setInterval(() => {
      currentIndex = (currentIndex + 1) % tabs.length;
      setSectionTab(tabs[currentIndex] as TabType);
    }, 5000);

    return () => clearInterval(timeId);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">

      {/* Quote Section */}
      <section className="bg-[#F5F5F5] w-full min-h-[630px] px-4 lg:px-24 py-10 lg:py-20">
        <div className="text-center lg:text-left">
          <div className="text-[#262626] lg:ml-12 items-center work-sans text-3xl md:text-5xl lg:text-[64px] font-semibold flex flex-col lg:flex-row justify-center lg:justify-start">
            <Image
              width={70}
              height={70}
              className="object-contain h-fit mr-4 w-12 lg:w-auto"
              src="/Startquotes.avif"
              alt="quote"
            />
            <span className="text-center md:text-left">News that creates trading</span>
          </div>
          <div className="text-[#262626] lg:ml-[30%] items-center work-sans text-3xl md:text-5xl lg:text-[64px] font-semibold flex flex-col lg:flex-row justify-center lg:justify-start mt-4">
            <span>opportunity, everyday</span>
            <Image
              width={70}
              height={70}
              className="object-contain h-fit rotate-180 w-12 lg:w-auto mt-4 lg:mt-0"
              src="/Endquotes.avif"
              alt="quote"
            />
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-20">
          {[
            { name: "Nazar", img: "/nazar.avif", text: "Keep an eye on the happenings around you. Be it Politics, Sports, Entertainment and more." },
            { name: "Khabar", img: "/khabar.avif", text: "Understand the news without the noise. Get to the crux of every matter and develop an opinion." },
            { name: "Jigar", img: "/jigar.avif", text: "Have the courage to stand by your opinions about upcoming world events by investing in them." },
            { name: "Sabar", img: "/sabar.avif", text: "Have the patience to negotiate market ups and downs, and take a decision as events unfold." }
          ].map((item) => (
            <div key={item.name} className="relative flex flex-col items-center pb-24">
              <div className="relative">
                <Image src={item.img} alt={item.name.toLowerCase()} width={200} height={200} className="w-full" />
                <div className="absolute inset-0 bg-purple-200 rounded-full -z-10"></div>
              </div>
              <div className="absolute bottom-0 bg-white p-4 w-11/12 text-center shadow-lg">
                <h1 className="text-black text-xl font-semibold mb-2">{item.name}</h1>
                <p className="text-gray-700">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Section */}
      <section className="bg-[#262626] py-10 lg:py-14 px-4 lg:px-36 w-full flex justify-center min-h-[630px] items-center">
        <h1 className="text-white work-sans text-4xl md:text-6xl lg:text-8xl text-center">
          What will be the return on your opinions?
        </h1>
      </section>

      {isDownload && <Download setIsDownload={setIsDownload} />}
    </div>
  );
};
