import { Button } from "../utils/buttons";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface TradeCardType {
  symbol: any;
  url: any;
  yesPrice: string;
  noPrice: string;
  totalTrades: string;
  title: string;
  description: string;
}

export const TradeCard = ({
  symbol,
  url,
  yesPrice,
  noPrice,
  totalTrades,
  title,
  description,
}: TradeCardType) => {
    const router = useRouter();
  
  return (
    <>
      <div
        key={symbol.id}
        onClick={() => router.push("/event-details")}
        className="border grid-flow-row w-full p-3 rounded-xl cursor-pointer bg-white shadow-md mt-3"
      >
        <span className="flex text-xs">
          <Image
            className="mr-1"
            width={15}
            height={15}
            src="/trades.avif"
            alt="trades"
          />
          {totalTrades} traders
        </span>
        <div className="flex space-x-4">
          <Image
            className="rounded-lg mt-2"
            width={70}
            height={70}
            src={url}
            alt="tradeicon"
          />
          <h2 className="text-lg py-2 font-medium">{title}</h2>
        </div>
        <span className="flex text-[#5E5E5E] text-xs mt-4">
          <Image
            className="object-contain"
            width={15}
            height={15}
            src="/coma.avif"
            alt="coma"
          />
          {description}
        </span>
        <div className="flex p-1 mt-4 gap-2">
          <Button
            text={"Yes"}
            price={yesPrice}
            customClasses={"bg-[#F1F7FF] text-[#1A7BFE] w-1/2"}
          />
          <Button
            text={"No"}
            price={noPrice}
            customClasses={"bg-[#FEF5F5] text-[#E05852] w-1/2"}
          />
        </div>
      </div>
    </>
  );
};

