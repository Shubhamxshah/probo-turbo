import { RoutingCompo } from '../utils/routingComp';
import bitcoing from '../assets/bitcoin.avif';
import { useState, useEffect } from 'react';
import { PriceTable } from './pricingTable';
import userProfile from '../assets/userprofile.avif';
import { ProgressBar } from './progressBar';
import { ReadMoreText } from '../utils/readMore';
import { BuySellCard } from './buySellCard';
import Image from 'next/image';
import Navbar from './Navbar';
import { Separator } from '@repo/ui/components/base/separator';

const navigationBar = [
  {
    id: 1,
    title: 'Order book',
    value: 'orderbook',
  },
  {
    id: 2,
    title: 'Timeline',
    value: 'timeline',
  },
  {
    id: 3,
    title: 'Overview',
    value: 'overview',
  },
];

const orderBookTab = [
  {
    id: 1,
    title: 'Order Book',
  },
  {
    id: 2,
    title: 'Activity',
  },
];

const progressData = [
  {
    id: 1,
    userIcon: userProfile,
    userName: ['Prober', 'Prober'],
    yesValue: 6.5,
    noValue: 3.5,
  },
  {
    id: 2,
    userIcon: userProfile,
    userName: ['Prober', 'Prober'],
    yesValue: 4,
    noValue: 6,
  },
  {
    id: 3,
    userIcon: userProfile,
    userName: ['Prober', 'Prober'],
    yesValue: 5,
    noValue: 5,
  },
  {
    id: 4,
    userIcon: userProfile,
    userName: ['Prober', 'Prober'],
    yesValue: 2,
    noValue: 8,
  },
  {
    id: 5,
    userIcon: userProfile,
    userName: ['Prober', 'Prober'],
    yesValue: 4,
    noValue: 6,
  },
];

const dataYes = [
  { price: 7, qty: 465510 },
  { price: 7.5, qty: 290450 },
  { price: 8, qty: 105919 },
  { price: 8.5, qty: 94744 },
  { price: 9, qty: 120071 },
];

const dataNo = [
  { price: 3.5, qty: 358537 },
  { price: 4, qty: 242664 },
  { price: 4.5, qty: 72327 },
  { price: 5, qty: 50544 },
  { price: 5.5, qty: 56733 },
];

interface navigationType {
  orderbook?: string;
  timeline?: string;
  overview?: string;
}

type OrderEntry = { price: number, qty: number };

const description =
  'Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network. Bitcoin transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain. Open price at expiry time as displayed on the source of truth will be considered';

export const EventsCompo = () => {
  const [dataY, setDataY] = useState<OrderEntry[]>(dataYes);
  const [dataN, setDataN] = useState<OrderEntry[]>(dataNo);


  function extractTopFive(asks: Record<string, unknown>): OrderEntry[] {
    return Object.entries(asks)
      .map(([price, qty]) => ({
        price: Number(price) / 100,
        qty: Number(qty),
      }))
      .filter(entry => entry.qty > 0)
      .sort((a, b) => a.price - b.price)
      .slice(0, 5);
  }

  useEffect(() => {
    const WS_URL = process.env.WS_URL || 'ws://localhost:8080';
    const ws = new WebSocket(WS_URL);

    const options = {
      type: 'SUBSCRIBE',
      room: 'btc',
    };

  ws.onopen = () => {
    console.log('connected to ws');
    ws.send(JSON.stringify(options));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data); // `event.data` is the raw string
    console.log(data);
    setDataY(extractTopFive(data.YES.asks));
    setDataN(extractTopFive(data.NO.asks));
  };

  ws.onclose = () => {
    console.log('disconnected from server');
  };

    // Cleanup socket on unmount
    return () => {
      ws.close();
    };
  }, []);
  const [navigatioName, setNavigationName] = useState<navigationType | '' | string>('');
  const [activeTab, setActiveTab] = useState(1);

  const handleNavigationClick = (id: string, value: string) => {
    setNavigationName(value);

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Navbar />
      <Separator className="max-w-7xl mx-auto mt-2" />
      <div className="flex flex-col md:flex-row px-4 md:px-8 lg:px-16 xl:px-24 pt-6 md:pt-10">
        <div className="w-full md:w-2/3 md:pr-6 lg:pr-12 xl:pr-24 space-y-6 md:space-y-10">
          <RoutingCompo />

          <div className="pt-6 md:pt-10 flex flex-col md:flex-row gap-4 md:gap-5 items-center md:items-start">
            <Image
              className="rounded-full object-contain w-16 h-16 md:w-24 md:h-24 xl:w-[100px] xl:h-[100px]"
              src={bitcoing}
              alt="bitcoin"
            />
            <h1 className="font-bold text-2xl md:text-3xl xl:text-4xl text-center md:text-left">
              Bitcoin to be priced at 67364.34 USDT or more at 03:55 AM?
            </h1>
          </div>

          <div id="navigation-bar" className="w-full md:w-fit overflow-x-auto">
            <ul className="flex gap-6 md:gap-10 font-light text-base md:text-lg text-[#545454] cursor-pointer whitespace-nowrap">
              {navigationBar.map((item) => (
                <li
                  onClick={() => handleNavigationClick(item.value, item.value)}
                  key={item.id}
                  value={item.value}
                  className={`${
                    navigatioName === item.value ? 'border-b-2 border-black pb-3' : ''
                  } px-2 md:px-0`}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>

          <div
            id="orderbook"
            className={`${activeTab === 2 && 'h-72'} border rounded-xl overflow-hidden bg-white`}
          >
            <div className="text-sm cursor-pointer border-b-[#E3E3E3] bg-white z-10 border-b-2 sticky top-0 flex gap-6 md:gap-10 px-4 md:px-8">
              {orderBookTab.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`pb-3 text-sm md:text-base text-[#545454] pt-5 cursor-pointer relative transition-all duration-300 ease-in-out ${
                    activeTab === item.id ? 'font-bold text-black' : 'font-normal text-[#575757]'
                  }`}
                >
                  {item.title}
                  {activeTab === item.id && (
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black transition-transform duration-1000 ease-in-out transform translate-y-[2px]" />
                  )}
                </button>
              ))}
            </div>

            {activeTab === 1 ? (
              <div className="pt-5 flex flex-col md:flex-row gap-5 px-4 md:px-8">
                <div className="w-full md:w-1/2">
                  <PriceTable data={dataY} qty={'YES'} />
                </div>
                <div className="w-full md:w-1/2">
                  <PriceTable data={dataN} qty={'NO'} />
                </div>
              </div>
            ) : (
              <div className="px-4 md:px-8">
                {progressData.map((val) => (
                  <ProgressBar
                    key={val.id}
                    value1={val.yesValue}
                    value2={val.noValue}
                    userNames={val.userName}
                    userIcon={val.userIcon}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            id="timeline"
            className="border p-4 md:p-8 rounded-xl flex flex-col items-center bg-white"
          >
            <h3 className="font-montserrat font-medium text-[#7A7A7A] text-sm md:text-base">
              THE MARKET PREDICTS
            </h3>
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-[#197BFF] text-center">
              80% probability of Yes
            </h1>
          </div>

          <div id="stats" className="border p-4 md:p-8 bg-white rounded-xl">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-5">Stats</h3>
            <div className="border rounded-lg p-4 md:p-5">
              <h1 className="font-semibold pt-2 text-base md:text-md pb-3">Overview</h1>
              <p className="text-sm font-light">{description}</p>
            </div>
          </div>

          <div id="overview" className="border p-4 md:p-8 bg-white rounded-xl">
            <h1 className="text-xl md:text-2xl font-bold">About the event</h1>
            <div className="flex flex-col md:flex-row gap-4 md:gap-0 mt-6 md:mt-8 items-start justify-between w-full text-sm font-medium text-gray-800">
              <div className="w-full md:w-1/3">
                <span className="text-xs font-semibold text-black block mb-1">Source of Truth</span>
                <a
                  href="https://in.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-words"
                >
                  in.tradingview.com/chart/?symbol=BINANCE%3ABTCUSDT
                </a>
              </div>
              <div className="w-full md:w-1/3">
                <span className="text-xs text-black font-semibold block mb-1">
                  Trading started on
                </span>
                <span>26 Oct, 2024</span>
              </div>
              <div className="w-full md:w-1/3">
                <span className="text-xs text-black font-semibold block mb-1">
                  Event expires on
                </span>
                <span>26 Oct, 2024</span>
              </div>
            </div>
            <div className="mt-5">
              <span className="text-xs font-semibold text-black block mb-2">
                Event Overview & Statistics
              </span>
              {ReadMoreText(description)}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          <BuySellCard />
        </div>
      </div>
    </>
  );
};
