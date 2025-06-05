import { useEffect, useState } from "react";
import headerImage from "../assets/lendingheader.avif";
import { Download } from "./download";
import { useRouter } from "next/navigation";
import startqoutes from "../assets/Startquotes.avif";
import endqoutes from "../assets/Endquotes.avif";
import nazar from "../assets/nazar.avif";
import khabar from "../assets/khabar.avif";
import jigar from "../assets/jigar.avif";
import sabar from "../assets/sabar.avif";
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
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[#F5F5F5] w-full min-h-[650px] flex flex-col lg:flex-row justify-between px-4 lg:px-20">
        <div className="flex flex-col justify-center py-10 lg:py-0" id="left">
          <h1 className="text-4xl md:text-6xl lg:text-[80px] font-normal work-sans">
            Invest in your
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-[56px] work-sans font-normal -mt-2">
            point of view
          </h2>
          <h5 className="text-lg md:text-xl lg:text-[22px] font-normal work-sans text-[#545454] mt-5">
            Sports, Entertainment, Economy or Finance.
          </h5>
          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <button
              onClick={() => setIsDownload(true)}
              disabled={!validAge}
              className={`border rounded px-6 lg:px-10 py-2 ${
                validAge
                  ? "text-black bg-white"
                  : "text-white bg-[#ABABAB] cursor-not-allowed"
              }`}
            >
              Download App
            </button>
            <button
              onClick={() => router.push("/events")}
              disabled={!validAge}
              className={`border rounded px-6 lg:px-10 py-2 ${
                validAge
                  ? "text-white bg-black"
                  : "text-white bg-[#ABABAB] cursor-not-allowed"
              }`}
            >
              Trade Online
            </button>
          </div>
          <span className="flex items-center">
            <input
              checked={validAge}
              onChange={() => setValidAge(!validAge)}
              className="w-4 h-4 accent-black mt-4"
              type="checkbox"
              name="age"
            />
            <span className="text-xs font-medium mt-4 ml-2 text-[#757575]">
              For 18 years and above only
            </span>
          </span>
        </div>
        <div className="w-full lg:w-auto mt-8 lg:mt-0">
          <Image src={headerImage} alt="header" className="w-full h-auto lg:w-auto" />
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[#262626] py-10 lg:py-14 px-4 lg:px-36 w-full min-h-[630px] flex flex-col lg:flex-row justify-between">
        <div className="w-full lg:w-[55%] py-10 lg:py-44">
          <div className="flex flex-col sm:flex-row gap-5">
            {["samachar", "vichaar", "vyapaar"].map((tab) => (
              <button
                key={tab}
                value={tab}
                onClick={() => setSectionTab(tab as TabType)}
                className={`${
                  sectionTab === tab
                    ? "text-[#FFFFFF] font-semibold"
                    : "text-[#757575] font-normal"
                } text-3xl lg:text-5xl work-sans`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-y-5">
            <h1 className="text-white work-sans text-2xl lg:text-4xl font-semibold">
              {data[sectionTab].heading}
            </h1>
            <p className="text-white work-sans text-xl lg:text-4xl font-normal">
              {data[sectionTab].text}
            </p>
          </div>
        </div>
        <div className="border-[12px] mt-8 lg:mt-0 mx-auto lg:mr-14 border-[#3f3f3f] rounded-[38px] w-full max-w-[320px] lg:w-80 h-fit">
          <video
            className="rounded-[30px] h-fit w-full"
            autoPlay
            playsInline
            muted
            loop
            preload="auto"
          >
            <source src='../assets/info-video.mp4' type="video/mp4" />
          </video>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-[#F5F5F5] w-full min-h-[630px] px-4 lg:px-24 py-10 lg:py-20">
        <div className="text-center lg:text-left">
          <div className="text-[#262626] lg:ml-48 items-center work-sans text-3xl md:text-5xl lg:text-[64px] font-semibold flex flex-col lg:flex-row justify-center lg:justify-start">
            <Image
              width={70}
              height={70}
              className="object-contain h-fit mr-4 w-12 lg:w-auto"
              src={startqoutes}
              alt="quote"
            />
            <span className="text-center lg:text-left">News that creates trading</span>
          </div>
          <div className="text-[#262626] lg:ml-[40%] items-center work-sans text-3xl md:text-5xl lg:text-[64px] font-semibold flex flex-col lg:flex-row justify-center lg:justify-start mt-4">
            <span>opportunity, everyday</span>
            <Image
              width={70}
              height={70}
              className="object-contain h-fit rotate-180 w-12 lg:w-auto mt-4 lg:mt-0"
              src={endqoutes}
              alt="quote"
            />
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-20">
          {[
            { name: "Nazar", img: nazar, text: "Keep an eye on the happenings around you. Be it Politics, Sports, Entertainment and more." },
            { name: "Khabar", img: khabar, text: "Understand the news without the noise. Get to the crux of every matter and develop an opinion." },
            { name: "Jigar", img: jigar, text: "Have the courage to stand by your opinions about upcoming world events by investing in them." },
            { name: "Sabar", img: sabar, text: "Have the patience to negotiate market ups and downs, and take a decision as events unfold." }
          ].map((item) => (
            <div key={item.name} className="relative flex flex-col items-center pb-24">
              <div className="relative">
                <Image src={item.img} alt={item.name.toLowerCase()} className="w-full" />
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
