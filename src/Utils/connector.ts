export const getConnectorName = (connector: string) => {
  const nameMap: { [key: string]: string } = {
    facebook: "Facebook Ads",
    facebook_pages: "Facebook Pages",
    instagram: "Instagram",
    google_ads: "Google Ads",
    google_analytics: "Google Analytics",
    custom_api: "Custom API",
    google_sheets: "Google Sheets",
    shopify: "Shopify",
  };

  return nameMap[connector] || "Unknown Connector";
};
