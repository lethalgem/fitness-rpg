// Frontend JavaScript for Fitness RPG

let statsChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  if (userId) {
    // Store user ID in localStorage
    localStorage.setItem('userId', userId);
    // Remove from URL
    window.history.replaceState({}, document.title, '/');
    // Load dashboard
    loadDashboard(userId);
  } else {
    // Check if we have a stored user ID
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      loadDashboard(storedUserId);
    } else {
      showWelcomeScreen();
    }
  }
});

function showWelcomeScreen() {
  document.getElementById('welcomeScreen').style.display = 'flex';
  document.getElementById('dashboardScreen').style.display = 'none';
}

function showDashboard() {
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('dashboardScreen').style.display = 'block';
}

async function loadDashboard(userId) {
  try {
    showDashboard();

    // Auto-sync: Check if enough time has passed since last sync (5 minutes)
    const lastSyncTime = parseInt(localStorage.getItem('last_sync_time') || '0');
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;

    if (now - lastSyncTime > fiveMinutes) {
      // Trigger background sync (don't wait for it)
      fetch(`/sync/${userId}`, { method: 'POST' })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('last_sync_time', now.toString());
            console.log('Auto-sync triggered');
          }
        })
        .catch(err => console.log('Auto-sync skipped:', err.message));
    }

    // Fetch user stats
    const response = await fetch(`/stats/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    const { user, stats, level_progress, sport_breakdown, import_status } = data.data;

    // Update import status
    updateImportStatus(import_status);

    // Render Chao Garden stats dashboard (handles user info and level progress)
    if (typeof window.renderChaoStats === 'function') {
      window.renderChaoStats(userId);
    }

    // If import is in progress, poll for updates
    if (import_status && (import_status.status === 'pending' || import_status.status === 'in_progress')) {
      setTimeout(() => loadDashboard(userId), 5000); // Poll every 5 seconds
    }

  } catch (err) {
    console.error('Failed to load dashboard', err);
    alert('Failed to load your stats. Please try reconnecting with Strava.');
    localStorage.removeItem('userId');
    showWelcomeScreen();
  }
}

function updateUserInfo(user) {
  const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.username || 'Athlete';
  document.getElementById('userName').textContent = fullName;
  document.getElementById('userLevel').textContent = '?';

  if (user.profile_url) {
    const avatar = document.getElementById('userAvatar');
    avatar.src = user.profile_url;
    avatar.style.display = 'block';
    document.getElementById('userAvatarPlaceholder').style.display = 'none';
  }

  // Set up refresh button
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        loadDashboard(userId);
      }
    };
  }

  // Set up sync button
  const syncBtn = document.getElementById('syncBtn');
  console.log('Sync button found:', syncBtn);
  if (syncBtn) {
    console.log('Attaching sync button click handler');
    syncBtn.onclick = async () => {
      console.log('Sync button clicked!');
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      syncBtn.disabled = true;
      syncBtn.textContent = '⏳ Syncing...';

      try {
        const response = await fetch(`/sync/${userId}`, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
          // Update last sync time to prevent auto-sync for next 5 minutes
          const now = Math.floor(Date.now() / 1000);
          localStorage.setItem('last_sync_time', now.toString());

          if (data.job === null) {
            // No new activities
            syncBtn.textContent = '✓ Up to date';
            setTimeout(() => {
              syncBtn.textContent = '🔄 Sync';
              // Refresh Chao stats anyway in case there were updates
              if (typeof window.renderChaoStats === 'function') {
                window.renderChaoStats(userId);
              }
            }, 2000);
          } else {
            // Sync started, wait a moment for initial activities to import
            syncBtn.textContent = '⏳ Importing...';
            setTimeout(() => {
              // Refresh dashboard to show new activities and start polling
              loadDashboard(userId);
            }, 3000); // Wait 3 seconds for some activities to be imported
          }
        } else {
          alert(data.error || 'Failed to start sync');
        }
      } catch (err) {
        console.error('Sync failed', err);
        alert('Failed to start sync');
      } finally {
        syncBtn.disabled = false;
        if (syncBtn.textContent === '⏳ Syncing...') {
          syncBtn.textContent = '🔄 Sync';
        }
      }
    };
  }
}

function updateLevelProgress(progress) {
  document.getElementById('currentLevel').textContent = progress.current_level;
  document.getElementById('userLevel').textContent = progress.current_level;
  document.getElementById('xpProgress').textContent = progress.xp_progress.toLocaleString();
  document.getElementById('xpNeeded').textContent = progress.xp_needed.toLocaleString();

  const percentage = Math.min(progress.percentage, 100);
  document.getElementById('progressFill').style.width = `${percentage}%`;
}

function updateImportStatus(status) {
  const importStatusEl = document.getElementById('importStatus');
  const dismissBtn = document.getElementById('dismissImport');

  if (!status) {
    importStatusEl.style.display = 'none';
    return;
  }

  // Check if this job was already dismissed (server-side tracking)
  if (status.dismissed) {
    importStatusEl.style.display = 'none';
    return;
  }

  if (status.status === 'completed') {
    // Show completion message with dismiss button
    importStatusEl.style.display = 'block';
    importStatusEl.className = 'import-status completed';
    document.getElementById('importStatusText').textContent = '✅ Import complete!';
    document.getElementById('importProgress').textContent =
      `${status.imported.toLocaleString()} activities`;

    // Show dismiss button, hide progress bar
    dismissBtn.style.display = 'block';
    const progressBar = importStatusEl.querySelector('.progress-bar');
    if (progressBar) progressBar.style.display = 'none';

    // Set up dismiss handler
    dismissBtn.onclick = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const response = await fetch(`/dismiss-job/${userId}/${status.job_id}`, { method: 'POST' });
        const data = await response.json();

        if (data.success) {
          importStatusEl.style.display = 'none';
        }
      } catch (err) {
        console.error('Failed to dismiss job', err);
        // Still hide it locally even if server request fails
        importStatusEl.style.display = 'none';
      }
    };

    return;
  }

  // Still importing
  importStatusEl.style.display = 'block';
  importStatusEl.className = 'import-status';
  document.getElementById('importStatusText').textContent = '⏳ Importing activities...';

  // Show activity count without fake percentage
  const importedCount = status.imported.toLocaleString();
  document.getElementById('importProgress').textContent = `${importedCount} activities imported so far`;

  // Hide dismiss button, show progress bar
  dismissBtn.style.display = 'none';
  const progressBar = importStatusEl.querySelector('.progress-bar');
  if (progressBar) progressBar.style.display = 'block';

  // Don't set width - let CSS animation handle it
}

function updateStats(stats) {
  document.getElementById('strengthValue').textContent = stats.strength_level || 0;
  document.getElementById('enduranceValue').textContent = stats.endurance_level || 0;
  document.getElementById('agilityValue').textContent = stats.agility_level || 0;
  document.getElementById('totalXpValue').textContent = stats.total_xp.toLocaleString();
  document.getElementById('activitiesValue').textContent = stats.activities_count.toLocaleString();
}

function updateRadarChart(stats) {
  try {
    const canvas = document.getElementById('statsChart');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (statsChart) {
      statsChart.destroy();
      statsChart = null;
    }

    const strengthLevel = stats.strength_level || 0;
    const enduranceLevel = stats.endurance_level || 0;
    const agilityLevel = stats.agility_level || 0;
    const maxLevel = Math.max(strengthLevel, enduranceLevel, agilityLevel, 10); // Min 10 for scale

    console.log('Creating radar chart:', { strengthLevel, enduranceLevel, agilityLevel, maxLevel });

    statsChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Strength', 'Endurance', 'Agility'],
        datasets: [{
          label: 'Level',
          data: [strengthLevel, enduranceLevel, agilityLevel],
          fill: true,
          backgroundColor: 'rgba(102, 126, 234, 0.3)',
          borderColor: 'rgb(102, 126, 234)',
          pointBackgroundColor: 'rgb(102, 126, 234)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(102, 126, 234)',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        scales: {
          r: {
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: Math.ceil(maxLevel * 1.2), // 20% padding above max
            ticks: {
              stepSize: Math.max(1, Math.ceil(maxLevel / 5)),
              backdropColor: 'rgba(255, 255, 255, 0.75)',
              color: '#666',
              font: {
                size: 12
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            pointLabels: {
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#333',
              padding: 15,
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'Level ' + context.parsed.r;
              }
            }
          }
        },
      },
    });

    console.log('Radar chart created successfully');
  } catch (error) {
    console.error('Error creating radar chart:', error);
  }
}

function updateSportBreakdown(breakdown) {
  const sportList = document.getElementById('sportList');

  if (!breakdown || breakdown.length === 0) {
    sportList.innerHTML = '<p class="no-data">No activities yet!</p>';
    return;
  }

  // Show top 10 sports
  const topSports = breakdown.slice(0, 10);

  sportList.innerHTML = topSports.map(sport => {
    const hours = (sport.total_time / 60).toFixed(1);
    const miles = (sport.total_distance / 1609.34).toFixed(1);

    // Calculate which stat this activity contributes to most
    const strengthPercent = (sport.strength_xp / sport.total_xp * 100).toFixed(0);
    const endurancePercent = (sport.endurance_xp / sport.total_xp * 100).toFixed(0);

    let statBadge = '';
    if (strengthPercent > 60) {
      statBadge = '<span class="stat-badge strength">💪 Strength</span>';
    } else if (endurancePercent > 60) {
      statBadge = '<span class="stat-badge endurance">🏃 Endurance</span>';
    } else {
      statBadge = '<span class="stat-badge balanced">⚖️ Balanced</span>';
    }

    return `
      <div class="sport-item">
        <div class="sport-name">${formatSportName(sport.sport_type)}</div>
        <div class="sport-stats">
          <span>${sport.count} activities</span>
          <span>${hours} hrs</span>
          <span>${miles} mi</span>
          ${statBadge}
          <span class="sport-xp">${Math.round(sport.total_xp).toLocaleString()} XP</span>
        </div>
      </div>
    `;
  }).join('');
}

function formatSportName(sportType) {
  // Convert "WeightTraining" to "Weight Training"
  return sportType.replace(/([A-Z])/g, ' $1').trim();
}

async function loadRecentActivities(userId, limit = 10) {
  const activityList = document.getElementById('activityList');

  try {
    const response = await fetch(`/stats/${userId}/activities?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    const activities = data.data.activities;

    if (!activities || activities.length === 0) {
      activityList.innerHTML = '<p class="no-data">No activities yet!</p>';
      return;
    }

    activityList.innerHTML = activities.map(activity => {
      const date = new Date(activity.start_date_local || activity.start_date);
      const timeAgo = getTimeAgo(date);
      const hours = ((activity.moving_time || activity.elapsed_time || 0) / 3600).toFixed(1);
      const miles = ((activity.distance || 0) / 1609.34).toFixed(1);

      // Get intensity indicator
      let intensityBadge = '';
      if (activity.xp.intensity_source === 'heartrate') {
        intensityBadge = `<span class="intensity-badge hr" title="Heart rate based">💓 ${activity.xp.intensity_multiplier.toFixed(1)}x</span>`;
      } else if (activity.xp.intensity_source === 'watts') {
        intensityBadge = `<span class="intensity-badge watts" title="Power based">⚡ ${activity.xp.intensity_multiplier.toFixed(1)}x</span>`;
      } else if (activity.xp.intensity_source === 'pace') {
        intensityBadge = `<span class="intensity-badge pace" title="Pace based">🏃 ${activity.xp.intensity_multiplier.toFixed(1)}x</span>`;
      }

      return `
        <div class="activity-item">
          <div class="activity-header">
            <div class="activity-title">
              <span class="activity-name">${activity.name || 'Activity'}</span>
              <span class="activity-date">${timeAgo}</span>
            </div>
            <div class="activity-sport">${formatSportName(activity.sport_type)}</div>
          </div>
          <div class="activity-stats">
            <span>${hours} hrs</span>
            <span>${miles} mi</span>
            ${intensityBadge}
          </div>
          <div class="activity-xp">
            <div class="xp-total">
              <span class="xp-label">Total XP:</span>
              <span class="xp-value">${activity.xp.total.toLocaleString()}</span>
            </div>
            <div class="xp-breakdown">
              <span class="xp-strength">💪 ${activity.xp.strength.toLocaleString()}</span>
              <span class="xp-endurance">🏃 ${activity.xp.endurance.toLocaleString()}</span>
              <span class="xp-agility">⚡ ${activity.xp.agility.toLocaleString()}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Failed to load recent activities', err);
    activityList.innerHTML = '<p class="no-data">Failed to load activities</p>';
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 30) {
    return date.toLocaleDateString();
  } else if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

// ===== Friends Feature =====

let currentUserStats = null;
let compareChart = null;

// Tab switching
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
});

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });

  if (tabName === 'stats') {
    document.getElementById('statsTab').classList.add('active');
    // Refresh Chao stats when switching to stats tab
    const userId = localStorage.getItem('userId');
    if (userId && typeof window.renderChaoStats === 'function') {
      window.renderChaoStats(userId);
    }
  } else if (tabName === 'friends') {
    document.getElementById('friendsTab').classList.add('active');
    loadFriendsTab();
  } else if (tabName === 'leaderboards') {
    document.getElementById('leaderboardsTab').classList.add('active');
    loadLeaderboardsTab();
  }
}

async function loadFriendsTab() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  await Promise.all([
    loadFriends(userId),
    loadFriendRequests(userId)
  ]);

  // Set up search
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('friendSearchInput');

  searchBtn.onclick = () => searchUsers(searchInput.value);
  searchInput.onkeypress = (e) => {
    if (e.key === 'Enter') searchUsers(searchInput.value);
  };
}

async function loadFriends(userId) {
  const friendsList = document.getElementById('friendsList');

  try {
    const response = await fetch(`/friends/${userId}`);
    const data = await response.json();

    if (!data.success || !data.data.friends || data.data.friends.length === 0) {
      friendsList.innerHTML = '<p class="no-data">No friends yet. Search for users to add!</p>';
      return;
    }

    friendsList.innerHTML = data.data.friends.map(friend => {
      const fullName = [friend.firstname, friend.lastname].filter(Boolean).join(' ') || friend.username || 'Athlete';

      return `
        <div class="friend-card" onclick="compareFriend(${friend.id})">
          <img src="${friend.profile_url || ''}" class="friend-avatar" alt="${fullName}">
          <div class="friend-name">${fullName}</div>
          <div class="friend-level">Level ${friend.stats.level}</div>
          <div class="friend-stats">
            <div class="friend-stat">
              <div class="friend-stat-label">💪 STR</div>
              <div class="friend-stat-value">${friend.stats.strength_level}</div>
            </div>
            <div class="friend-stat">
              <div class="friend-stat-label">🏃 END</div>
              <div class="friend-stat-value">${friend.stats.endurance_level}</div>
            </div>
            <div class="friend-stat">
              <div class="friend-stat-label">⚡ AGI</div>
              <div class="friend-stat-value">${friend.stats.agility_level}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Failed to load friends', err);
    friendsList.innerHTML = '<p class="no-data">Failed to load friends</p>';
  }
}

async function loadFriendRequests(userId) {
  try {
    const response = await fetch(`/friends/${userId}/requests`);
    const data = await response.json();

    const requestsCard = document.getElementById('friendRequestsCard');
    const requestsList = document.getElementById('friendRequestsList');

    if (!data.success || !data.data.requests || data.data.requests.length === 0) {
      requestsCard.style.display = 'none';
      return;
    }

    requestsCard.style.display = 'block';
    requestsList.innerHTML = data.data.requests.map(request => {
      const fullName = [request.requester.firstname, request.requester.lastname].filter(Boolean).join(' ')
        || request.requester.username || 'Athlete';

      return `
        <div class="friend-request-item">
          <div class="friend-request-info">
            <img src="${request.requester.profile_url || ''}" class="search-result-avatar" alt="${fullName}">
            <div>
              <div class="search-result-name">${fullName}</div>
              <div class="search-result-username">@${request.requester.username || 'athlete'}</div>
            </div>
          </div>
          <div class="friend-request-actions">
            <button class="btn btn-primary" onclick="acceptFriendRequest(${request.requester.id})">Accept</button>
            <button class="btn btn-secondary" onclick="declineFriendRequest(${request.requester.id})">Decline</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Failed to load friend requests', err);
  }
}

async function searchUsers(query) {
  if (!query || query.length < 2) {
    alert('Please enter at least 2 characters');
    return;
  }

  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = '<p class="loading">Searching...</p>';

  try {
    const response = await fetch(`/friends/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (!data.success || !data.data.users || data.data.users.length === 0) {
      searchResults.innerHTML = '<p class="no-data">No users found</p>';
      return;
    }

    const currentUserId = parseInt(localStorage.getItem('userId'));

    searchResults.innerHTML = data.data.users
      .filter(user => user.id !== currentUserId)
      .map(user => {
        const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.username || 'Athlete';

        return `
          <div class="search-result-item">
            <div class="search-result-info">
              <img src="${user.profile_url || ''}" class="search-result-avatar" alt="${fullName}">
              <div>
                <div class="search-result-name">${fullName}</div>
                <div class="search-result-username">@${user.username || 'athlete'}</div>
              </div>
            </div>
            <button class="btn btn-primary" onclick="sendFriendRequest(${user.id})">Add Friend</button>
          </div>
        `;
      }).join('');
  } catch (err) {
    console.error('Failed to search users', err);
    searchResults.innerHTML = '<p class="no-data">Search failed</p>';
  }
}

async function sendFriendRequest(friendId) {
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/friends/${userId}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendId })
    });

    const data = await response.json();

    if (data.success) {
      alert('Friend request sent!');
      document.getElementById('friendSearchInput').value = '';
      document.getElementById('searchResults').innerHTML = '';
    } else {
      alert(data.error || 'Failed to send friend request');
    }
  } catch (err) {
    console.error('Failed to send friend request', err);
    alert('Failed to send friend request');
  }
}

async function acceptFriendRequest(friendId) {
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/friends/${userId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendId })
    });

    const data = await response.json();

    if (data.success) {
      loadFriendsTab(); // Reload both lists
    } else {
      alert(data.error || 'Failed to accept friend request');
    }
  } catch (err) {
    console.error('Failed to accept friend request', err);
    alert('Failed to accept friend request');
  }
}

async function declineFriendRequest(friendId) {
  const userId = localStorage.getItem('userId');

  try {
    const response = await fetch(`/friends/${userId}/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ friendId })
    });

    const data = await response.json();

    if (data.success) {
      loadFriendRequests(userId); // Reload requests list
    } else {
      alert(data.error || 'Failed to decline friend request');
    }
  } catch (err) {
    console.error('Failed to decline friend request', err);
    alert('Failed to decline friend request');
  }
}

async function compareFriend(friendId) {
  const userId = localStorage.getItem('userId');

  try {
    // Fetch both user's stats and friend's stats
    const [userResponse, friendsResponse] = await Promise.all([
      fetch(`/stats/${userId}`),
      fetch(`/friends/${userId}`)
    ]);

    const userData = await userResponse.json();
    const friendsData = await friendsResponse.json();

    if (!userData.success || !friendsData.success) {
      alert('Failed to load comparison data');
      return;
    }

    const userStats = userData.data.stats;
    const friend = friendsData.data.friends.find(f => f.id === friendId);

    if (!friend) {
      alert('Friend not found');
      return;
    }

    showComparisonModal(userData.data.user, userStats, friend, friend.stats);
  } catch (err) {
    console.error('Failed to compare friend', err);
    alert('Failed to load comparison');
  }
}

function showComparisonModal(user, userStats, friend, friendStats) {
  const modal = document.getElementById('compareModal');

  // Set user info
  const userName = [user.firstname, user.lastname].filter(Boolean).join(' ') || user.username || 'You';
  document.getElementById('compareUser1Avatar').src = user.profile_url || '';
  document.getElementById('compareUser1Name').textContent = userName;
  document.getElementById('compareUser1Level').textContent = `Level ${userStats.level}`;
  document.getElementById('compareTableUser1').textContent = userName;

  // Set friend info
  const friendName = [friend.firstname, friend.lastname].filter(Boolean).join(' ') || friend.username || 'Friend';
  document.getElementById('compareUser2Avatar').src = friend.profile_url || '';
  document.getElementById('compareUser2Name').textContent = friendName;
  document.getElementById('compareUser2Level').textContent = `Level ${friendStats.level}`;
  document.getElementById('compareTableUser2').textContent = friendName;

  // Create comparison chart
  createComparisonChart(userStats, friendStats);

  // Create comparison table
  const tableBody = document.getElementById('compareTableBody');
  const stats = [
    { name: '⭐ Total XP', user: userStats.total_xp, friend: friendStats.total_xp },
    { name: '💪 Strength', user: userStats.strength_level, friend: friendStats.strength_level },
    { name: '🏃 Endurance', user: userStats.endurance_level, friend: friendStats.endurance_level },
    { name: '⚡ Agility', user: userStats.agility_level, friend: friendStats.agility_level },
    { name: '🎯 Activities', user: userStats.activities_count, friend: friendStats.activities_count },
  ];

  tableBody.innerHTML = stats.map(stat => {
    const userHigher = stat.user > stat.friend;
    const friendHigher = stat.friend > stat.user;

    return `
      <tr>
        <td>${stat.name}</td>
        <td class="${userHigher ? 'stat-higher' : friendHigher ? 'stat-lower' : ''}">${stat.user.toLocaleString()}</td>
        <td class="${friendHigher ? 'stat-higher' : userHigher ? 'stat-lower' : ''}">${stat.friend.toLocaleString()}</td>
      </tr>
    `;
  }).join('');

  // Show modal
  modal.style.display = 'flex';

  // Set up close handler
  document.getElementById('closeCompare').onclick = () => {
    modal.style.display = 'none';
    if (compareChart) {
      compareChart.destroy();
      compareChart = null;
    }
  };

  // Close on background click
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      if (compareChart) {
        compareChart.destroy();
        compareChart = null;
      }
    }
  };
}

function createComparisonChart(userStats, friendStats) {
  const canvas = document.getElementById('compareChart');
  const ctx = canvas.getContext('2d');

  // Destroy existing chart
  if (compareChart) {
    compareChart.destroy();
  }

  const maxLevel = Math.max(
    userStats.strength_level, userStats.endurance_level, userStats.agility_level,
    friendStats.strength_level, friendStats.endurance_level, friendStats.agility_level,
    10
  );

  compareChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Strength', 'Endurance', 'Agility'],
      datasets: [
        {
          label: 'You',
          data: [userStats.strength_level, userStats.endurance_level, userStats.agility_level],
          fill: true,
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgb(102, 126, 234)',
          pointBackgroundColor: 'rgb(102, 126, 234)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(102, 126, 234)',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: 'Friend',
          data: [friendStats.strength_level, friendStats.endurance_level, friendStats.agility_level],
          fill: true,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          borderColor: 'rgb(239, 68, 68)',
          pointBackgroundColor: 'rgb(239, 68, 68)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(239, 68, 68)',
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: Math.ceil(maxLevel * 1.2),
          ticks: {
            stepSize: Math.max(1, Math.ceil(maxLevel / 5)),
            backdropColor: 'rgba(255, 255, 255, 0.75)',
            color: '#666',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          pointLabels: {
            font: {
              size: 14,
              weight: 'bold'
            },
            color: '#333',
            padding: 15,
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': Level ' + context.parsed.r;
            }
          }
        }
      },
    },
  });
}

// ====================================
// Leaderboards Tab Functions
// ====================================

let currentLeaderboardType = 'level';
let currentSportType = null;
let currentTimePeriod = 'weekly';

async function loadLeaderboardsTab() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  // Set up period selector
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTimePeriod = btn.dataset.period;
      currentSportType = null;
      document.getElementById('sportFilterCard').style.display = 'none';
      loadLeaderboard(userId, currentLeaderboardType, null, currentTimePeriod);
      updateResetBanner(currentTimePeriod); // Update reset banner when period changes
    };
  });

  // Set up category selector
  const categorySelect = document.getElementById('leaderboardCategory');
  categorySelect.onchange = () => {
    currentLeaderboardType = categorySelect.value;
    currentSportType = null;
    document.getElementById('sportFilterCard').style.display = 'none';
    loadLeaderboard(userId, currentLeaderboardType, null, currentTimePeriod);
  };

  // Set up sport filter button
  const sportFilterBtn = document.getElementById('sportFilterBtn');
  sportFilterBtn.onclick = () => {
    showSportFilter();
  };

  const closeSportFilter = document.getElementById('closeSportFilter');
  closeSportFilter.onclick = () => {
    currentSportType = null;
    document.getElementById('sportFilterCard').style.display = 'none';
    document.getElementById('leaderboardCategory').disabled = false;
    loadLeaderboard(userId, currentLeaderboardType, null, currentTimePeriod);
  };

  // Load initial leaderboard and reset banner
  await loadLeaderboard(userId, currentLeaderboardType, null, currentTimePeriod);
  await updateResetBanner(currentTimePeriod);
}

async function loadLeaderboard(userId, type, sportType = null, timePeriod = 'all_time') {
  const leaderboardList = document.getElementById('leaderboardList');
  const leaderboardTitle = document.getElementById('leaderboardTitle');
  const userRanking = document.getElementById('userRanking');

  try {
    let leaderboardData, userRankData;

    if (sportType) {
      // Load sport-specific leaderboard
      const response = await fetch(`/leaderboard/sport?sport_type=${encodeURIComponent(sportType)}&limit=100`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load leaderboard');
      }

      leaderboardData = data.data.leaderboard;
      leaderboardTitle.textContent = `🏆 ${sportType} Rankings`;

      // Find user's rank in sport leaderboard
      const userEntry = leaderboardData.find(e => e.user_id === parseInt(userId));
      userRankData = userEntry ? {
        rank: userEntry.rank,
        activity_count: userEntry.activity_count,
        total_distance: userEntry.total_distance,
        total_time: userEntry.total_time
      } : null;
    } else {
      // Load overall leaderboard
      const [leaderboardResponse, rankResponse] = await Promise.all([
        fetch(`/leaderboard?type=${type}&limit=100&period=${timePeriod}`),
        fetch(`/leaderboard/me/${userId}?type=${type}&period=${timePeriod}`)
      ]);

      const leaderboardDataRes = await leaderboardResponse.json();
      const rankDataRes = await rankResponse.json();

      if (!leaderboardDataRes.success || !rankDataRes.success) {
        throw new Error('Failed to load leaderboard');
      }

      leaderboardData = leaderboardDataRes.data.leaderboard;
      userRankData = rankDataRes.data;

      // Update title based on type and period
      const titles = {
        level: 'Overall Level',
        strength: '💪 Strength',
        endurance: '🏃 Endurance',
        agility: '⚡ Agility',
        activities: '🎯 Total Activities'
      };
      const periodLabel = timePeriod === 'weekly' ? ' (This Week)' : '';
      leaderboardTitle.textContent = `🏆 ${titles[type] || 'Top Athletes'}${periodLabel}`;
    }

    // Render user ranking
    if (userRankData) {
      if (sportType) {
        userRanking.innerHTML = `
          <div class="rank-display">
            <div class="rank-number">#${userRankData.rank}</div>
            <div class="rank-details">
              <div class="rank-stat">
                <span class="rank-label">Activities:</span>
                <span class="rank-value">${userRankData.activity_count}</span>
              </div>
              <div class="rank-stat">
                <span class="rank-label">Distance:</span>
                <span class="rank-value">${formatDistance(userRankData.total_distance)}</span>
              </div>
              <div class="rank-stat">
                <span class="rank-label">Time:</span>
                <span class="rank-value">${formatTime(userRankData.total_time)}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        // For stat-specific leaderboards, show stat value instead of total XP
        const isStatLeaderboard = ['strength', 'endurance', 'agility'].includes(type);
        const xpValue = isStatLeaderboard ? userRankData.stat_value : userRankData.total_xp;
        const xpLabel = timePeriod === 'weekly' ? 'XP (This Week)' : 'XP';

        // For weekly leaderboards, hide level (it's meaningless for short periods)
        const levelStat = timePeriod === 'weekly' ? '' : `
          <div class="rank-stat">
            <span class="rank-label">Level:</span>
            <span class="rank-value">${userRankData.level}</span>
          </div>
        `;

        userRanking.innerHTML = `
          <div class="rank-display">
            <div class="rank-number">#${userRankData.rank}</div>
            <div class="rank-details">
              ${levelStat}
              <div class="rank-stat">
                <span class="rank-label">${xpLabel}:</span>
                <span class="rank-value">${Math.round(xpValue).toLocaleString()}</span>
              </div>
              <div class="rank-stat">
                <span class="rank-label">Activities:</span>
                <span class="rank-value">${userRankData.activities_count}</span>
              </div>
            </div>
          </div>
        `;
      }
    } else {
      userRanking.innerHTML = '<p class="no-data">You haven\'t done any activities of this type yet.</p>';
    }

    // Render leaderboard entries
    if (leaderboardData.length === 0) {
      leaderboardList.innerHTML = '<p class="no-data">No data available</p>';
      return;
    }

    leaderboardList.innerHTML = leaderboardData.map((entry, index) => {
      const isCurrentUser = entry.user_id === parseInt(userId);
      const rankBadge = getRankBadge(entry.rank);
      const displayName = entry.name || 'Unknown User';

      if (sportType) {
        return `
          <div class="leaderboard-entry ${isCurrentUser ? 'current-user' : ''}">
            <div class="entry-rank">${rankBadge}</div>
            <div class="entry-avatar">
              ${entry.profile_url ?
                `<img src="${entry.profile_url}" alt="${displayName}">` :
                '<div class="avatar-placeholder">👤</div>'}
            </div>
            <div class="entry-info">
              <div class="entry-name">${displayName}</div>
              <div class="entry-stats">
                ${entry.activity_count} activities · ${formatDistance(entry.total_distance)}
              </div>
            </div>
          </div>
        `;
      } else if (timePeriod === 'weekly') {
        // Weekly leaderboard format - simple and clean
        // For stat-specific leaderboards, show the stat value instead of total XP
        const isStatLeaderboard = ['strength', 'endurance', 'agility'].includes(type);
        const xpValue = isStatLeaderboard ? entry.stat_value : entry.total_xp;

        return `
          <div class="leaderboard-entry ${isCurrentUser ? 'current-user' : ''}">
            <div class="entry-rank">${rankBadge}</div>
            <div class="entry-avatar">
              ${entry.profile_url ?
                `<img src="${entry.profile_url}" alt="${displayName}">` :
                '<div class="avatar-placeholder">👤</div>'}
            </div>
            <div class="entry-info">
              <div class="entry-name">${displayName}</div>
              <div class="entry-stats">
                ${Math.round(xpValue).toLocaleString()} XP this week · ${entry.activities_count} activities
              </div>
            </div>
          </div>
        `;
      } else {
        // All-time leaderboard format
        return `
          <div class="leaderboard-entry ${isCurrentUser ? 'current-user' : ''}">
            <div class="entry-rank">${rankBadge}</div>
            <div class="entry-avatar">
              ${entry.profile_url ?
                `<img src="${entry.profile_url}" alt="${displayName}">` :
                '<div class="avatar-placeholder">👤</div>'}
            </div>
            <div class="entry-info">
              <div class="entry-name">${displayName}</div>
              <div class="entry-stats">
                Level ${entry.level} · ${entry.total_xp.toLocaleString()} XP · ${entry.activities_count} activities
              </div>
            </div>
            <div class="entry-level">Lvl ${entry.level}</div>
          </div>
        `;
      }
    }).join('');

  } catch (err) {
    console.error('Failed to load leaderboard', err);
    leaderboardList.innerHTML = '<p class="error">Failed to load leaderboard. Please try again.</p>';
    userRanking.innerHTML = '<p class="error">Failed to load your ranking.</p>';
  }
}

async function showSportFilter() {
  const sportFilterCard = document.getElementById('sportFilterCard');
  const sportButtons = document.getElementById('sportButtons');
  const userId = localStorage.getItem('userId');

  sportFilterCard.style.display = 'block';
  document.getElementById('leaderboardCategory').disabled = true;

  try {
    const response = await fetch('/leaderboard/sports?min_activities=5');
    const data = await response.json();

    if (!data.success || !data.data.sports) {
      throw new Error('Failed to load sports');
    }

    const sports = data.data.sports;

    sportButtons.innerHTML = sports.map(sport => `
      <button class="sport-btn" data-sport="${sport.sport_type}">
        ${sport.sport_type}
        <span class="sport-count">(${sport.total_count})</span>
      </button>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.sport-btn').forEach(btn => {
      btn.onclick = () => {
        currentSportType = btn.dataset.sport;
        loadLeaderboard(userId, null, currentSportType, currentTimePeriod);
      };
    });

  } catch (err) {
    console.error('Failed to load sports', err);
    sportButtons.innerHTML = '<p class="error">Failed to load sports.</p>';
  }
}

function getRankBadge(rank) {
  const badges = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };
  return badges[rank] || `#${rank}`;
}

function formatDistance(meters) {
  if (!meters) return '0 mi';
  const miles = meters / 1609.34; // 1 mile = 1609.34 meters
  return miles.toFixed(1) + ' mi';
}

function formatTime(seconds) {
  if (!seconds) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Update the weekly reset banner
async function updateResetBanner(timePeriod) {
  const resetBanner = document.getElementById('weeklyResetBanner');

  if (timePeriod !== 'weekly') {
    resetBanner.style.display = 'none';
    return;
  }

  try {
    const response = await fetch('/leaderboard/reset-info');
    const data = await response.json();

    if (data.success) {
      const timeUntilReset = data.data.time_until_reset;
      const nextResetDate = new Date(data.data.next_reset_iso);

      // Format local time for user
      const localResetTime = nextResetDate.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      });

      resetBanner.style.display = 'block';
      resetBanner.innerHTML = `
        <div class="reset-banner">
          <span class="reset-icon">⏰</span>
          <div class="reset-text">
            <div class="reset-title">Weekly Leaderboard Resets Every Monday</div>
            <div class="reset-countdown">Next reset: ${timeUntilReset} (${localResetTime})</div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error('Failed to fetch reset info', err);
    resetBanner.style.display = 'none';
  }
}
