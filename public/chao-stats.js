// Chao Garden Stats Dashboard Logic
(function() {
  'use strict';

  const statIcons = {
    strength: 'P',
    endurance: 'E',
    agility: 'A'
  };

  // Calculate XP for current level (from backend formula)
  function xpForCurrentLevel(level) {
    return Math.pow(level, 2) * 1000;
  }

  // Calculate XP for next level
  function xpForNextLevel(level) {
    return Math.pow(level + 1, 2) * 1000;
  }

  // Get average XP for a stat from recent activities
  function getAverageXPForStat(activities, statType) {
    let total = 0;
    let count = 0;

    activities.forEach(activity => {
      const xp = activity.xp?.[statType] || 0;
      if (xp > 0) {
        total += xp;
        count++;
      }
    });

    return count > 0 ? Math.round(total / count) : 1000;
  }

  // Calculate activities needed to level up
  function calculateActivitiesNeeded(xpNeeded, avgXP) {
    return Math.ceil(xpNeeded / avgXP);
  }

  // Render stat card with segmented progress
  function renderStatCard(statName, statData, activities) {
    const currentLevelXP = xpForCurrentLevel(statData.level);
    const nextLevelXP = xpForNextLevel(statData.level);
    const totalLevelXP = nextLevelXP - currentLevelXP;
    const earnedInLevel = statData.xp - currentLevelXP;
    const xpNeeded = nextLevelXP - statData.xp;

    const avgXP = getAverageXPForStat(activities, statName);
    const activitiesNeeded = calculateActivitiesNeeded(xpNeeded, avgXP);

    // Create segments (5-10 based on activities needed)
    const numSegments = Math.min(Math.max(activitiesNeeded, 5), 10);

    // Calculate segment fill states
    const segments = [];
    for (let i = 0; i < numSegments; i++) {
      const segmentStartXP = (i / numSegments) * totalLevelXP;
      const segmentEndXP = ((i + 1) / numSegments) * totalLevelXP;

      let fillClass = '';
      let fillPercent = 0;

      if (earnedInLevel >= segmentEndXP) {
        fillClass = 'filled';
        fillPercent = 100;
      } else if (earnedInLevel > segmentStartXP) {
        fillClass = 'partial';
        fillPercent = ((earnedInLevel - segmentStartXP) / (segmentEndXP - segmentStartXP)) * 100;
      }

      segments.push({ fillClass, fillPercent });
    }

    const segmentsHTML = segments.map(seg => `
      <div class="chao-progress-segment ${seg.fillClass}">
        ${seg.fillPercent > 0 ? `
          <div class="chao-progress-segment-fill ${statName}" style="transform: scaleX(${seg.fillPercent / 100})"></div>
        ` : ''}
      </div>
    `).join('');

    const remainingSegments = segments.filter(s => s.fillClass !== 'filled').length;

    return `
      <div class="chao-stat-card">
        <div class="chao-stat-label">
          <div class="chao-stat-icon ${statName}">${statIcons[statName]}</div>
          <div class="chao-stat-name">${statName}</div>
        </div>
        <div class="chao-stat-info">
          <div class="chao-stat-level-bar">
            <div class="chao-progress-container">
              ${segmentsHTML}
            </div>
            <div class="chao-stat-level">Lv ${statData.level}</div>
          </div>
          <div class="chao-xp-info">
            ${remainingSegments} ${remainingSegments === 1 ? 'workout' : 'workouts'} to level up • ${statData.xp.toLocaleString()} / ${nextLevelXP.toLocaleString()} XP
          </div>
        </div>
      </div>
    `;
  }

  // Render activities list
  function renderActivities(activities) {
    if (!activities || activities.length === 0) {
      return '<div class="chao-loading">No recent activities</div>';
    }

    return activities.slice(0, 10).map(activity => {
      const distance = activity.distance ? `${(activity.distance / 1000).toFixed(1)} km` : '';
      const time = activity.elapsed_time ? formatTime(activity.elapsed_time) : '';
      const details = [distance, time].filter(Boolean).join(' • ');

      const stats = [];
      if (activity.xp?.strength > 0) stats.push({ type: 'strength', xp: activity.xp.strength });
      if (activity.xp?.endurance > 0) stats.push({ type: 'endurance', xp: activity.xp.endurance });
      if (activity.xp?.agility > 0) stats.push({ type: 'agility', xp: activity.xp.agility });

      const statsHTML = stats.map(stat => `
        <div class="chao-stat-contribution ${stat.type}">
          <span>+${Math.round(stat.xp)} XP</span>
          <div class="chao-stat-icon-small ${stat.type}">${statIcons[stat.type]}</div>
        </div>
      `).join('');

      return `
        <div class="chao-activity-item">
          <div class="chao-activity-content">
            <div class="chao-activity-name">${activity.name || 'Untitled Activity'}</div>
            <div class="chao-activity-details">${details}</div>
          </div>
          <div class="chao-activity-stats">
            ${statsHTML}
          </div>
        </div>
      `;
    }).join('');
  }

  // Format time in seconds to readable format
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:00`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  // Main render function
  async function renderChaoStats(userId) {
    try {
      // Fetch stats
      const statsRes = await fetch(`/stats/${userId}`);
      const statsData = await statsRes.json();

      if (!statsData.success) {
        throw new Error('Failed to fetch stats');
      }

      // Fetch recent activities
      const activitiesRes = await fetch(`/stats/${userId}/activities?limit=10`);
      const activitiesData = await activitiesRes.json();

      if (!activitiesData.success) {
        throw new Error('Failed to fetch activities');
      }

      const { user, stats, level_progress } = statsData.data;
      const { activities } = activitiesData.data;

      // Update header
      document.getElementById('chaoCharacterName').textContent =
        user.username || `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'Adventurer';
      document.getElementById('chaoCharacterLevel').textContent = `Level ${stats.level}`;

      // Update overall progress bar
      if (level_progress) {
        const percentage = Math.min(level_progress.percentage || 0, 100);
        document.getElementById('chaoOverallProgressFill').style.width = `${percentage}%`;
        document.getElementById('chaoOverallProgressText').textContent =
          `${(level_progress.xp_progress || 0).toLocaleString()} / ${(level_progress.xp_needed || 0).toLocaleString()} XP`;
      }

      // Render stats
      const statsHTML = [
        renderStatCard('strength', {
          level: stats.strength_level,
          xp: stats.strength
        }, activities),
        renderStatCard('endurance', {
          level: stats.endurance_level,
          xp: stats.endurance
        }, activities),
        renderStatCard('agility', {
          level: stats.agility_level,
          xp: stats.agility
        }, activities)
      ].join('');

      document.getElementById('chaoStatsGrid').innerHTML = statsHTML;

      // Render activities
      document.getElementById('chaoActivitiesList').innerHTML = renderActivities(activities);

    } catch (error) {
      console.error('Failed to render Chao stats:', error);
      document.getElementById('chaoStatsGrid').innerHTML =
        '<div class="chao-loading">Failed to load stats</div>';
    }
  }

  // Export to global scope for integration
  window.renderChaoStats = renderChaoStats;
})();
