# Requirements Document

## Introduction

This feature adds visual analytics and insights to the Merchant Dashboard, transforming the currently static stat-card-only view into a data-rich experience with charts, trends, and actionable visualisations. The analytics leverage recharts (via the existing shadcn/ui ChartContainer component) and cover invoice volume trends, credit utilisation over time, financing cost breakdowns, supplier distribution, and invoice status pipelines. All data is mock/hardcoded and respects role-based visibility — different merchant roles see only the analytics relevant to their product context.

## Glossary

- **Analytics_Section**: A dedicated region of the Merchant Dashboard rendered below the existing stats grid, containing one or more Chart_Card components
- **Chart_Card**: A self-contained card component that wraps a single recharts visualisation with a title, optional subtitle, and optional legend
- **ChartContainer**: The existing shadcn/ui wrapper (`src/app/components/ui/chart.tsx`) that provides responsive sizing, theming, and tooltip infrastructure for recharts
- **Invoice_Volume_Chart**: A line or area chart showing the count of invoices submitted per month over a trailing period
- **Credit_Utilisation_Chart**: A stacked area or bar chart showing how credit limit utilisation has changed over time, split by receivable and payable portions
- **Financing_Cost_Chart**: A bar chart showing monthly financing fees (flat fee + VAT) incurred by the merchant
- **Supplier_Distribution_Chart**: A pie or donut chart showing the proportion of invoice volume (by count or amount) per supplier
- **Invoice_Status_Pipeline**: A horizontal stacked bar or funnel visualisation showing the breakdown of invoices across statuses (pending, refer, approved, rejected)
- **Time_Period_Selector**: A UI control allowing the user to toggle the time range of a chart (e.g., 3 months, 6 months, 12 months)
- **Mock_Data_Generator**: A utility that produces realistic time-series and categorical data arrays for charting purposes, seeded from existing hardcoded values
- **Role**: The current merchant role stored in localStorage under `demo_merchant_role`, one of: `both`, `receivable`, `payable`, `supplier-only`, `premium-buyer`, `premium-buyer-supplier`

## Requirements

### Requirement 1: Analytics Section Layout

**User Story:** As a merchant user, I want to see a dedicated analytics section on my dashboard below the existing stats grid, so that I can quickly understand trends and patterns in my financing activity.

#### Acceptance Criteria

1. THE Analytics_Section SHALL render on the Merchant Dashboard below the existing stats grid and above the module cards, separated by consistent vertical spacing matching existing section gaps
2. THE Analytics_Section SHALL use a responsive grid layout: two columns on viewports 1024px and above, single column below 1024px
3. IF the user's Role is `supplier-only`, `premium-buyer`, or `premium-buyer-supplier`, THEN THE Analytics_Section SHALL not be rendered
4. THE Analytics_Section SHALL contain a heading with the text "Insights & Analytics" styled using `text-lg font-semibold text-gray-900` with `mb-4` spacing, consistent with existing dashboard section headings

### Requirement 2: Invoice Volume Trend Chart

**User Story:** As a merchant, I want to see a chart of my invoice submission volume over time, so that I can identify trends and seasonality in my financing usage.

#### Acceptance Criteria

1. THE Invoice_Volume_Chart SHALL display monthly invoice counts as a line chart with area fill, with the X-axis showing abbreviated month labels (e.g., "Jan", "Feb") and the Y-axis showing integer invoice counts starting from zero
2. THE Invoice_Volume_Chart SHALL include a Time_Period_Selector with options: 3 months, 6 months, 12 months (default: 6 months)
3. IF the Role is `receivable` or `both`, THEN THE Invoice_Volume_Chart SHALL show a receivable invoice volume series
4. IF the Role is `payable` or `both`, THEN THE Invoice_Volume_Chart SHALL show a payable invoice volume series
5. IF the Role is `both`, THEN THE Invoice_Volume_Chart SHALL display two series (receivable and payable) differentiated by the project colour tokens: blue-600 for receivable and indigo-500 for payable
6. THE Invoice_Volume_Chart SHALL use the ChartContainer component with a ChartConfig that defines series keys, display labels, and colour values for each visible series
7. WHEN the user hovers over a data point, THE Invoice_Volume_Chart SHALL display a tooltip showing the full month name, series name, and invoice count as an integer
8. IF no invoice data exists for the selected time period, THEN THE Invoice_Volume_Chart SHALL display an empty state message indicating no invoices were submitted during the selected period

### Requirement 3: Credit Utilisation Over Time Chart

**User Story:** As a merchant, I want to visualise how my credit limit utilisation has changed month-over-month, so that I can plan my financing capacity.

#### Acceptance Criteria

1. THE Credit_Utilisation_Chart SHALL display monthly utilisation amounts as a stacked area chart showing receivable and payable portions
2. THE Credit_Utilisation_Chart SHALL include a horizontal reference line at the approved credit limit (AED 8,000,000) labelled "Approved Limit"
3. WHEN the Role is `receivable`, THE Credit_Utilisation_Chart SHALL show only the receivable utilisation series using green-500 colour
4. WHEN the Role is `payable`, THE Credit_Utilisation_Chart SHALL show only the payable utilisation series using amber-500 colour
5. WHEN the Role is `both`, THE Credit_Utilisation_Chart SHALL show both series stacked with green-500 for receivable and amber-500 for payable
6. THE Credit_Utilisation_Chart SHALL include a Time_Period_Selector with options: 3 months, 6 months, 12 months (default: 6 months)
7. THE Credit_Utilisation_Chart SHALL format Y-axis values in abbreviated currency with AED prefix (e.g., "AED 2M", "AED 4M", "AED 8M")
8. WHEN the user hovers over a data point, THE Credit_Utilisation_Chart SHALL display a tooltip showing the month name, receivable amount, payable amount, and total utilisation formatted in full AED currency

### Requirement 4: Financing Cost Breakdown Chart

**User Story:** As a merchant, I want to see my monthly financing costs broken down by flat fee and VAT, so that I can track my cost of financing over time.

#### Acceptance Criteria

1. THE Financing_Cost_Chart SHALL display monthly costs as a grouped bar chart with separate bars for flat fee and VAT amounts
2. IF the Role is `receivable`, `payable`, or `both`, THEN THE Financing_Cost_Chart SHALL be rendered; otherwise it SHALL not be rendered
3. THE Financing_Cost_Chart SHALL include a Time_Period_Selector with options: 3 months, 6 months (default: 6 months)
4. THE Financing_Cost_Chart SHALL format Y-axis values in AED currency with abbreviated notation using K for thousands and M for millions (e.g., "AED 1.5K", "AED 2M")
5. WHEN the user hovers over a bar in the Financing_Cost_Chart, THE Financing_Cost_Chart SHALL display a tooltip showing the month name, flat fee amount in full AED format (e.g., "AED 12,000.00"), VAT amount in full AED format, and total cost in full AED format
6. THE Financing_Cost_Chart SHALL derive mock fee amounts using the existing PRICING_MATRIX with borrower category "B", bullet repayment structure, and 90-day tenure (flat fee rate of 3%) plus 5% VAT on the flat fee
7. IF the selected time period contains no financing cost data, THEN THE Financing_Cost_Chart SHALL display an empty state message indicating no financing costs are available for the selected period

### Requirement 5: Supplier Distribution Chart

**User Story:** As a merchant with payable invoices, I want to see how my invoice volume is distributed across suppliers, so that I can understand supplier concentration risk.

#### Acceptance Criteria

1. THE Supplier_Distribution_Chart SHALL display invoice amount distribution across suppliers as a donut chart using the ChartContainer component
2. IF the Role is `payable` or `both`, THEN THE Supplier_Distribution_Chart SHALL be rendered visible within the Analytics_Section
3. IF the merchant has more than 5 suppliers, THEN THE Supplier_Distribution_Chart SHALL show the top 5 suppliers by total invoice amount and group all remaining suppliers into a single segment labelled "Others"
4. IF the merchant has 5 or fewer suppliers, THEN THE Supplier_Distribution_Chart SHALL display one segment per supplier with no "Others" segment
5. THE Supplier_Distribution_Chart SHALL display the total financed amount in the centre of the donut formatted in AED with abbreviated notation (e.g., "AED 2.4M")
6. THE Supplier_Distribution_Chart SHALL display a legend below the chart showing each supplier name and their percentage share of total invoice amount, rounded to 1 decimal place
7. WHEN the user hovers over a donut segment, THE Supplier_Distribution_Chart SHALL display a tooltip showing the supplier name, invoice amount in AED, and percentage share rounded to 1 decimal place

### Requirement 6: Invoice Status Pipeline Chart

**User Story:** As a merchant, I want to see the distribution of my invoices across different statuses at a glance, so that I can understand my portfolio health and follow up on pending items.

#### Acceptance Criteria

1. THE Invoice_Status_Pipeline SHALL display a horizontal stacked bar showing counts of invoices in each status: pending, refer, approved, rejected
2. THE Invoice_Status_Pipeline SHALL use distinct colours for each status: orange-500 for pending, blue-500 for refer, green-500 for approved, red-500 for rejected
3. IF the Role is `receivable` or `both`, THEN THE Invoice_Status_Pipeline SHALL include receivable invoice status counts
4. IF the Role is `payable` or `both`, THEN THE Invoice_Status_Pipeline SHALL include payable invoice status counts
5. IF the Role is `both`, THEN THE Invoice_Status_Pipeline SHALL aggregate counts from both receivable and payable invoices into a single combined stacked bar
6. THE Invoice_Status_Pipeline SHALL display the total invoice count and percentage for each status segment as a label, with percentages rounded to 1 decimal place
7. WHEN the user hovers over a status segment, THE Invoice_Status_Pipeline SHALL display a tooltip showing the status name, count, and percentage of total rounded to 1 decimal place
8. IF there are zero invoices across all statuses, THEN THE Invoice_Status_Pipeline SHALL display an empty state message indicating no invoice data is available

### Requirement 7: Role-Based Chart Visibility

**User Story:** As a platform administrator, I want analytics charts to respect role-based access, so that merchants only see data relevant to their financing products.

#### Acceptance Criteria

1. WHEN the Role is `receivable`, THE Analytics_Section SHALL display exactly four charts: Invoice_Volume_Chart (receivable series only), Credit_Utilisation_Chart (receivable series only), Financing_Cost_Chart, and Invoice_Status_Pipeline
2. WHEN the Role is `payable`, THE Analytics_Section SHALL display exactly five charts: Invoice_Volume_Chart (payable series only), Credit_Utilisation_Chart (payable series only), Financing_Cost_Chart, Supplier_Distribution_Chart, and Invoice_Status_Pipeline
3. WHEN the Role is `both`, THE Analytics_Section SHALL display all five chart types where Invoice_Volume_Chart and Credit_Utilisation_Chart display both receivable and payable series, Supplier_Distribution_Chart displays payable supplier data, and Financing_Cost_Chart and Invoice_Status_Pipeline include data from both financing products
4. WHEN the Role is `supplier-only`, THE Analytics_Section SHALL not be rendered
5. WHEN the Role is `premium-buyer` or `premium-buyer-supplier`, THE Analytics_Section SHALL not be rendered on the standard Merchant Dashboard
6. WHEN the Role changes via the demo panel, THE Analytics_Section SHALL re-render with the correct chart set for the new role within 1 second without triggering a full page reload
7. WHEN the Analytics_Section is rendered for a given Role, THE Analytics_Section SHALL NOT display any chart type that is not listed in the allowed set for that Role as defined in criteria 1 through 3

### Requirement 8: Mock Data Generation

**User Story:** As a developer, I want a consistent mock data generator for all analytics charts, so that the prototype displays realistic and visually meaningful data.

#### Acceptance Criteria

1. THE Mock_Data_Generator SHALL produce time-series data arrays with monthly granularity for a configurable number of trailing months (3, 6, or 12), where each data point includes the month label in "MMM YYYY" format and the corresponding numeric value
2. THE Mock_Data_Generator SHALL generate invoice volume data starting from a baseline of 20 invoices per month for the earliest month, trending upward at approximately 5% compounded monthly growth, with per-month variance of ±15% from the trend line applied deterministically
3. THE Mock_Data_Generator SHALL generate credit utilisation data where the combined receivable and payable portions never exceed the approved limit of AED 8,000,000, with the receivable portion representing 60% and the payable portion representing 40% of total utilisation
4. THE Mock_Data_Generator SHALL generate financing cost data derived from volume data using the existing PRICING_MATRIX with category "B" and bullet repayment at 90-day tenure (3% flat fee) plus 5% VAT on the flat fee
5. THE Mock_Data_Generator SHALL generate supplier distribution data for 6 named suppliers with amounts that sum to the current month's payable utilisation value (40% of total utilisation), distributed with the largest supplier receiving no more than 30% of the total and the smallest receiving no less than 5%
6. THE Mock_Data_Generator SHALL use deterministic seed values so that the same data appears across page refreshes (no random variance between renders)
7. WHEN the Time_Period_Selector value changes, THE Mock_Data_Generator SHALL return only the data points corresponding to the selected trailing month count (3, 6, or 12) counted backward from the current month

### Requirement 9: Chart Interactions and Responsiveness

**User Story:** As a merchant user, I want the analytics charts to be interactive and responsive, so that I can explore data details and use the dashboard on any device.

#### Acceptance Criteria

1. WHEN the user hovers over a data point on any chart, THE system SHALL display a styled tooltip using ChartTooltipContent from the existing chart.tsx component
2. THE Chart_Card components SHALL maintain a minimum height of 280px to ensure chart readability
3. WHILE the viewport width is below 768px, THE Chart_Card components SHALL stack in a single column and reduce their minimum height to 220px
4. THE charts SHALL animate on initial render with a fade-in transition (duration 300ms)
5. THE Time_Period_Selector SHALL render as a segmented button group (using shadcn/ui toggle or button styling) positioned in the top-right of the Chart_Card header, with the active segment visually distinguished using `bg-gray-800 text-white` styling
6. WHEN the Time_Period_Selector value changes, THE chart SHALL re-render with the new data range with a 300ms transition
7. ON touch devices, WHEN the user taps a data point, THE system SHALL display the tooltip and dismiss it when the user taps elsewhere on the chart area

### Requirement 10: Visual Design Consistency

**User Story:** As a designer, I want the analytics section to visually integrate with the existing dashboard design system, so that it feels like a native part of the application.

#### Acceptance Criteria

1. THE Chart_Card SHALL use the existing card pattern: `bg-white border border-gray-200 rounded-lg` with internal padding of `p-5` matching the existing module card pattern
2. THE Chart_Card title SHALL use `text-base font-semibold text-gray-900` styling
3. THE chart colour palette SHALL use the project's existing colour tokens: blue-600 for primary series, green-500 for positive/approved, orange-500 for pending/warning, red-500 for rejected/negative, indigo-500 for secondary series
4. THE Chart_Card SHALL include a subtle shadow on hover (`hover:shadow-md transition-shadow`) matching the existing module card pattern
5. THE Analytics_Section heading SHALL use `text-lg font-semibold text-gray-900` with `mb-4` spacing, consistent with other dashboard section headings
6. WHILE a Chart_Card is loading data, THE Chart_Card SHALL display a centered loading indicator within the card container, preserving the card's minimum height and border styling
