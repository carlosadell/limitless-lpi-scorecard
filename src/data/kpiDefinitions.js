// LPI Scorecard KPI Definitions — Single Doc FFS Practice
// Source: Jeff Buske's Limitless Performance Indicators system

export const SECTIONS = {
  weekly: [
    {
      id: 'access-flow',
      title: 'Access & Flow',
      subtitle: 'Demand Quality',
      icon: 'activity',
      cadence: 'weekly',
      description: 'Measures the quality and quantity of patient demand flowing into your practice. These KPIs tell you whether your schedule is filling with the right patients at the right rate — the foundation of a scalable FFS practice.',
      kpis: [
        {
          id: 'new-patients-week',
          label: 'FFS New Patients / Week',
          target: '4–8',
          unit: '',
          inputType: 'number',
          description: 'The number of new fee-for-service patients who visited your practice this week. This is your growth engine — without new patients, you cannot scale. Count only patients who actually showed up, not just scheduled.',
          formula: 'Total new FFS patients seen this week (exclude insurance-only if applicable)',
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
          description: 'Of all inbound inquiries (calls, web forms, walk-ins), what percentage actually got scheduled for an appointment? This measures your front desk\'s ability to convert interest into booked visits.',
          formula: '(Leads who scheduled an appointment ÷ Total inbound leads) × 100',
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
          description: 'The percentage of scheduled patients who actually showed up for their appointment. In an FFS practice, every empty chair is lost revenue that can\'t be recovered from insurance.',
          formula: '(Patients who showed up ÷ Total patients scheduled) × 100',
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
          description: 'The percentage of scheduled appointments that were cancelled or no-showed. This is the inverse of your show rate and directly measures schedule leakage — the #1 silent profit killer in FFS practices.',
          formula: '(Cancelled + No-show appointments ÷ Total scheduled appointments) × 100',
          green: { min: null, max: 4, label: '≤ 4%' },
          yellow: { min: 5, max: 7, label: '5–7%' },
          red: { min: 8, max: null, label: '≥ 8%' },
          ifRed: 'Tighten financial policy + pre-frames. If people don\'t show, you don\'t scale.',
          invertScale: true,
        },
      ],
    },
    {
      id: 'conversion',
      title: 'Conversion',
      subtitle: 'Case Acceptance',
      icon: 'trending-up',
      cadence: 'weekly',
      description: 'Tracks how effectively you turn diagnosed treatment into accepted and scheduled care. This is where revenue is made or lost — you don\'t need more leads if your conversion is strong.',
      kpis: [
        {
          id: 'same-day-acceptance',
          label: 'Same-Day Acceptance',
          target: '40–60%',
          unit: '%',
          inputType: 'number',
          description: 'The percentage of treatment diagnosed during a visit that the patient accepts and schedules on the same day. This reflects your case presentation strength and the patient\'s trust in your recommendation.',
          formula: '(Treatment $ accepted same day ÷ Total treatment $ diagnosed that day) × 100',
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
          description: 'The total percentage of all diagnosed treatment dollars that patients accept (including follow-up acceptances, not just same-day). This is the single most impactful number for revenue growth.',
          formula: '(Total treatment $ accepted ÷ Total treatment $ diagnosed) × 100',
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
          description: 'The average number of days that accepted-but-not-yet-scheduled treatment has been sitting in your system. High aging means patients said "yes" but never booked — revenue is slipping through the cracks.',
          formula: 'Average days since treatment was accepted but not yet scheduled for completion',
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
      icon: 'refresh-cw',
      cadence: 'weekly',
      description: 'Hygiene is your practice\'s shock absorber — it creates predictable, recurring revenue and feeds the doctor\'s schedule with diagnosed treatment. When hygiene is weak, everything else feels harder.',
      kpis: [
        {
          id: 'pre-appoint-rate',
          label: 'Pre-Appointment Rate',
          target: '90–95%',
          unit: '%',
          inputType: 'number',
          description: 'The percentage of hygiene patients who schedule their next recare appointment before leaving the office today. This is the single best predictor of long-term practice stability.',
          formula: '(Hygiene patients who scheduled next visit before leaving ÷ Total hygiene patients seen) × 100',
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
          description: 'The percentage of available hygiene chair hours that were filled with patients this week. Empty hygiene chairs mean lost recare revenue and fewer opportunities to diagnose treatment.',
          formula: '(Filled hygiene hours ÷ Total available hygiene hours) × 100',
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
          description: 'The number of past-due or lapsed patients (typically 6+ months overdue for recare) who were successfully brought back into the schedule this month. These are "free" patients — no marketing cost.',
          formula: 'Count of previously inactive patients (6+ months overdue) who scheduled and showed this month',
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
      icon: 'dollar-sign',
      cadence: 'monthly',
      description: 'These are your profit protection KPIs. In an FFS practice, margin discipline is everything — if overhead creeps past 60%, your freedom disappears. Review these on the 1st week of every month.',
      kpis: [
        {
          id: 'collections-pct',
          label: 'Collections / Adjusted Production',
          target: '≥ 98%',
          unit: '%',
          inputType: 'number',
          description: 'The percentage of your adjusted (net) production that you actually collected in cash. This measures how effectively you turn completed work into money in the bank. Anything below 98% means revenue is leaking.',
          formula: '(Total collections received ÷ Adjusted/net production) × 100',
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
          description: 'Total operating expenses as a percentage of collections. This is the master number — it determines your profit margin directly. The ADA benchmark is 63%, but efficient FFS practices target 55–60%.',
          formula: '(Total operating expenses ÷ Total collections) × 100',
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
          description: 'All staff compensation (wages, salaries, payroll taxes, benefits, retirement contributions) as a percentage of collections. This is typically the single largest expense line — it must be watched closely.',
          formula: '(Total team compensation + payroll taxes + benefits ÷ Total collections) × 100',
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
          description: 'Clinical supplies and laboratory fees combined as a percentage of collections. This covers everything from gloves and composites to lab-fabricated crowns and aligners.',
          formula: '(Clinical supplies cost + Lab fees ÷ Total collections) × 100',
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
          description: 'Rent or mortgage, utilities, maintenance, and property-related costs as a percentage of collections. This is a mostly fixed cost — the goal is to grow revenue so this percentage naturally shrinks.',
          formula: '(Rent/mortgage + Utilities + Maintenance + Property costs ÷ Total collections) × 100',
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
          description: 'Total marketing and advertising spend as a percentage of collections. In FFS practices, this should be intentional and ROI-tracked — not too low (you\'re not investing in growth) and not too high (you\'re spending without accountability).',
          formula: '(Total marketing + advertising spend ÷ Total collections) × 100',
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
      icon: 'zap',
      cadence: 'monthly',
      description: 'These KPIs measure how effectively you\'re using your most limited resource: clinical time. You don\'t want to work harder — you want each hour to hit harder. This is where FFS practices win or lose.',
      kpis: [
        {
          id: 'doctor-utilization',
          label: 'Doctor Schedule Utilization',
          target: '≥ 85–90%',
          unit: '%',
          inputType: 'number',
          description: 'The percentage of available doctor chair hours that were filled with productive appointments. Empty doctor time is the most expensive waste in a practice.',
          formula: '(Filled doctor production hours ÷ Total available doctor hours) × 100',
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
          description: 'Monthly hygiene chair utilization percentage. Hygiene should run at a higher fill rate than the doctor since it\'s more predictable and appointment-driven.',
          formula: '(Filled hygiene hours for the month ÷ Total available hygiene hours) × 100',
          green: { min: 90, max: null, label: '≥ 90%' },
          yellow: { min: 85, max: 89, label: '85–89%' },
          red: { min: null, max: 84, label: '< 85%' },
          ifRed: 'Recall blitz. Same-day hygiene fills. This is your volume stabilizer.',
        },
        {
          id: 'avg-per-visit',
          label: 'Avg $ per Patient Visit',
          target: 'Trending up',
          unit: '$',
          inputType: 'number',
          description: 'Average revenue collected per patient visit across all visit types. This should trend upward over time as you improve case acceptance and shift toward higher-value procedures.',
          formula: 'Total collections for the month ÷ Total patient visits',
          green: { min: null, max: null, label: 'Up trend' },
          yellow: { min: null, max: null, label: 'Flat' },
          red: { min: null, max: null, label: 'Down trend' },
          ifRed: 'Review procedure mix. Are you doing enough high-value dentistry?',
          trendBased: true,
        },
        {
          id: 'doctor-per-hour',
          label: 'Doctor $ / Clinical Hour',
          target: 'Trending up',
          unit: '$',
          inputType: 'number',
          description: 'Revenue produced per hour of doctor clinical time. This is THE FFS scaling lever — increasing this number means you earn more without working more hours.',
          formula: 'Total doctor production ÷ Total doctor clinical hours worked',
          green: { min: null, max: null, label: 'Up trend' },
          yellow: { min: null, max: null, label: 'Flat' },
          red: { min: null, max: null, label: 'Down trend' },
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
    icon: 'star',
    description: 'These forward-looking indicators predict where your practice will be in 60–90 days. They are the earliest warning system — if these slip, your lagging KPIs (revenue, profit) will follow.',
    kpis: [
      {
        id: 'referral-pct',
        label: 'Referral % of New Patients',
        target: '30–50%',
        unit: '%',
        inputType: 'number',
        description: 'The percentage of your new patients who came from existing patient referrals (vs. marketing, web search, etc.). High referral rates signal a strong reputation flywheel and lower patient acquisition cost.',
        formula: '(New patients from referrals ÷ Total new patients) × 100',
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
        description: 'The number of new 5-star reviews received this week across Google, Yelp, and other platforms. Consistent review velocity builds social proof and drives organic new patient acquisition.',
        formula: 'Count of new 5-star reviews posted this week (Google + Yelp + other platforms)',
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
        description: 'A self-assessed 1–10 rating of your personal energy, motivation, and conviction this week. This is the hidden multiplier — when doctor energy drops, case acceptance, team morale, and patient experience all follow.',
        formula: 'Self-assessment: Rate your energy and conviction from 1 (depleted) to 10 (fully charged)',
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
