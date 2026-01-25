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

    // Smart segmentation based on workouts needed
    let numSegments;
    let segmentMode;

    if (activitiesNeeded <= 10) {
      // Mode 1: Fixed 10 segments (always consistent for visual clarity)
      numSegments = 10;
      segmentMode = 'one-to-one';
    } else if (activitiesNeeded <= 25) {
      // Mode 2: Grouped (always 10 segments)
      numSegments = 10;
      segmentMode = 'grouped';
    } else {
      // Mode 3: Milestones (5 big segments)
      numSegments = 5;
      segmentMode = 'milestone';
    }

    // Calculate segment fill states
    const segments = [];

    if (segmentMode === 'one-to-one') {
      // Special logic for one-to-one: fill based on workouts remaining
      const filledSegments = Math.max(0, 10 - activitiesNeeded);

      for (let i = 0; i < 10; i++) {
        let fillClass = '';
        let fillPercent = 0;

        if (i < filledSegments) {
          // Already completed segments
          fillClass = 'filled';
          fillPercent = 100;
        } else if (i === filledSegments && earnedInLevel > 0) {
          // Current segment in progress
          // Calculate progress within this segment
          const segmentStartXP = (filledSegments / 10) * totalLevelXP;
          const segmentEndXP = ((filledSegments + 1) / 10) * totalLevelXP;
          const segmentXP = segmentEndXP - segmentStartXP;
          const xpInSegment = earnedInLevel - segmentStartXP;

          fillClass = 'partial';
          fillPercent = Math.min(100, (xpInSegment / segmentXP) * 100);
        }
        // else: empty segment (no class)

        segments.push({ fillClass, fillPercent });
      }
    } else {
      // Original XP-based logic for grouped and milestone modes
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
    }

    const segmentsHTML = segments.map((seg, index) => {
      const isNext = seg.fillClass === '' && index > 0 && segments[index - 1].fillClass === 'filled';
      const isFirstEmpty = seg.fillClass === '' && index === 0;
      const shouldHighlight = isNext || (isFirstEmpty && !segments.some(s => s.fillClass === 'filled'));

      return `
        <div class="chao-progress-segment ${seg.fillClass} ${shouldHighlight ? 'next-to-fill' : ''}">
          ${seg.fillPercent > 0 ? `
            <div class="chao-progress-segment-fill ${statName}" style="transform: scaleX(${seg.fillPercent / 100})"></div>
          ` : ''}
        </div>
      `;
    }).join('');

    const remainingSegments = segments.filter(s => s.fillClass !== 'filled').length;

    // Calculate workouts per segment for grouped/milestone modes
    const workoutsPerSegment = Math.ceil(activitiesNeeded / numSegments);

    // Build context-aware text
    let progressContext = '';
    if (segmentMode === 'grouped') {
      progressContext = ` • ~${workoutsPerSegment} per segment`;
    } else if (segmentMode === 'milestone') {
      // Calculate which segment they're working on
      const currentSegmentIndex = Math.floor((earnedInLevel / totalLevelXP) * numSegments);
      const segmentStartXP = (currentSegmentIndex / numSegments) * totalLevelXP;
      const xpInCurrentSegment = earnedInLevel - segmentStartXP;
      const workoutsInSegment = Math.floor(xpInCurrentSegment / avgXP);

      progressContext = ` • Milestone ${currentSegmentIndex + 1}/5: ${workoutsInSegment}/${workoutsPerSegment} workouts`;
    }

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
            <div class="chao-progress-container ${segmentMode}-mode">
              ${segmentsHTML}
            </div>
            <div class="chao-stat-level">Lv ${statData.level}</div>
          </div>
          <div class="chao-xp-info">
            ~${activitiesNeeded} ${activitiesNeeded === 1 ? 'workout' : 'workouts'} to level up • ${xpNeeded.toLocaleString()} XP needed${progressContext}
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
      const sportType = activity.sport_type ? formatSportType(activity.sport_type) : '';
      const distance = activity.distance ? `${(activity.distance / 1609.34).toFixed(1)} mi` : '';
      const minutes = Math.round((activity.moving_time || activity.elapsed_time || 0) / 60);
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

      // Build intensity details
      const intensityInfo = getIntensityInfo(activity);

      return `
        <div class="chao-activity-item" onclick="this.classList.toggle('expanded')">
          <div class="chao-activity-content">
            <div class="chao-activity-name">${activity.name || 'Untitled Activity'}</div>
            <div class="chao-activity-details">${details}</div>
            ${sportType ? `<div class="chao-activity-type">${sportType}</div>` : ''}
          </div>
          <div class="chao-activity-stats">
            ${statsHTML}
          </div>
          <div class="chao-activity-expand-hint">tap for XP breakdown</div>
          <div class="chao-activity-breakdown">
            <div class="chao-xp-formula">
              <div class="chao-formula-row">
                <span>Time</span>
                <span>${minutes} min</span>
              </div>
              <div class="chao-formula-row">
                <span>Base Rate</span>
                <span>× 10 XP/min</span>
              </div>
              <div class="chao-formula-row chao-formula-subtotal">
                <span>Base XP</span>
                <span>= ${activity.xp?.base?.toLocaleString() || minutes * 10} XP</span>
              </div>
              <div class="chao-formula-divider"></div>
              <div class="chao-formula-row chao-formula-intensity">
                <span>${intensityInfo.label}</span>
                <span>${intensityInfo.value}</span>
              </div>
              <div class="chao-formula-row">
                <span>Multiplier</span>
                <span>× ${(activity.xp?.intensity_multiplier || 1).toFixed(2)}</span>
              </div>
              <div class="chao-formula-divider"></div>
              <div class="chao-formula-row chao-formula-total">
                <span>Total XP</span>
                <span>= ${activity.xp?.total?.toLocaleString() || 0} XP</span>
              </div>
            </div>
            ${intensityInfo.note ? `<div class="chao-intensity-note">${intensityInfo.note}</div>` : ''}
            <div class="chao-activity-collapse-hint">tap to collapse</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Get intensity source info for display
  function getIntensityInfo(activity) {
    const source = activity.xp?.intensity_source;

    if (source === 'heartrate') {
      const hr = Math.round(activity.average_heartrate || 0);
      const maxHR = 190;
      const percent = Math.round((hr / maxHR) * 100);
      return { label: 'Avg HR', value: `${hr} bpm (${percent}% max)`, note: null };
    } else if (source === 'watts') {
      const watts = Math.round(activity.average_watts || 0);
      const ftp = 200;
      const percent = Math.round((watts / ftp) * 100);
      return { label: 'Avg Power', value: `${watts}W (${percent}% FTP)`, note: null };
    } else if (source === 'pace') {
      const speedMs = activity.average_speed || 0;
      if (speedMs > 0) {
        const paceMinPerMile = (1609.34 / speedMs) / 60;
        const paceMin = Math.floor(paceMinPerMile);
        const paceSec = Math.round((paceMinPerMile - paceMin) * 60);
        return { label: 'Avg Pace', value: `${paceMin}:${paceSec.toString().padStart(2, '0')} /mi`, note: null };
      }
    }
    return { label: 'Intensity', value: 'No data', note: '💡 Wear a HR monitor to earn bonus XP!' };
  }

  // Format sport type from PascalCase to readable (e.g., "WeightTraining" → "Weight Training")
  function formatSportType(sportType) {
    return sportType
      .replace(/([A-Z])/g, ' $1')  // Add space before capitals
      .replace(/^./, str => str.toUpperCase())  // Capitalize first letter
      .trim();
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
