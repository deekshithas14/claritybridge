import { PresetExample } from './types';

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: 'medical-eob',
    title: 'Medical Explanation of Benefits (EOB)',
    category: 'Healthcare & Insurance',
    tag: 'Hospital / Clinic',
    description: 'Cryptic billing statement with CPT codes, deductible allocations, and an ambiguous "not a bill" disclaimer.',
    text: `HEALTHSHIELD MUTUAL ASSURANCE CORP.
EXPLANATION OF BENEFITS (EOB) - THIS IS NOT A BILL
Member ID: W84920481-01 | Group #: GR-99412
Patient: Jane Doe | Claim Ref #: CLM-2025-089192
Provider: St. Jude Regional Ambulatory Center | Date of Service: 09/14/2025

Service Line Detail:
Line 1 | Code: CPT-99214 (Office/Outpatient Visit, Mod Complexity)
  Billed Charges: $385.00
  Contracted Allowance: $185.00
  Ineligible / Contract Discount: $200.00 (PR-45: Charges exceed fee schedule)
  Plan Paid: $148.00 (80% coinsurance after deductible)
  Member Deductible Applied: $0.00 (Annual in-network deductible met: $1,500/$1,500)
  Member Coinsurance (20%): $37.00

Line 2 | Code: CPT-80053 (Comprehensive Metabolic Panel)
  Billed Charges: $210.00
  Contracted Allowance: $62.00
  Ineligible / Contract Discount: $148.00
  Plan Paid: $49.60
  Member Coinsurance (20%): $12.40

Line 3 | Code: CPT-71046 (Radiologic Exam Chest 2 Views)
  Billed Charges: $520.00
  Contracted Allowance: $0.00 (DENIED: CO-197: Pre-authorization required but not documented in clearinghouse)
  Ineligible / Discount: $0.00
  Plan Paid: $0.00
  Patient Responsibility: $520.00 pending provider appeal

Summary:
Total Provider Billed: $1,115.00
Plan Total Payment: $197.60
Total Ineligible / Network Savings: $348.00
Estimated Patient Responsibility: $569.40 ($49.40 standard coinsurance + $520.00 pending authorization appeal)

IMPORTANT NOTICE TO PATIENT: If Line 3 pre-authorization is resubmitted by provider within 45 days (deadline: 10/29/2025), patient responsibility will reduce to $28.00 in-network allowance. Do NOT pay hospital direct invoice until final adjustment statement is mailed.`
  },
  {
    id: 'lease-renewal',
    title: 'Landlord Rent Increase & Renewal Notice',
    category: 'Housing & Real Estate',
    tag: 'Lease Agreement',
    description: 'High-pressure notice with rent hike, mandatory response deadlines, month-to-month penalties, and deposit top-ups.',
    text: `VALLEY CREST RESIDENTIAL PROPERTIES LLC
FORMAL NOTICE OF LEASE EXPIRATION AND TERMS AMENDMENT
Date: October 2, 2025
To Resident: Alex Rivera, Unit 4B, 1842 Elmhurst Way

Dear Resident:
Your current fixed-term residential lease expires at 11:59 PM on November 30, 2025. Pursuant to Section 18(b) of your agreement, Management hereby offers renewal under the following modified covenants:

1. RENEWAL TERM & RENT ADJUSTMENT:
- Option A (12-Month Extension: Dec 1, 2025 - Nov 30, 2026): Base monthly rent adjusted to $2,350.00/month (a 9.3% increase from current rate of $2,150.00).
- Option B (Month-to-Month Holdover): $2,750.00/month plus a recurring $150.00 monthly administrative holdover surcharge.

2. SECURITY DEPOSIT ADJUSTMENT:
Under Section 5.3, the security deposit must equal exactly one month's current base rent. Upon selecting Option A, resident must remit a supplemental deposit balance of $200.00 concurrently with signature execution.

3. MANDATORY RESPONSE WINDOW:
Resident must return written countersigned renewal form or formal 60-Day Notice to Vacate on or before 5:00 PM on October 25, 2025. 
WARNING: Failure to respond by October 25, 2025 will result in automatic default into Option B (Month-to-Month at $2,900.00 total) commencing December 1, 2025, and forfeiture of preferred renewal concessions.

4. ANCILLARY AMENDMENTS:
Reserved carport parking fee increased from $50/mo to $75/mo effective December 1. Proof of active Renter's Liability Insurance ($100,000 minimum naming Valley Crest as Interested Party) must be re-uploaded to resident portal prior to November 15.`
  },
  {
    id: 'parking-citation',
    title: 'City Municipal Citation & Penalty Warning',
    category: 'Government & Legal',
    tag: 'Notice of Violation',
    description: 'Official violation notice with compounding late fees, court hearing deadlines, and vehicle registration hold threat.',
    text: `DEPARTMENT OF TRANSPORTATION - PARKING VIOLATIONS BUREAU
OFFICIAL NOTICE OF TRAFFIC CODE INFRACTION & DELINQUENT ASSESSMENT
Citation No: PV-2025-9831002 | Issue Date: 09/28/2025
Vehicle Reg: 7XYZ491 (State: CA) | Make/Model: Silver Honda Civic
Location of Infraction: 400 Block S. Spring St (Meter Post 412-B)

VIOLATION CHARGES:
Code Section 80.56.1 MC - Expired Meter in Designated Commercial Loading & Express Zone
Base Fine: $73.00
State Courthouse Surcharge (SB 1407): $12.50
County Jail Construction Fund: $9.50
Immediate Total Assessed: $95.00

PAYMENT OR CONTEST DEADLINES:
- Standard Payment Deadline: October 19, 2025 (21 calendar days from issue date).
- If unpaid by 10/19/2025: A mandatory late penalty of $45.00 will be added (Total: $140.00).
- If unpaid by 11/15/2025 (45 days delinquent): An additional second-tier penalty of $60.00 will attach (Total: $200.00), and a Notice of Non-Renewal will be electronically dispatched to the Department of Motor Vehicles (DMV), blocking vehicle registration renewal.

CONTESTING THE CITATION:
You have the right to an Initial Administrative Review at no cost. You must submit written dispute with photographic evidence or proof of valid mobile payment session via www.cityparkingcitations.gov/dispute OR postmarked to PVB Box 3014 before October 19, 2025. Verbal disputes over telephone will NOT toll statutory deadline.`
  },
  {
    id: 'freelance-contract',
    title: 'Confusing Contractor Agreement & IP Clause',
    category: 'Business & Contracts',
    tag: 'Legal Agreement',
    description: 'Contract with aggressive non-compete, perpetual assignment of unrelated IP, and 90-day certified mail exit traps.',
    text: `MASTER PROFESSIONAL SERVICES AGREEMENT (MPSA)
Client: Apex Global Media Inc. | Contractor: Independent Service Provider

Section 7. Intellectual Property & Work Product Assignment
"Contractor hereby irrevocably grants, assigns, and transfers to Client in perpetuity, worldwide, all right, title, and interest in and to all inventions, software code, designs, documentation, and ideas conceived, reduced to practice, or developed by Contractor during the term of this Agreement, whether or not developed during working hours or using Client facilities, provided such items relate generally to digital content, publishing, or artificial intelligence systems."

Section 11. Termination and Exit Notice Requirements
"Either party may terminate this Agreement without cause upon ninety (90) days' prior written notice. Notice shall be deemed valid only if dispatched via Registered or Certified Mail with return receipt requested to Client's Corporate Legal Department in Wilmington, Delaware. Electronic mail or verbal communication shall not constitute legal notice. If Contractor discontinues active milestone delivery during the 90-day notice window, Client reserves the right to withhold any unbilled fees accrued within the preceding billing cycle as liquidated damages."

Section 14. Non-Solicitation and Restrictive Covenant
"For a period of twenty-four (24) months following termination of this Agreement for any reason, Contractor shall not directly or indirectly provide consulting, advisory, or software development services to any entity operating in competitive line of business with Client within North America."`
  }
];
