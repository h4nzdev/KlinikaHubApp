export const getSpecialty = (appointment) => {
  let specialties = appointment.doctor_specialties;

  // Check if it's a string that looks like an array
  if (typeof specialties === "string" && specialties.startsWith("[")) {
    try {
      specialties = JSON.parse(specialties);
    } catch (error) {
      console.error("Error parsing specialties:", error);
    }
  }

  // If it's now an array, join it
  if (Array.isArray(specialties)) {
    return specialties.join(", ");
  }

  // Fallback if it's just a single value or null
  return specialties || "General Medicine";
};

export const getSpecialties = (specialty) => {
  if (!specialty) return "General Medicine";

  console.log("Input specialty:", specialty);

  // Handle the specific broken array case
  if (Array.isArray(specialty)) {
    // Convert the entire array to string and parse it properly
    const combined = specialty.join(",");
    console.log("Combined:", combined);

    try {
      // Try to parse it as JSON first
      const parsed = JSON.parse(combined);
      return Array.isArray(parsed) ? parsed.join(", ") : parsed;
    } catch (error) {
      // If JSON parsing fails, manually clean up
      console.log("JSON parse failed, manual cleanup");

      // Manual cleanup approach
      const cleaned = combined
        .replace(/\[|\]/g, "") // Remove brackets
        .replace(/"/g, "") // Remove quotes
        .split(",") // Split by comma
        .map((s) => s.trim()) // Trim each item
        .filter((s) => s !== ""); // Remove empty strings

      console.log("Manual cleanup result:", cleaned);
      return cleaned.join(", ");
    }
  }

  // Handle string case (JSON string)
  if (typeof specialty === "string") {
    try {
      const parsed = JSON.parse(specialty);
      return Array.isArray(parsed) ? parsed.join(", ") : specialty;
    } catch {
      return specialty;
    }
  }

  return "General Medicine";
};
