// ============================================================
// CONFIGURATION FILE
// ============================================================
// 
// Modify these values to customize the landing page
//
// ============================================================

export const config = {
  // Google Forms Configuration for Beta Signup
  // Form URL for direct submission
  googleFormUrl: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfkU9vmFi2rVsd-t2RIWJzqpFp5YE0_vFOfSZdKspZ09U0b-w/formResponse",
  
  // Google Form Entry IDs (extracted from form HTML)
  googleFormEntries: {
    name: "entry.2005620554",      // Nombre (required in form)
    email: "entry.1045781291",     // Correo electrónico (required)
    city: "entry.1065046570",      // Ciudad (optional)
  },

  // Google Forms Survey URL (original survey)
  surveyUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeQFsCSq0LHRU47WYyAxKZjKn6UHFWJ8_cXQNDjMMa7bYhRKw/viewform?usp=dialog",

  // Social Links (optional)
  social: {
    instagram: "",
    twitter: "",
    linkedin: "",
  }, 

  // Contact Email
  contactEmail: "hola@chessevents.com",
};
