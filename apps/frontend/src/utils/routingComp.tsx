import { useRouter } from "next/navigation";

export const RoutingCompo = () => {
  const router = useRouter();

  return (
    <>
      <div
        onClick={() => router.push("/dashboard")}
        className="font-semibold text-gray-500 cursor-pointer"
      >
        Home {">"} events details
      </div>
    </>
  );
};

