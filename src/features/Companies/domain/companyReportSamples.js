/**
 * Made-up preview rows for the Company Reports tab. Not event data: they only show the shape
 * of each report. Column names match the EA CSV headers (company/helpers/*).
 */
export const COMPANY_REPORT_SAMPLES = {
  company_metrics: {
    columns: ['Metric', 'Value', 'Detail'],
    rows: [
      ['Parent exhibitors', '312 exhibitors', ''],
      ['Co-exhibitors', '117 exhibitors', ''],
      ['Handover', '280 companies', '264 marked handed over'],
      ['Water coupons', '1,240 coupons', '206 companies'],
      ['Print badges', '1,860 badges', '298 companies'],
    ],
  },
  exhibitor_csv: {
    columns: [
      'Name of POC', 'Email of POC', 'Company Name', 'OBF Number', 'Stall Number',
      'Company profile', 'Co Exhibitor No', 'No. Exhibitor Team members', 'Badge Used',
      'Badge Limit', 'Profile Locked', 'Badge Printed',
    ],
    rows: [
      ['Priya Sharma', 'priya@bluewave.example', 'Bluewave Holidays', 'WT101', 'C-12', 'Yes', '2', '6', '8', '24', 'Yes', 'Yes'],
      ['Daniel Ortiz', 'dan@sunpath.example', 'Sunpath Tours', 'WT207', 'B-04', 'No', '0', '3', '3', '12', 'No', 'No'],
    ],
  },
  company_export: {
    columns: [
      'Company Name', 'Website', 'Stall Number', 'Category', 'Product', 'Parent Exhibitor',
      'Space Type', 'Fascia Detail', 'Additional Requirements', 'Invitees Count',
    ],
    rows: [
      ['Bluewave Holidays', 'bluewave.example', 'C-12', 'Tour Operator', 'Cruise, MICE', '', 'Shell', 'BLUEWAVE HOLIDAYS', '(Chair-4), (Table-1)', '40'],
      ['Coral Stays', 'coralstays.example', 'C-12', 'Accommodation', 'Hotels / Resorts', 'Bluewave Holidays', '', '', '', '5'],
    ],
  },
  engagement_csv: {
    columns: [
      'Company Name', 'OBF Number', 'Parent Exhibitor (Yes/No)', 'Registered Email', 'POC Logged In',
      'Salesperson', 'Matchmaking Completed', 'Team Members Added', 'Total Invites Sent',
      'Which regions do you serve?',
    ],
    rows: [
      ['Bluewave Holidays', 'WT101', 'Yes', 'priya@bluewave.example', 'Yes', 'Asha K.', 'Yes', '6', '40', 'Europe, Asia'],
      ['Coral Stays', 'WT101', 'No', 'ops@coralstays.example', 'No', 'Asha K.', 'No', '1', '0', ''],
    ],
  },
  invitee_report: {
    columns: [
      'Company ID', 'Company Name', 'POC Added', 'POC Logged In', 'POC First Login', 'Team Members Count',
      'Invitee Count', 'Hosted Buyer Invites', 'Total Invites', 'Parent Exhibitor ID',
    ],
    rows: [
      ['10122', 'Bluewave Holidays', 'true', 'true', '14:05-12/10/2026', '6', '40', '12', '52', ''],
      ['10187', 'Sunpath Tours', 'true', 'false', '', '3', '0', '0', '0', ''],
      ['10203', 'Coral Stays', 'true', 'true', '09:40-15/10/2026', '1', '5', '0', '5', '10122'],
    ],
  },
  ar_orders: {
    columns: [
      'Order ID', 'Company Name', 'OBF Number', 'Order Date', 'Product Name', 'Quantity',
      'Unit Price', 'Total Price', 'Payment Mode', 'Status', 'Billing Name',
    ],
    rows: [
      ['AR_8KQ2', 'Bluewave Holidays', 'WT101', '14/10/26 11:20', 'Extra chair', '4', '15', '60', 'Online', 'paid', 'Bluewave Holidays LLC'],
      ['AR_9TX7', 'Sunpath Tours', 'WT207', '15/10/26 09:02', 'Power socket', '1', '40', '40', 'Pay later', 'pay_later', 'Sunpath Tours Inc'],
    ],
  },
};
