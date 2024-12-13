import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchBookings = async (organizerId) => {
  const url = organizerId ? `/api/payment/event/orders?organizerId=${organizerId}` : `/api/payment/event/orders`;

  const response = await axios.get(url);
  return response.data.data;
};

const useBookings = (organizerId = null) => {
  const {
    data: bookings,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bookings", organizerId ?? 0],
    queryFn: () => fetchBookings(organizerId),
    refetchInterval: 2 * 60 * 1000, // 2 minutes(data will be refetched every 2 minutes)
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    cacheTime: 5 * 60 * 1000,
  });
  if (error) {
    console.error("Error fetching events:", error);
  }
  return [bookings, isLoading];
};

export default useBookings;
