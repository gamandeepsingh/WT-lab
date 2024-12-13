// Event Types
export const typeOptions = [
  "Parties",
  "Standup",
  "Workshop",
  "Meetup",
  "Concert",
  "Exhibition",
  "Live Vibes",
];

// Languages
export const languages = [
  "Hindi",
  "English",
  "Kannada",
  "Bengali",
  "Malyalam",
  "Tamil",
  "Punjabi",
  "Hinglish",
  "Urdu",
  "Marathi",
  "Gujrati",
  "Pahari",
];

// Month names array
export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Form Validations
export const validateInput = (name, value) => {
  switch (name) {
    case "username":
      // Allow only lowercase letters, hyphen, number, underscore (no space)
      const usernamePattern = /^[a-z0-9_-]+$/;
      return usernamePattern.test(value)
        ? ""
        : "Username can only include lowercase letters, hyphen, number, and underscore (no space)";
    case "Price":
      return ["Free", "Check-in", "Paid", "Fixed-price"].includes(value)
        ? ""
        : "Invalid price option selected";
    case "EventCost":
      return /^\d+$/.test(value) ? "" : "Only numbers allowed for this field";
    case "Location":
      // Validate Location here
      const locationPattern = /^(ftp|http|https):\/\/[^ "]+$/;
      return locationPattern.test(value) ? "" : "Invalid location URL";
    case "name":
      return /^[A-Za-z\s]+$/.test(value)
        ? ""
        : "Name must contain only alphabets";
    case "description":
      if (value.trim().length === 0) {
        return "Description is required.";
      } else if (value.length > 1000) {
        // Adjust the maximum length as per your requirement
        return "Description must be less than 1000 characters.";
      } else {
        return ""; // Valid description
      }

    case "otp":
      if (value.length < 6 || value.length > 6) {
        return "Otp must be 6 characters long";
      } else if (!/^\d+$/.test(value)) {
        return "OTP must contain only digits";
      } else {
        return "";
      }
    case "password":
      // Password strength check
      if (value.length < 8) {
        return "Password must be at least 8 characters long";
      } else if (!/[a-z]/.test(value)) {
        return "Password must contain at least one lowercase letter";
      } else if (!/[A-Z]/.test(value)) {
        return "Password must contain at least one uppercase letter";
      } else if (!/\d/.test(value)) {
        return "Password must contain at least one digit";
      } else {
        return "";
      }
    case "phoneNo":
      // Phone number validation (Indian format)
      const phonePattern = /^\d{10}$/;
      return phonePattern.test(value)
        ? ""
        : "Phone number must be exactly 10 digits";
    case "Date":
      const inputDate = new Date(value);
      const today = new Date();
      // Set the time to 0 to only compare dates
      today.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        return "Date cannot be older than today";
      } else {
        return "";
      }

    default:
      return "";
  }
};

export const locations = [
  {
    city: "Bangalore",
    state: "Karnataka",
  },
  {
    city: "Raipur",
    state: "Chhattisgarh",
  },
  {
    city: "Himachal",
    state: "Himachal Pradesh",
  },
  {
    city: "Delhi",
    state: "Delhi",
  },
  {
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    city: "Kolkata",
    state: "West Bengal",
  },
  {
    city: "Pune",
    state: "Maharashtra",
  },
];
