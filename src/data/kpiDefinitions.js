// LPI Scorecard KPI Definitions — Single Doc FFS Practice
// Source: Jeff Buske's Limitless Performance Indicators system

export const SECTIONS = {
  weekly: [
    {
      id: 'access-flow',
      title: 'Access & Flow',
      subtitle: 'Demand Quality',
      icon: '📊',
      cadence: 'weekly',
      kpis: [
        {
          id: 'new-patients-week',
          label: 'FFS New Patients / Week',
          target: '4–8',
          unit: '',
          inputType: 'number',
          green: { min: 4, max: null, label: '≥ 4' },
          yellow: { min: 2, max: 3, label: '2–3' },
          red: { min: null, max: 1, label: '≤ 1' },
          ifRed: 'Audit lead sources + front desk call conversion. Review recorded calls if available.',
        },
        {
          id: 'lead-scheduled-pct',
          label: 'Lead → Scheduled %',
          target: '≥ 70%',
          unit: '%',
          inputType: 'number',
          green: { min: 70, max: null, label: '≥ 70%' },
          yellow: { min: 60, max: 69, label: '60–69%' },
          red: { min: null, max: 59, label: '< 60%' },
          ifRed: 'Call scripting overhaul + speed to answer audit. Front desk must convert, not just inform.',
        },
        {
          id: 'show-rate',
          label: 'Show Rate',
          target: '≥ 92–95%',
          unit: '%',
          inputType: 'number',
          green: { min: 92, max: null, label: '≥ 92%' },
          yellow: { min: 88, max: 91, label: '88–91%' },
          red: { min: null, max: 87, label: '< 88%' },
          ifRed: 'Tighten confirmations + require financial deposits for high-value appointments.',
        },
        {
          id: 'cancel-noshow-pct',
          label: 'Cancellations / No-Shows',
          target: '≤ 4%',
          unit: '%',
          inputType: 'number',
          green: { min: null, max: 4, label: '≤ 4%' },
          yellow: { min: 5, max: 7, label: '5–7%' },
          red: { min: 8, max: null, label: '≥ 8%' },
          ifRed: 'Tighten financial policy + pre-frames. If people don\'t show, you don\'t scale.',
          invertScale: true, // lower is better
        },
      ],
    },
    {
      id: 'conversion',
      title: 'Conversion',
      subtitle: 'Case Acceptance',
      icon: '💰',
      cadence: 'weekly',
      kpis: [
        {
          id: 'same-day-acceptance',
          label: 'Same-Day Acceptance',
          target: '40–60%',
          unit: '%',
          inputType: 'number',
          green: { min: 40, max: null, label: '≥ 40%' },
          yellow: { min: 30, max: 39, label: '30–39%' },
          red: { min: null, max: 29, label: '< 30%' },
          ifRed: 'Case presentation flow + urgency language. Present one clear plan — no menu dumping.',
        },
        {
          id: 'overall-case-acceptance',
          label: 'Overall Case Acceptance',
          target: '70–85%',
          unit: '%',
          inputType: 'number',
          green: { min: 70, max: null, label: '≥ 70%' },
          yellow: { min: 60, max: 69, label: '60–69%' },
          red: { min: null, max: 59, label: '< 60%' },
          ifRed: 'Diagnosis clarity + financing confidence. FFS patients need clear leadership, not more info.',
        },
        {
          id: 'unscheduled-tx-aging',
          label: 'Unscheduled Tx Aging (days)',
          target: '< 30 days',
          unit: 'days',
          inputType: 'number',
          green: { min: null, max: 30, label: '< 30' },
          yellow: { min: 31, max: 45, label: '31–45' },
          red: { min: 46, max: null, label: '> 45' },
          ifRed: 'Dedicated reactivation block weekly. Assign ownership and track treatment dollars recaptured.',
          invertScale: true,
        },
      ],
    },
    {
      id: 'hygiene',
      title: 'Hygiene Engine',
      subtitle: 'Retention = Stability',
      icon: '🔄',
      cadence: 'weekly',
      kpis: [
        {
          id: 'pre-appoint-rate',
          label: 'Pre-Appointment Rate',
          target: '90–95%',
          unit: '%',
          inputType: 'number',
          green: { min: 90, max: null, label: '≥ 90%' },
          yellow: { min: 85, max: 89, label: '85–89%' },
          red: { min: null, max: 84, label: '< 85%' },
          ifRed: 'Mandatory pre-appoint policy — zero exceptions. Hygiene is your shock absorber.',
        },
        {
          id: 'hygiene-utilization',
          label: 'Hygiene Schedule Utilization',
          target: '≥ 90%',
          unit: '%',
          inputType: 'number',
          green: { min: 90, max: null, label: '≥ 90%' },
          yellow: { min: 85, max: 89, label: '85–89%' },
          red: { min: null, max: 84, label: '< 85%' },
          ifRed: 'Recall blitz + same-day fills. Prioritize filling hygiene gaps over everything else.',
        },
        {
          id: 'reactivated-patients',
          label: 'Reactivated Patients / Month',
          target: '10–15',
          unit: '',
          inputType: 'number',
          green: { min: 10, max: null, label: '≥ 10' },
          yellow: { min: 5, max: 9, label: '5–9' },
          red: { min: null, max: 4, label: '< 5' },
          ifRed: 'Weekly reactivation power hour — scheduled, not optional.',
        },
      ],
    },
  ],
  monthly: [
    {
      id: 'financial',
      title: 'Financial Control',
      subtitle: 'FFS Margin Protection',
      icon: '🏦',
      cadence: 'monthly',
      kpis: [
        {
          id: 'collections-pct',
          label: 'Collections / Adjusted Production',
          target: '≥ 98%',
          unit: '%',
          inputType: 'number',
          green: { min: 98, max: null, label: '≥ 98%' },
          yellow: { min: 95, max: 97, label: '95–97%' },
          red: { min: null, max: 94, label: '< 95%' },
          ifRed: 'Collections process audit. Check insurance aging, patient balances, and billing workflow.',
        },
        {
          id: 'total-overhead',
          label: 'Total Overhead',
          target: '≤ 55–60%',
          unit: '%',
          inputType: 'number',
          green: { min: null, max: 60, label: '≤ 60%' },
          yellow: { min: 61, max: 65, label: '61–65%' },
          red: { min: 66, max: null, label: '> 65%' },
          ifRed: 'Freeze hiring. Audit overtime + role overlap. Consolidate vendors (supplies + lab first). If overhead creeps past 60%, freedom disappears.',
          invertScale: true,
        },
        {
          id: 'team-pct',
          label: 'Team (Wages + Payroll Burden)',
          target: '≤ 25–28%',
          unit: '%',
          inputType: 'number',
          green: { min: null, max: 28, label: '≤ 28%' },
          yellow: { min: 29, max: 32, label: '29–32%' },
          red: { min: 33, max: null, label: '> 32%' },
          ifRed: 'Review staff utilization, overtime, and role overlap. Single-doc FFS must stay lean.',
          invertScale: true,
        },
        {
          id: 'supplies-lab',
          label: 'Supplies + Lab (Combined)',
          target: '≤ 12–14%',
          unit: '%',
          inputType: 'number',
          green: { min: null, max: 14, label: '≤ 14%' },
          yellow: { min: 15, max: 17, label: '15–17%' },
          red: { min: 18, max: null, label: '> 17%' },
          ifRed: 'Vendor consolidation, standardization, re-make control. Negotiate lab fees.',
          invertScale: true,
        },
        {
          id: 'facility-pct',
          label: 'Facility / Occupancy',
          target: '≤ 5–8%',
          unit: '%',
          inputType: 'number',
          green: { min: null, max: 8, label: '≤ 8%' },
          yellow: { min: 9, max: 11, label: '9–11%' },
          red: { min: 12, max: null, label: '> 11%' },
          ifRed: 'Review lease terms, space utilization, hours vs demand.',
          invertScale: true,
        },
        {
          id: 'marketing-pct',
          label: 'Marketing',
          target: '3–8%',
          unit: '%',
          inputType: 'number',
          green: { min: 3, max: 8, label: '3–8%' },
          yellow: { min: 1, max: 2, label: '1–2% or 9–10%', yellowAlsoMax: 10, yellowAlsoMin: 9 },
          red: { min: null, max: 0, label: '0% or > 10%', redAlsoMin: 11 },
          ifRed: 'Track ROI per channel. Either you\'re not investing enough or spending without accountability.',
          customEval: true,
        },
      ],
    },
    {
      id: 'capacity',
      title: 'Capacity & Leverage',
      subtitle: 'Time = The Real Currency',
      icon: '⚡',
      cadence: 'monthly',
      kpis: [
        {
          id: 'doctor-utilization',
          label: 'Doctor Schedule Utilization',
          target: '≥ 85–90%',
          unit: '%',
          inputType: 'number',
          green: { min: 85, max: null, label: '≥ 85%' },
          yellow: { min: 78, max: 84, label: '78–84%' },
          red: { min: null, max: 77, label: '< 78%' },
          ifRed: 'Schedule blocks need restructuring. Fill high-value procedures first.',
        },
        {
          id: 'hygiene-util-monthly',
          label: 'Hygiene Utilization',
          target: '≥ 90–95%',
          unit: '%',
          inputType: 'number',
          green: { min: 90, max: null, label: '≥ 90%' },
          yellow: { min: 85, max: 89, label: '85–89%' },
          red: { min: null, max: 84, label: '< 85%' },
          ifRed: 'Recall blitz. Same-day hygiene fills. This is your volume stabilizer.',
        },
        {
          id: 'avg-per-visit',
          label: 'Avg $ per Patient Visit',
          target: 'Trending ↑',
          unit: '$',
          inputType: 'number',
          green: { min: null, max: null, label: '↑ trend' },
          yellow: { min: null, max: null, label: 'Flat' },
          red: { min: null, max: null, label: '↓ trend' },
          ifRed: 'Review procedure mix. Are you doing enough high-value dentistry?',
          trendBased: true,
        },
        {
          id: 'doctor-per-hour',
          label: 'Doctor $ / Clinical Hour',
          target: 'Trending ↑',
          unit: '$',
          inputType: 'number',
          green: { min: null, max: null, label: '↑ trend' },
          yellow: { min: null, max: null, label: 'Flat' },
          red: { min: null, max: null, label: '↓ trend' },
          ifRed: 'Reduce low-value procedures. Protect peak production days. This is the FFS scaling lever.',
          trendBased: true,
        },
      ],
    },
  ],
  leading: {
    id: 'leading-indicators',
    title: 'FFS Leading Indicators',
    subtitle: 'Predict Success 60–90 Days Ahead',
    icon: '⭐',
    kpis: [
      {
        id: 'referral-pct',
        label: 'Referral % of New Patients',
        target: '30–50%',
        unit: '%',
        inputType: 'number',
        green: { min: 30, max: null, label: '≥ 30%' },
        yellow: { min: 20, max: 29, label: '20–29%' },
        red: { min: null, max: 19, label: '< 20%' },
        ifRed: 'Your reputation flywheel is stalling. Improve patient experience and ask for referrals.',
      },
      {
        id: 'review-velocity',
        label: '5-Star Reviews This Week',
        target: 'Consistent weekly',
        unit: '',
        inputType: 'number',
        green: { min: 2, max: null, label: '≥ 2/week' },
        yellow: { min: 1, max: 1, label: '1/week' },
        red: { min: null, max: 0, label: '0' },
        ifRed: 'Systemize review requests. Every happy patient should be asked before they leave the chair.',
      },
      {
        id: 'doctor-energy',
        label: 'Doctor Energy & Conviction',
        target: 'Non-negotiable',
        unit: '/10',
        inputType: 'number',
        green: { min: 8, max: null, label: '8–10' },
        yellow: { min: 5, max: 7, label: '5–7' },
        red: { min: null, max: 4, label: '≤ 4' },
        ifRed: 'If you\'re exhausted, conversion will fall next. Reduce low-value procedures. Protect your energy. Fix schedule before fixing marketing.',
      },
    ],
  },
};

// Flatten all KPIs for easy lookup
export function getAllKpis() {
  const all = [];
  SECTIONS.weekly.forEach(s => s.kpis.forEach(k => all.push({ ...k, sectionId: s.id })));
  SECTIONS.monthly.forEach(s => s.kpis.forEach(k => all.push({ ...k, sectionId: s.id })));
  SECTIONS.leading.kpis.forEach(k => all.push({ ...k, sectionId: 'leading-indicators' }));
  return all;
}

// Evaluate a KPI value against its thresholds
export function evaluateKpi(kpi, value) {
  if (value === null || value === undefined || value === '') return 'none';
  const v = parseFloat(value);
  if (isNaN(v)) return 'none';

  // Trend-based KPIs need special handling
  if (kpi.trendBased) return 'none'; // handled by trend comparison

  // Marketing has custom ranges
  if (kpi.customEval) {
    if (v >= 3 && v <= 8) return 'green';
    if ((v >= 1 && v <= 2) || (v >= 9 && v <= 10)) return 'yellow';
    return 'red';
  }

  // Inverted scale (lower is better)
  if (kpi.invertScale) {
    if (kpi.green.max !== null && v <= kpi.green.max) return 'green';
    if (kpi.yellow.min !== null && kpi.yellow.max !== null && v >= kpi.yellow.min && v <= kpi.yellow.max) return 'yellow';
    if (kpi.red.min !== null && v >= kpi.red.min) return 'red';
    // fallback
    if (kpi.green.max !== null && v <= kpi.green.max) return 'green';
    return 'red';
  }

  // Normal scale (higher is better)
  if (kpi.green.min !== null && v >= kpi.green.min) return 'green';
  if (kpi.yellow.min !== null && kpi.yellow.max !== null && v >= kpi.yellow.min && v <= kpi.yellow.max) return 'yellow';
  if (kpi.red.max !== null && v <= kpi.red.max) return 'red';
  // fallback
  if (kpi.green.min !== null && v >= kpi.green.min) return 'green';
  return 'yellow';
}

export const STATUS_COLORS = {
  green: { bg: '#22C55E', text: '#DCFCE7', label: 'On Track' },
  yellow: { bg: '#F59E0B', text: '#FEF3C7', label: 'Watch' },
  red: { bg: '#FF3333', text: '#FEE2E2', label: 'Action Needed' },
  none: { bg: '#333', text: '#9CA3AF', label: 'No Data' },
};
