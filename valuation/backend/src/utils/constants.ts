export const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    report_summary: {
      type: "string",
      description: "A concise summary of the real estate valuation report.",
    },
    compliance_score: {
      type: "number",
      description: "A score from 0 to 100 indicating the report's compliance with regulations and standards.",
    },
    missing_requirements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          requirement_key: { type: "string" },
          requirement_name: { type: "string" },
          category: { type: "string", enum: ["professional", "regulatory"] },
          details: { type: "string" },
        },
        required: ["requirement_key", "requirement_name", "category", "details"],
      },
      description: "List of missing requirements or non-compliant aspects.",
    },
    key_data_extracted: {
      type: "object",
      description: "Key data points extracted from the report.",
      properties: {
        property_address: { type: "string" },
        valuation_date: { type: "string", format: "date" },
        valuation_method: { type: "string" },
        market_value: { type: "number" },
        property_type: { type: "string" },
        area_sqm: { type: "number" },
        owner_name: { type: "string" },
        appraiser_name: { type: "string" },
        license_number: { type: "string" },
      },
    },
    recommendations: {
      type: "array",
      items: { type: "string" },
      description: "Recommendations for improving report compliance or clarity.",
    },
  },
  required: ["report_summary", "compliance_score", "missing_requirements", "key_data_extracted", "recommendations"],
};

