# Adding New Stats to Fitness RPG

This guide explains how to add new stat types (like speed, flexibility, power, etc.) to your Fitness RPG.

## Current Stats (Implemented ✅)
- **Strength**: Weight training, climbing, strength-based activities
- **Endurance**: Running, cycling, long-duration cardio
- **Agility**: Quick movements, directional changes, coordination (tennis, soccer, etc.)

## How to Add a Fourth Stat (e.g., "Speed")

### 1. Update Types (`src/types.ts`)

Find the `StatMapping` interface and add your new stat:

```typescript
export interface StatMapping {
  [sportType: string]: {
    strength: number;
    endurance: number;
    agility: number;  // ADD THIS
  };
}
```

Update `CalculatedStats` interface:

```typescript
export interface CalculatedStats {
  strength: number;
  endurance: number;
  agility: number;  // ADD THIS
  strength_level: number;
  endurance_level: number;
  agility_level: number;  // ADD THIS
  total_xp: number;
  level: number;
  activities_count: number;
}
```

### 2. Update Config (`src/config/stats.ts`)

Update the `STAT_TYPES` array:

```typescript
export const STAT_TYPES = ['strength', 'endurance', 'agility'] as const;
```

Update ALL sport mappings to include the new stat (values must sum to 1.0):

```typescript
export const SPORT_STAT_MAPPING: StatMapping = {
  'Run': { strength: 0.2, endurance: 0.7, agility: 0.1 },
  'TrailRun': { strength: 0.2, endurance: 0.6, agility: 0.2 },
  // ... update ALL entries
};
```

Update the default mapping:

```typescript
export const DEFAULT_STAT_MAPPING = {
  strength: 0.33,
  endurance: 0.33,
  agility: 0.34,
};
```

Update the return type of `getStatMapping`:

```typescript
export function getStatMapping(sportType: string): {
  strength: number;
  endurance: number;
  agility: number;  // ADD THIS
} {
  return SPORT_STAT_MAPPING[sportType] || DEFAULT_STAT_MAPPING;
}
```

### 3. Update Calculator (`src/stats/calculator.ts`)

Add accumulator and level calculation:

```typescript
export function calculateUserStats(activities: Activity[]): CalculatedStats {
  let totalStrength = 0;
  let totalEndurance = 0;
  let totalAgility = 0;  // ADD THIS
  let totalXP = 0;

  for (const activity of activities) {
    const xpCalc = calculateActivityXP(activity);
    totalXP += xpCalc.totalXP;

    const statMapping = getStatMapping(activity.sport_type);

    totalStrength += xpCalc.totalXP * statMapping.strength;
    totalEndurance += xpCalc.totalXP * statMapping.endurance;
    totalAgility += xpCalc.totalXP * statMapping.agility;  // ADD THIS
  }

  const level = calculateLevel(totalXP);
  const strengthLevel = calculateLevel(totalStrength);
  const enduranceLevel = calculateLevel(totalEndurance);
  const agilityLevel = calculateLevel(totalAgility);  // ADD THIS

  return {
    strength: Math.round(totalStrength),
    endurance: Math.round(totalEndurance),
    agility: Math.round(totalAgility),  // ADD THIS
    strength_level: strengthLevel,
    endurance_level: enduranceLevel,
    agility_level: agilityLevel,  // ADD THIS
    total_xp: Math.round(totalXP),
    level,
    activities_count: activities.length,
  };
}
```

### 4. Update Frontend HTML (`public/index.html`)

Add a new stat card in the "Your Stats" section:

```html
<div class="stat-card">
  <div class="stat-icon">⚡</div>
  <div class="stat-content">
    <div class="stat-label">AGILITY</div>
    <div class="stat-value" id="agilityValue">0</div>
  </div>
</div>
```

Update the radar chart canvas to accommodate 3 axes (it will automatically adjust).

### 5. Update Frontend JavaScript (`public/app.js`)

Update `updateStats` function:

```javascript
function updateStats(stats) {
  document.getElementById('strengthValue').textContent = stats.strength_level || 0;
  document.getElementById('enduranceValue').textContent = stats.endurance_level || 0;
  document.getElementById('agilityValue').textContent = stats.agility_level || 0;  // ADD THIS
  document.getElementById('totalXpValue').textContent = stats.total_xp.toLocaleString();
  document.getElementById('activitiesValue').textContent = stats.activities_count.toLocaleString();
}
```

Update `updateRadarChart` function:

```javascript
function updateRadarChart(stats) {
  const ctx = document.getElementById('statsChart').getContext('2d');

  if (statsChart) {
    statsChart.destroy();
  }

  const strengthLevel = stats.strength_level || 0;
  const enduranceLevel = stats.endurance_level || 0;
  const agilityLevel = stats.agility_level || 0;  // ADD THIS
  const maxLevel = Math.max(strengthLevel, enduranceLevel, agilityLevel, 10);  // ADD agility

  statsChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Strength', 'Endurance', 'Agility'],  // ADD LABEL
      datasets: [{
        label: 'Level',
        data: [strengthLevel, enduranceLevel, agilityLevel],  // ADD DATA
        // ... rest of config
      }]
    },
    // ... rest of options
  });
}
```

### 6. Update Styling (if needed) (`public/style.css`)

Adjust grid layouts if you're adding more stat cards. The current layout uses CSS Grid which should adapt automatically.

## Example: Activities that Give Agility

When mapping sports to stats, here are some suggestions for agility contributions:

- **High Agility**: Soccer, Tennis, Basketball, Skateboarding, Parkour
- **Medium Agility**: Trail Running, Mountain Biking, Rock Climbing
- **Low Agility**: Road Cycling, Swimming, Weight Training

Example mappings:
```typescript
'Soccer': { strength: 0.2, endurance: 0.5, agility: 0.3 },
'Tennis': { strength: 0.2, endurance: 0.4, agility: 0.4 },
'Skateboard': { strength: 0.3, endurance: 0.2, agility: 0.5 },
```

## Testing Your Changes

After adding a new stat, **run the test suite**:

```bash
npm test
```

The tests will automatically catch if:
- ❌ Sport percentages don't sum to 1.0
- ❌ Any percentage is outside 0-1 range
- ❌ Stat calculations are broken

If all tests pass, your changes are safe to deploy!

## Tips

1. **Balance is key**: All stat values for each sport must sum to 1.0 (tests will catch errors!)
2. **Test thoroughly**: Run `npm test` after making changes
3. **Consider the narrative**: Think about what each stat represents in your RPG and how activities logically contribute to it
4. **UI space**: The radar chart works best with 3-5 stats. More than that might need a different visualization
5. **Update all files**: Types → Config → Calculator → Frontend (follow this guide step-by-step)

## Future Enhancements

You could extend this further by:
- Adding stat-based achievements or milestones
- Creating "builds" or "classes" based on stat distributions
- Implementing PvE battles where stats determine outcomes
- Adding equipment/gear that boosts specific stats
