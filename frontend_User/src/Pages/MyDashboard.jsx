import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollRestoration } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import DashboardNavbar from "../components/DashboardNavbar";
import useEvents from "../hooks/useEvents";
import useBookings from "../hooks/useBookings";
import { useSelector } from "react-redux";

const MyDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [events = []] = useEvents(currentUser._id) || [];
  const [bookings = []] = useBookings(currentUser._id) || [];
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/offer/myOffers/${currentUser.email}`)
      .then((res) => {
        const sortedOffers = res.data || []; // Ensure data is an array
        setOffers(sortedOffers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the offers!", error);
      });
  }, [currentUser.email]);
  console.log("Events: ", events);

  // Data for the first graph: Total Events & Offers
  const totalEventsOffersData = [
    { name: "Events", value: events.length },
    { name: "Offers", value: offers.length },
  ];

  // Data for the second graph: Types of Events
  const eventTypes = events.reduce((acc, event) => {
    const category = event.Type || "Unknown";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += 1;
    return acc;
  }, {});

  const eventTypesData = Object.keys(eventTypes).length > 0 ? Object.keys(eventTypes).map((type) => ({
    name: type,
    value: eventTypes[type],
  })) : [
    { name: "Standup", value: 0 },
    { name: "Parties", value: 0 },
    { name: "Workshop", value: 0 },
    { name: "Exhibition", value: 0 },
    { name: "Meetup", value: 0 },
    { name: "Live Vibes", value: 0 },
  ];

  const eventTypeColors = {
    Standup: "#60A5FA",
    Parties: "#34D399",
    Workshop: "#A78BFA",
    Exhibition: "#F472B6",
    Meetup: "#FBBF24",
    "Live Vibes": "#F87171",
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white border border-[#ccc] p-4">
          <p className="label">{name}</p>
          <p className="intro">Events: {value}</p>
        </div>
      );
    }
    return null;
  };

  // Data for the third graph: Total Number of Bookings
  const totalBookings = bookings.length;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
      >
        {name}: {value}
      </text>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ScrollRestoration />
      <div className="h-full bg-white dark:bg-black mx-auto p-4 relative">
        <DashboardNavbar />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* First Chart: Total Events & Offers */}
          <div className="bg-gray-100 p-6 rounded-lg border border-[#dbdbdb]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Total Events & Offers
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={totalEventsOffersData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#4F46E5"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  // label={({ name, value }) => `${name}: ${value}`}
                  // labelStyle={{
                  //   fontSize: "13px",
                  //   fill: "#333",
                  //   wordWrap: "break-word",
                  //   maxWidth: "80px",
                  // }}
                >
                  {totalEventsOffersData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#60A5FA" : "#34D399"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-3 text-gray-700">
              {totalEventsOffersData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center text-sm font-medium"
                >
                  <span
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#60A5FA" : "#34D399",
                    }}
                  ></span>
                  {item.name}: {item.value}
                </div>
              ))}
            </div>
          </div>

          {/* Second Chart: Types of Events */}
          <div className="bg-gray-100 p-6 rounded-lg border border-[#dbdbdb]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Types of Events
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventTypesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  shape={(props) => {
                    const { fill, x, y, width, height, index } = props;
                    const name = eventTypesData[index].name; // Get the name for this index
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={eventTypeColors[name] || "#60A5FA"} // Use the color from eventTypeColors
                      />
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center flex-wrap space-x-4 mt-3 text-gray-700">
              {eventTypesData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center text-sm font-medium mb-1"
                >
                  <span
                    className="w-3 h-3 mr-1 rounded-full"
                    style={{ backgroundColor: eventTypeColors[item.name] }}
                  ></span>
                  {item.name}: {item.value}
                </div>
              ))}
            </div>
          </div>

          {/* Third Chart: Total Number of Bookings */}
          <div className="bg-gray-100 p-6 rounded-lg border border-[#dbdbdb] flex items-center justify-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Bookings
              </h2>
              <div className="text-3xl font-bold text-gray-800 text-center">
                {/* {totalBookings === 0 ? "Loading..." : totalBookings} */}
                {totalBookings}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDashboard;
