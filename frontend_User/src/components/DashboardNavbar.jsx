import { Link } from "react-router-dom";

const DashboardNavbar = () => {
  const menuOptions = [
    { title: "Analytics", path: "/dashboard" },
    { title: "All Events", path: "/dashboard/events" },
    { title: "All Offers", path: "/dashboard/offers" },
    { title: "All Bookings", path: "/dashboard/bookings" },
  ];
  return (
    <>
      <div className="flex items-center justify-between mx-auto mb-4 bg-dullBlack dark:bg-secondary rounded-md px-0 text-black w-full md:w-96 overflow-x-scroll no-scrollbar">
        <div className="flex-grow flex justify-center items-center gap-2">
          {menuOptions.map((item) => (
            <Link
              to={item.path}
              key={item}
              className={`text-xs rounded-md text-nowrap ${
                window.location.pathname === item.path
                  ? "bg-white dark:bg-primary text-black m-1 py-2 p-3"
                  : "bg-transparent text-white dark:text-primary py-3 p-3"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardNavbar;
