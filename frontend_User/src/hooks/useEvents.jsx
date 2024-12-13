import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchEvents = async (organizerId = null) => {
  let url = "/api/event/all-events";
  if (organizerId) {
    url = `/api/event/all-events?organizerId=${organizerId}`;
  }

  const response = await axios.get(url);
  // Replace http with https in image URLs
  const events = response.data
    .filter((event) => event.status !== "pending")
    .map((event) => {
      event.Image = event.Image.map((imageUrl) =>
        imageUrl.startsWith("http:")
          ? imageUrl.replace("http:", "https:")
          : imageUrl,
      );
      return event;
    });
  return events;
};

const useEvents = (organizerId = null) => {
  const {
    data: events,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["events", organizerId ?? 0],
    queryFn: () => fetchEvents(organizerId),
    refetchInterval: 2 * 60 * 1000, // 2 minutes(data will be refetched every 2 minutes)
  });
  if (error) {
    console.error("Error fetching events:", error);
  }
  return [events, isLoading];
};
export default useEvents;
