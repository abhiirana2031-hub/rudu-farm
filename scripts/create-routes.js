const fs = require('fs');
const path = require('path');

const routes = [
  { path: 'src/app/(dashboard)/admin/operators/page.tsx', component: 'OperatorsPage' },
  { path: 'src/app/(dashboard)/admin/sessions/page.tsx', component: 'OperatorSessionsPage' },
  { path: 'src/app/(dashboard)/admin/collection/page.tsx', component: 'CollectionLogPage' },
  { path: 'src/app/(dashboard)/operator/collection/page.tsx', component: 'CollectionLogPage' },
  { path: 'src/app/(dashboard)/farmer/collection/page.tsx', component: 'CollectionLogPage' },
  { path: 'src/app/(dashboard)/admin/milk-sales/page.tsx', component: 'MilkSalesPage' },
  { path: 'src/app/(dashboard)/operator/milk-sales/page.tsx', component: 'MilkSalesPage' },
  { path: 'src/app/(dashboard)/admin/rate-chart/page.tsx', component: 'RateChartPage' },
  { path: 'src/app/(dashboard)/operator/rate-chart/page.tsx', component: 'RateChartPage' },
  { path: 'src/app/(dashboard)/admin/payouts/page.tsx', component: 'PayoutsPage' },
  { path: 'src/app/(dashboard)/farmer/payouts/page.tsx', component: 'PayoutsPage' },
  { path: 'src/app/(dashboard)/admin/reports/page.tsx', component: 'ReportsPage' },
  { path: 'src/app/(dashboard)/operator/farmers/page.tsx', component: 'FarmersPage' },
];

routes.forEach(route => {
  const dir = path.dirname(route.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const content = `"use client";
import { ${route.component} } from '@/pages/${route.component}';

export default function Page() {
  return <${route.component} />;
}
`;
  fs.writeFileSync(route.path, content);
});

console.log('Routes generated successfully.');
