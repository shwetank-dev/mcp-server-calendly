import { CalendlyClient } from './src/client';
const CALENDLY_API_KEY = process.env.CALENDLY_API_KEY!;

const client = new CalendlyClient(CALENDLY_API_KEY);

async function main() {
  const currentUser = await client.getCurrentUser();

  const eventTypes = await client.listEventTypes(currentUser.uri);

  console.log(eventTypes);
}

main();
