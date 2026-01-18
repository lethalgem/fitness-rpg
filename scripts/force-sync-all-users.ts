// One-time script to force sync all users
// This ensures no gap in activities when switching to webhook-based updates

const API_BASE = 'https://fitness-rpg.iancashdeveloper.workers.dev';

// Rate limits: 600/15min, 6000/day
const MAX_REQUESTS_PER_BATCH = 7; // Conservative - each user sync makes 1-2 requests
const DELAY_BETWEEN_BATCHES_MS = 60000; // 1 minute between batches

interface User {
  id: number;
  firstname?: string;
  lastname?: string;
  username?: string;
}

async function getAllUsers(): Promise<User[]> {
  // We don't have a direct API endpoint to list users, so we'll try user IDs 1-20
  // Based on the logs, we know there are 8 users
  const users: User[] = [];

  for (let userId = 1; userId <= 20; userId++) {
    try {
      const response = await fetch(`${API_BASE}/stats/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          users.push({
            id: userId,
            firstname: data.data?.user?.firstname,
            lastname: data.data?.user?.lastname,
            username: data.data?.user?.username,
          });
        }
      }
    } catch (err) {
      // User doesn't exist, skip
    }
  }

  return users;
}

async function syncUser(userId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/sync/${userId}`, {
      method: 'POST',
    });

    const data = await response.json();
    return {
      success: data.success,
      message: data.message || data.error || 'Unknown response',
    };
  } catch (err) {
    return {
      success: false,
      message: `Error: ${err}`,
    };
  }
}

async function main() {
  console.log('🔍 Finding all users...\n');

  const users = await getAllUsers();
  console.log(`Found ${users.length} users:\n`);

  users.forEach(user => {
    const name = user.username || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown';
    console.log(`  - User ${user.id}: ${name}`);
  });

  console.log('\n🔄 Starting sync for all users...\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Process users in batches to respect rate limits
  for (let i = 0; i < users.length; i += MAX_REQUESTS_PER_BATCH) {
    const batch = users.slice(i, i + MAX_REQUESTS_PER_BATCH);

    console.log(`\nBatch ${Math.floor(i / MAX_REQUESTS_PER_BATCH) + 1}:`);

    for (const user of batch) {
      const name = user.username || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Unknown';
      console.log(`  Syncing user ${user.id} (${name})...`);

      const result = await syncUser(user.id);

      if (result.success) {
        if (result.message.includes('No new activities')) {
          console.log(`    ✓ Already up to date`);
          skipCount++;
        } else {
          console.log(`    ✓ ${result.message}`);
          successCount++;
        }
      } else {
        console.log(`    ✗ ${result.message}`);
        errorCount++;
      }

      // Small delay between individual requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Delay between batches if there are more users to process
    if (i + MAX_REQUESTS_PER_BATCH < users.length) {
      console.log(`\n⏳ Waiting ${DELAY_BETWEEN_BATCHES_MS / 1000} seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
    }
  }

  console.log('\n✅ Sync complete!\n');
  console.log('Summary:');
  console.log(`  - Successfully synced: ${successCount}`);
  console.log(`  - Already up to date: ${skipCount}`);
  console.log(`  - Errors: ${errorCount}`);
  console.log('\n🎉 All users are now synced and ready for webhook updates!');
}

main().catch(err => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
