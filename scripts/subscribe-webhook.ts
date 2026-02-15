// Script to subscribe to Strava webhooks
// Run once after deployment: npx tsx scripts/subscribe-webhook.ts

const STRAVA_CLIENT_ID = '119309';
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const CALLBACK_URL = 'https://fitness-rpg.iancash.me/webhooks/strava';
const VERIFY_TOKEN = 'fitness_rpg_webhook_2026';

async function subscribe() {
  if (!STRAVA_CLIENT_SECRET) {
    console.error('Error: STRAVA_CLIENT_SECRET environment variable is not set');
    console.error('Please set it by running: export STRAVA_CLIENT_SECRET=your_secret_here');
    process.exit(1);
  }

  console.log('Subscribing to Strava webhooks...');
  console.log('Callback URL:', CALLBACK_URL);
  console.log('Verify Token:', VERIFY_TOKEN);

  const response = await fetch('https://www.strava.com/api/v3/push_subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      callback_url: CALLBACK_URL,
      verify_token: VERIFY_TOKEN,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Subscription failed:', error);
    throw new Error(`Failed to subscribe: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('\n✅ Successfully subscribed to Strava webhooks!');
  console.log('Subscription ID:', result.id);
  console.log('Callback URL:', result.callback_url);
  console.log('\nYou can now test the webhook by creating activities on Strava.');

  return result;
}

async function listSubscriptions() {
  if (!STRAVA_CLIENT_SECRET) {
    console.error('Error: STRAVA_CLIENT_SECRET environment variable is not set');
    process.exit(1);
  }

  console.log('Listing current subscriptions...\n');

  const response = await fetch(
    `https://www.strava.com/api/v3/push_subscriptions?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}`
  );

  if (!response.ok) {
    throw new Error(`Failed to list subscriptions: ${response.statusText}`);
  }

  const subscriptions = await response.json();

  if (subscriptions.length === 0) {
    console.log('No active subscriptions found.');
  } else {
    console.log('Current subscriptions:');
    subscriptions.forEach((sub: any) => {
      console.log(`  - ID: ${sub.id}, Callback: ${sub.callback_url}`);
    });
  }

  return subscriptions;
}

async function unsubscribe(subscriptionId: number) {
  if (!STRAVA_CLIENT_SECRET) {
    console.error('Error: STRAVA_CLIENT_SECRET environment variable is not set');
    process.exit(1);
  }

  console.log(`Unsubscribing from subscription ID ${subscriptionId}...`);

  const response = await fetch(
    `https://www.strava.com/api/v3/push_subscriptions/${subscriptionId}?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    throw new Error(`Failed to unsubscribe: ${response.statusText}`);
  }

  console.log('✅ Successfully unsubscribed.');
}

// Main
(async () => {
  try {
    const command = process.argv[2];

    if (command === 'list') {
      await listSubscriptions();
    } else if (command === 'unsubscribe') {
      const subscriptionId = parseInt(process.argv[3]);
      if (!subscriptionId) {
        console.error('Error: Please provide a subscription ID');
        console.error('Usage: npx tsx scripts/subscribe-webhook.ts unsubscribe <subscription_id>');
        process.exit(1);
      }
      await unsubscribe(subscriptionId);
    } else if (command === 'subscribe' || !command) {
      // First list existing subscriptions
      const existing = await listSubscriptions();

      if (existing.length > 0) {
        console.log('\n⚠️  Warning: You already have active subscriptions.');
        console.log('Strava only allows one subscription per app.');
        console.log('If you want to change the callback URL, unsubscribe first using:');
        console.log(`  npx tsx scripts/subscribe-webhook.ts unsubscribe ${existing[0].id}`);
        process.exit(1);
      }

      console.log('\n');
      await subscribe();
    } else {
      console.error('Unknown command:', command);
      console.error('\nUsage:');
      console.error('  npx tsx scripts/subscribe-webhook.ts          # Subscribe to webhooks');
      console.error('  npx tsx scripts/subscribe-webhook.ts list     # List current subscriptions');
      console.error('  npx tsx scripts/subscribe-webhook.ts unsubscribe <id>  # Unsubscribe');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
})();
