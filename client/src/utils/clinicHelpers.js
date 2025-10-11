// Category icons mapping
export const getCategoryIcon = (category) => {
  const iconMap = {
    All: "grid",
    General: "home",
    Dental: "activity",
    Medical: "heart",
    Surgical: "scissors",
    Pediatric: "smile",
    Orthopedic: "bone",
    Cardiology: "heart",
    Neurology: "brain",
    Emergency: "alert-triangle",
    Dermatology: "skin",
    Ophthalmology: "eye",
    Psychiatry: "headphones",
    Radiology: "aperture",
    Oncology: "activity",
    Urology: "droplet",
    Gynecology: "circle",
    Endocrinology: "thermometer",
  };
  return iconMap[category] || "folder";
};

// Count clinics by category
export const getCategoryCount = (category, clinicsData) => {
  if (category === "All") return clinicsData.length;

  return clinicsData.filter((clinic) => {
    if (clinic.primary_category === category) return true;
    if (clinic.categories) {
      try {
        const parsedCategories = JSON.parse(clinic.categories);
        return (
          Array.isArray(parsedCategories) && parsedCategories.includes(category)
        );
      } catch (e) {
        return false;
      }
    }
    return false;
  }).length;
};

// Extract and sort categories
export const extractCategories = (clinicsData) => {
  const defaultCategories = [
    "All",
    "General",
    "Dental",
    "Medical",
    "Surgical",
    "Pediatric",
    "Orthopedic",
    "Cardiology",
    "Neurology",
    "Emergency",
    "Dermatology",
    "Ophthalmology",
    "Psychiatry",
    "Radiology",
    "Oncology",
    "Urology",
    "Gynecology",
    "Endocrinology",
  ];

  const allCategories = new Set(defaultCategories);

  // Add custom categories from clinic data
  clinicsData.forEach((clinic) => {
    if (
      clinic.primary_category &&
      !defaultCategories.includes(clinic.primary_category)
    ) {
      allCategories.add(clinic.primary_category);
    }

    if (clinic.categories) {
      try {
        const parsedCategories = JSON.parse(clinic.categories);
        if (Array.isArray(parsedCategories)) {
          parsedCategories.forEach((cat) => {
            if (!defaultCategories.includes(cat)) {
              allCategories.add(cat);
            }
          });
        }
      } catch (e) {
        console.log("Error parsing categories:", e);
      }
    }
  });

  return Array.from(allCategories).sort((a, b) => {
    if (a === "All") return -1;
    if (b === "All") return 1;

    const countA = getCategoryCount(a, clinicsData);
    const countB = getCategoryCount(b, clinicsData);

    if (countA > 0 && countB === 0) return -1;
    if (countA === 0 && countB > 0) return 1;

    if (countA > 0 && countB > 0) {
      return countB - countA;
    }

    return a.localeCompare(b);
  });
};

// Filter clinics by category
export const filterClinicsByCategory = (clinics, selectedCategory) => {
  if (selectedCategory === "All") return clinics;

  return clinics.filter((clinic) => {
    if (clinic.primary_category === selectedCategory) return true;

    if (clinic.categories) {
      try {
        const parsedCategories = JSON.parse(clinic.categories);
        return (
          Array.isArray(parsedCategories) &&
          parsedCategories.includes(selectedCategory)
        );
      } catch (e) {
        return false;
      }
    }

    return false;
  });
};

// Search filter function
export const filterClinicsBySearch = (clinics, searchQuery) => {
  if (!searchQuery.trim()) return clinics;

  const lowercaseQuery = searchQuery.toLowerCase().trim();

  return clinics.filter((clinic) => {
    const searchableFields = [
      clinic.institute_name,
      clinic.primary_category,
      clinic.address,
      clinic.mobileno,
      clinic.working_hours,
    ].filter(Boolean);

    return searchableFields.some((field) =>
      field.toLowerCase().includes(lowercaseQuery)
    );
  });
};

// Combined filter function (category + search)
export const filterClinics = (clinics, selectedCategory, searchQuery) => {
  let filtered = clinics;

  // First apply category filter
  if (selectedCategory !== "All") {
    filtered = filterClinicsByCategory(filtered, selectedCategory);
  }

  // Then apply search filter
  if (searchQuery.trim()) {
    filtered = filterClinicsBySearch(filtered, searchQuery);
  }

  return filtered;
};
