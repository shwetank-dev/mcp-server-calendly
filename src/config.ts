export function loadConfig() {
  const apiKey = process.env.CALENDLY_API_KEY;
  if (!apiKey) {
    console.error("CALENDLY_API_KEY environment variable is required");
    process.exit(1);
  }
  return { apiKey };
}
