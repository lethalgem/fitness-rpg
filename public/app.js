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

    // Update user info
    updateUserInfo(user);

    // Update level progress
    updateLevelProgress(level_progress);

    // Update import status
    updateImportStatus(import_status);

    // Update stats
    updateStats(stats);

    // Update radar chart
    updateRadarChart(stats);

    // Update sport breakdown
    updateSportBreakdown(sport_breakdown);

    // Load recent activities
    loadRecentActivities(userId);

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
  if (syncBtn) {
    syncBtn.onclick = async () => {
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
            }, 2000);
          } else {
            // Refresh dashboard to show new import status
            loadDashboard(userId);
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
    const miles = (sport.total_distance / 1000 * 0.621371).toFixed(1);

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
      const miles = ((activity.distance || 0) / 1000 * 0.621371).toFixed(1);

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
