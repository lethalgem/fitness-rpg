// Chao Garden Stats Dashboard Logic
(function() {
  'use strict';

  const statIcons = {
    strength: 'P',
    endurance: 'E',
    agility: 'A'
  };

  // Best workout types for each stat (from backend config)
  const statWorkoutRecommendations = {
    strength: [
      { name: 'Weight Training', contribution: 0.85 },
      { name: 'Rock Climbing', contribution: 0.6 },
      { name: 'Crossfit', contribution: 0.5 },
      { name: 'Rowing', contribution: 0.5 }
    ],
    endurance: [
      { name: 'Walk', contribution: 0.8 },
      { name: 'Run', contribution: 0.7 },
      { name: 'Elliptical', contribution: 0.7 },
      { name: 'Ride', contribution: 0.6 }
    ],
    agility: [
      { name: 'Table Tennis', contribution: 0.5 },
      { name: 'Tennis', contribution: 0.4 },
      { name: 'Badminton', contribution: 0.4 },
      { name: 'Surfing', contribution: 0.4 }
    ]
  };

  // Calculate XP for current level (from backend formula - LINEAR)
  function xpForCurrentLevel(level) {
    return level * 3000;
  }

  // Calculate XP for next level
  function xpForNextLevel(level) {
    return (level + 1) * 3000;
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

  // Get personalized workout recommendations based on user's activity history
  function getPersonalizedRecommendations(statName, activities) {
    const recommendations = statWorkoutRecommendations[statName];

    // Count how many times user has done each type (with fuzzy matching)
    const sportCounts = {};
    activities.forEach(activity => {
      if (activity.sport_type) {
        // Normalize the sport type for matching
        const normalizedType = activity.sport_type.toLowerCase().replace(/\s+/g, '');
        sportCounts[normalizedType] = (sportCounts[normalizedType] || 0) + 1;
      }
    });

    // Score each recommendation by frequency
    const scoredRecs = recommendations.map(rec => {
      const normalizedRec = rec.name.toLowerCase().replace(/\s+/g, '');
      let count = 0;

      // Check for fuzzy matches in sport types
      for (const [sportType, freq] of Object.entries(sportCounts)) {
        if (sportType.includes(normalizedRec) || normalizedRec.includes(sportType)) {
          count += freq;
        }
      }

      return {
        name: rec.name,
        count: count,
        contribution: rec.contribution
      };
    });

    // Sort by count (workouts they've done most), then by contribution
    scoredRecs.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.contribution - a.contribution;
    });

    // Return top 3 names only
    return scoredRecs.slice(0, 3).map(rec => rec.name);
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

    // Get personalized workout recommendations
    const recommendations = getPersonalizedRecommendations(statName, activities);
    const workoutText = recommendations.join(', ');

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
            ~${activitiesNeeded} ${activitiesNeeded === 1 ? 'workout' : 'workouts'} to level up • ${xpNeeded.toLocaleString()} XP needed
          </div>
          <div class="chao-workout-hint">
            Best for leveling: ${workoutText} <span class="chao-hint-note">(based on your recent activities)</span>
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
