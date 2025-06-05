import { useNavigate } from "react-router-dom";

export const RoutingCompo = () => {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => navigate("/events")}
        className="font-semibold text-gray-500 cursor-pointer"
      >
        Home {">"} events details
      </div>
    </>
  );
};

