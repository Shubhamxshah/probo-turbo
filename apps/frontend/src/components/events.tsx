'use client';

import React from 'react';
import { useRef, useState } from 'react';
import { events } from '@/db/data';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { symbols } from '@/db/data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Events = () => {
  const [activeTab, setActiveTab] = useState(1);
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -700, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 700, behavior: 'smooth' });
    }
  };

  return (
    <>
    <div>
      <div className="p-4 hidden lg:block max-w-7xl mx-auto">
        <div className="text-sm px-10 font-semibold cursor-pointer border-b-[#E3E3E3] border-b flex justify-between">
          {events.map((item) => (
            <button
              key={item.eventId}
              onClick={() => setActiveTab(item.eventId)}
              className={`pb-3 cursor-pointer relative transition-all duration-900 ease-in-out ${
                activeTab === item.eventId ? 'font-bold text-black' : 'font-normal text-[#575757]'
              }`}
            >
              {item.title}
              {activeTab === item.eventId && (
                <span
                  className="absolute left-0 bottom-0 w-full h-[2px] bg-black 
              transition-transform duration-1000 ease-in-out transform translate-y-[2px]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-2 px-9 flex max-w-7xl mx-auto">
        <button onClick={scrollLeft} className="mr-1">
          <IoIosArrowBack size={20} />
        </button>
        <div
          ref={sliderRef}
          style={{ scrollBehavior: 'smooth' }}
          className="w-screen overflow-x-scroll scrollbar-hide flex space-x-4"
        >
          {symbols.map((val) => (
            <button
              onClick={() => router.push('/event-details')}
              key={val.id}
              className="min-w-fit max-w-xs border bg-white shadow-md rounded-lg p-2 flex gap-2 text-sm font-sans overflow-hidden items-center"
            >
              <Image
                className="rounded flex-shrink-0"
                width={20}
                height={20}
                src={val.url}
                alt="ind"
              />
              {val.mainTitle}
            </button>
          ))}
        </div>
        <button onClick={scrollRight} className="ml-1">
          <IoIosArrowForward size={20} />
        </button>
      </div>
    </div>
    </>
  );
};

export default Events;

