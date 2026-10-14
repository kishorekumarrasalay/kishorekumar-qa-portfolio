/**
 * QA Defect & Automation Playground — Central Shared Data Source
 * Single source of truth for:
 *  - Project metadata (NSO & HiKode)
 *  - Simulated bugs & defect lifecycle states
 *  - API specifications & negative testing suites
 *  - Test Case Explorer & Traceability Matrix
 *  - Heatmap coverage, status code challenge, and metrics
 *
 * NOTE: All data is SANITIZED MOCK DATA inspired by Kishore's QA testing workflows.
 * No real company secrets, customer PII, or internal endpoints are used.
 */

export type ProjectKey = "nso" | "hikode";

export type DefectSeverity = "Critical" | "High" | "Medium" | "Low";
export type DefectPriority = "P1" | "P2" | "P3";
export type DefectStatus = "Open" | "In Progress" | "Fixed" | "Retested" | "Closed";
export type DifficultyLevel = "Easy" | "Medium" | "Hard";
export type TestCaseType = "Positive" | "Negative" | "Edge";

export interface ProjectConfig {
  key: ProjectKey;
  name: string;
  tagline: string;
  domainUrl: string;
  moduleNames: string[];
  description: string;
}

export interface DefectItem {
  id: string;
  project: ProjectKey;
  title: string;
  description: string;
  module: string;
  severity: DefectSeverity;
  priority: DefectPriority;
  status: DefectStatus;
  difficulty: DifficultyLevel;
  difficultyCategory: "UI" | "Calculation / Logic" | "Security / Session";
  suggestedLocator: string;
  elementLabel: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  isFound: boolean;
  isCustomReported?: boolean;
  prefilledPrompt: string;
}

export interface TestCaseItem {
  id: string;
  project: ProjectKey;
  module: string;
  scenario: string;
  steps: string[];
  expectedResult: string;
  priority: DefectPriority;
  type: TestCaseType;
  linkedRequirementId: string;
  linkedBugId?: string;
  manualSnippet?: string;
  playwrightSnippet?: string;
}

export interface TraceabilityNode {
  requirementId: string;
  requirementTitle: string;
  project: ProjectKey;
  testCaseIds: string[];
  bugIds: string[];
}

export interface ModuleCoverage {
  module: string;
  project: ProjectKey;
  testCaseCount: number;
  bugsFound: number;
  totalBugs: number;
  coverageScore: number; // 0-100%
}

export interface NegativeTestScenario {
  id: string;
  title: string;
  project: ProjectKey;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;
  expectedStatus: number;
  payloadDescription: string;
  samplePayload?: Record<string, unknown>;
  expectedErrorMessage: string;
}

export interface ChallengeQuestion {
  id: string;
  scenario: string;
  options: {
    code: number;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  topic: string;
}

export interface PostmanRequestItem {
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;
  description: string;
  tests: string[];
}

export interface PostmanFolder {
  name: string;
  requests: PostmanRequestItem[];
}

export interface PostmanCollectionTree {
  project: ProjectKey;
  collectionName: string;
  folders: PostmanFolder[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECT DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS: Record<ProjectKey, ProjectConfig> = {
  nso: {
    key: "nso",
    name: "NSO — Belgian Waffle Supply Chain",
    tagline: "Quick-service supply & online waffle ordering engine",
    domainUrl: "https://mock-supply.belgianwaffle.nso.internal",
    moduleNames: ["Cart & Pricing", "Inventory", "Checkout", "Billing / Tax"],
    description: "Mock order-fulfillment and franchise cart module. Features multi-item carts, coupon calculations, and inventory reservations.",
  },
  hikode: {
    key: "hikode",
    name: "HiKode — Job Application Platform",
    tagline: "Tech hiring & candidate screening portal",
    domainUrl: "https://mock-portal.hikode.careers.internal",
    moduleNames: ["Job Search", "Application Flow", "Profile Settings", "Session & Auth"],
    description: "Mock candidate recruitment platform. Features role discovery, resume uploads, candidate profile management, and authentication.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFECT BOARD / BUG SCENARIOS
// ─────────────────────────────────────────────────────────────────────────────

export const INITIAL_BUGS: DefectItem[] = [
  // NSO BUGS (5 total)
  {
    id: "BUG-NSO-01",
    project: "nso",
    title: "Order quantity input accepts 0 and negative values without validation",
    description: "Cart quantity input field allows entering 0 or negative numbers (e.g. -2), leading to negative totals and invalid order payloads.",
    module: "Cart & Pricing",
    severity: "High",
    priority: "P1",
    status: "Open",
    difficulty: "Easy",
    difficultyCategory: "UI",
    suggestedLocator: "page.getByRole('spinbutton', { name: 'Item Quantity' })",
    elementLabel: "Quantity Input [-2 / 0]",
    stepsToReproduce: [
      "Select 'Classic Belgian Waffle' item in menu",
      "Focus quantity field and input '-3' or decrement past 1",
      "Observe cart total reduces inappropriately",
    ],
    expectedBehavior: "Quantity input has min='1' constraint; attempts to enter <= 0 are rejected with an inline validation alert.",
    actualBehavior: "System accepts non-positive integers and reduces payable subtotal.",
    isFound: false,
    prefilledPrompt: "Could you explain why client-side and API validation must both restrict quantity inputs to positive integers for BUG-NSO-01?",
  },
  {
    id: "BUG-NSO-02",
    project: "nso",
    title: "Available inventory stock count does not reduce after order confirmation",
    description: "Submitting a confirmed purchase succeeds, but remaining inventory stock counter remains static at 48 units instead of decrementing.",
    module: "Inventory",
    severity: "High",
    priority: "P2",
    status: "Open",
    difficulty: "Medium",
    difficultyCategory: "Calculation / Logic",
    suggestedLocator: "page.getByRole('status', { name: 'Stock Count' })",
    elementLabel: "Inventory Counter (Static 48 units)",
    stepsToReproduce: [
      "Note current stock counter is 48 units",
      "Add 5 waffles and click 'Place Order'",
      "Observe stock counter after confirmation popup",
    ],
    expectedBehavior: "Stock decrements by ordered quantity immediately upon order confirmation (48 -> 43).",
    actualBehavior: "Stock counter stays unchanged at 48 units, allowing inventory overselling.",
    isFound: false,
    prefilledPrompt: "How would you automate a test in Playwright to assert that inventory decrements correctly after BUG-NSO-02 order placement?",
  },
  {
    id: "BUG-NSO-03",
    project: "nso",
    title: "Duplicate order placed when double-clicking 'Place Order' button rapidly",
    description: "The 'Place Order' submit button lacks debouncing / disable-on-click, triggering two separate order creation requests in rapid succession.",
    module: "Checkout",
    severity: "Critical",
    priority: "P1",
    status: "Open",
    difficulty: "Medium",
    difficultyCategory: "Calculation / Logic",
    suggestedLocator: "page.getByRole('button', { name: 'Place Order' })",
    elementLabel: "Place Order Button (Un-debounced)",
    stepsToReproduce: [
      "Add any item to cart",
      "Double click 'Place Order' button quickly within 200ms",
      "Check generated order receipts",
    ],
    expectedBehavior: "Button becomes disabled on first click with a loading spinner; idempotent token prevents duplicate orders.",
    actualBehavior: "Two identical order IDs are generated and customer is charged twice.",
    isFound: false,
    prefilledPrompt: "What is an idempotency key and how does it prevent duplicate orders like BUG-NSO-03 in payment/checkout APIs?",
  },
  {
    id: "BUG-NSO-04",
    project: "nso",
    title: "GST tax calculated on pre-discount subtotal instead of discounted amount",
    description: "Applying a ₹100 discount coupon does not adjust the GST 5% calculation base; tax is computed on gross ₹400 rather than net ₹300.",
    module: "Billing / Tax",
    severity: "Medium",
    priority: "P2",
    status: "Open",
    difficulty: "Medium",
    difficultyCategory: "Calculation / Logic",
    suggestedLocator: "page.getByTestId('tax-amount')",
    elementLabel: "Tax Calculation Row (₹20.00 instead of ₹15.00)",
    stepsToReproduce: [
      "Add items totaling ₹400",
      "Apply coupon 'WAFFLE100' (Discount: ₹100)",
      "Inspect 5% tax row",
    ],
    expectedBehavior: "5% GST is computed on discounted taxable value ₹300 = ₹15.00.",
    actualBehavior: "5% GST computed on gross total ₹400 = ₹20.00, overcharging customer by ₹5.",
    isFound: false,
    prefilledPrompt: "How can QA engineers write boundary value and equivalence partitioning tests for discount and tax calculations (BUG-NSO-04)?",
  },
  {
    id: "BUG-NSO-05",
    project: "nso",
    title: "Cart total calculation ignores fractional decimal currency precision",
    description: "When adding items priced with decimals (e.g. ₹199.99 x 3), integer truncation displays ₹597.00 instead of the mathematically correct ₹599.97.",
    module: "Cart & Pricing",
    severity: "High",
    priority: "P2",
    status: "Open",
    difficulty: "Easy",
    difficultyCategory: "UI",
    suggestedLocator: "page.getByTestId('cart-total-price')",
    elementLabel: "Cart Total Price Display (₹597.00)",
    stepsToReproduce: [
      "Add 3 x Nutella Waffles priced at ₹199.99 each",
      "View Cart summary total row",
      "Check formatted sum",
    ],
    expectedBehavior: "Cart displays ₹599.97 using two decimal places.",
    actualBehavior: "Cart truncates each unit price before multiplying, showing ₹597.00.",
    isFound: false,
    prefilledPrompt: "Why do floating point precision bugs happen in e-commerce apps and what standard formatting library should prevent BUG-NSO-05?",
  },

  // HIKODE BUGS (5 total)
  {
    id: "BUG-HK-01",
    project: "hikode",
    title: "'Apply Now' button allows multiple duplicate submissions for the same job",
    description: "After successfully applying to 'Senior QA Automation Engineer', the button remains enabled, allowing candidates to re-submit repeatedly.",
    module: "Application Flow",
    severity: "High",
    priority: "P1",
    status: "Open",
    difficulty: "Medium",
    difficultyCategory: "Calculation / Logic",
    suggestedLocator: "page.getByRole('button', { name: 'Apply Now' })",
    elementLabel: "Apply Now Button (Stays active after submission)",
    stepsToReproduce: [
      "Open job 'Senior QA Automation Engineer'",
      "Click 'Apply Now' and accept prompt",
      "Notice button is still clickable; click it again",
    ],
    expectedBehavior: "Button changes to 'Applied' (disabled) with an application date badge.",
    actualBehavior: "Button triggers a second POST request, creating duplicate candidate records.",
    isFound: false,
    prefilledPrompt: "How do you test UI state transitions in Playwright to verify a button changes from 'Apply Now' to disabled 'Applied' (BUG-HK-01)?",
  },
  {
    id: "BUG-HK-02",
    project: "hikode",
    title: "Resume upload component accepts dangerous executable files (.exe / .bat)",
    description: "File picker lacks MIME type and extension whitelisting on client and API, allowing malicious executables like 'payload.exe' to be uploaded.",
    module: "Profile Settings",
    severity: "Critical",
    priority: "P1",
    status: "Open",
    difficulty: "Hard",
    difficultyCategory: "Security / Session",
    suggestedLocator: "page.getByLabel('Upload Resume')",
    elementLabel: "Resume File Dropzone (Accepts .exe)",
    stepsToReproduce: [
      "Navigate to Candidate Profile > Documents",
      "Select an executable file named 'update_patch.exe'",
      "Observe upload progresses without validation rejection",
    ],
    expectedBehavior: "Upload rejects non-document formats (.pdf, .docx only) with error 'Invalid file format'.",
    actualBehavior: "Executable uploads successfully and returns 200 OK.",
    isFound: false,
    prefilledPrompt: "What security risks does an unvalidated file upload present and how should QA test file validation (BUG-HK-02)?",
  },
  {
    id: "BUG-HK-03",
    project: "hikode",
    title: "Job search query filter clears when navigating back via browser history",
    description: "Searching for 'Automation' and opening a job details card resets search state and filters upon clicking the browser Back button.",
    module: "Job Search",
    severity: "Low",
    priority: "P3",
    status: "Open",
    difficulty: "Easy",
    difficultyCategory: "UI",
    suggestedLocator: "page.getByPlaceholder('Search jobs by title...')",
    elementLabel: "Search Input (Filter lost on Back)",
    stepsToReproduce: [
      "Type 'Playwright' in search box",
      "Click on second search result",
      "Click browser 'Back' button",
    ],
    expectedBehavior: "Search term 'Playwright' is preserved via URL query params (`?q=Playwright`).",
    actualBehavior: "Input reverts to empty string and list resets to unfiltered default.",
    isFound: false,
    prefilledPrompt: "How do you write a Playwright test to verify browser history navigation and URL query persistence for BUG-HK-03?",
  },
  {
    id: "BUG-HK-04",
    project: "hikode",
    title: "User session remains active in cache after explicit logout when hitting Back",
    description: "Logging out does not invalidate cached authenticated state in browser session; clicking browser back reveals cached private profile data.",
    module: "Session & Auth",
    severity: "Critical",
    priority: "P1",
    status: "Open",
    difficulty: "Hard",
    difficultyCategory: "Security / Session",
    suggestedLocator: "page.getByRole('button', { name: 'Sign Out' })",
    elementLabel: "Logout Button (Cache-control leak on Back)",
    stepsToReproduce: [
      "Log into HiKode candidate portal",
      "Click 'Sign Out'",
      "Click browser back button",
    ],
    expectedBehavior: "Page forces redirect to /login due to Cache-Control: no-store and invalidated auth cookie.",
    actualBehavior: "Previous sensitive candidate screen renders from browser cache with active token.",
    isFound: false,
    prefilledPrompt: "Why is Cache-Control header testing essential in QA for session invalidation (BUG-HK-04)?",
  },
  {
    id: "BUG-HK-05",
    project: "hikode",
    title: "Clicking 'Remove Avatar' when no custom image uploaded triggers unhandled null crash",
    description: "When candidate profile has no uploaded avatar, clicking 'Remove Avatar' assumes avatar.url exists, causing a fatal unhandled TypeError.",
    module: "Profile Settings",
    severity: "Medium",
    priority: "P2",
    status: "Open",
    difficulty: "Medium",
    difficultyCategory: "Calculation / Logic",
    suggestedLocator: "page.getByRole('button', { name: 'Remove Avatar' })",
    elementLabel: "Remove Avatar Button (Throws TypeError on null)",
    stepsToReproduce: [
      "Create fresh candidate account with default placeholder avatar",
      "Go to Profile Settings",
      "Click 'Remove Avatar'",
    ],
    expectedBehavior: "Button is disabled when no avatar exists or notifies 'No custom avatar to remove'.",
    actualBehavior: "React crashes with 'TypeError: Cannot read properties of null (reading url)'.",
    isFound: false,
    prefilledPrompt: "What null-check best practices and negative test cases prevent crashes like BUG-HK-05 in frontend profile forms?",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEST CASE EXPLORER DATA
// ─────────────────────────────────────────────────────────────────────────────

export const TEST_CASES: TestCaseItem[] = [
  {
    id: "TC-NSO-001",
    project: "nso",
    module: "Cart & Pricing",
    scenario: "Verify cart item quantity enforces strictly positive integers",
    steps: [
      "Navigate to Waffle Menu page",
      "Select item 'Nutella Delight Waffle'",
      "Attempt to set quantity to '0' and '-2'",
      "Click 'Update Cart'",
    ],
    expectedResult: "Inline validation error appears: 'Quantity must be at least 1'. Subtotal remains unaffected.",
    priority: "P1",
    type: "Negative",
    linkedRequirementId: "REQ-NSO-01",
    linkedBugId: "BUG-NSO-01",
    manualSnippet: "Test Steps:\n1. Input -1 in quantity field\n2. Trigger onBlur\nExpected: Error banner shown, quantity resets to 1",
    playwrightSnippet: `test('rejects negative quantity input', async ({ page }) => {
  await page.goto('/menu');
  const qty = page.getByRole('spinbutton', { name: 'Item Quantity' });
  await qty.fill('-1');
  await page.getByRole('button', { name: 'Update Cart' }).click();
  await expect(page.getByText('Quantity must be at least 1')).toBeVisible();
});`,
  },
  {
    id: "TC-NSO-002",
    project: "nso",
    module: "Inventory",
    scenario: "Verify inventory stock decrements accurately upon order placement",
    steps: [
      "Record starting inventory level (e.g. 48 units)",
      "Add 3 units to shopping cart",
      "Complete checkout and receive confirmation ID",
      "Query inventory status endpoint or UI stock badge",
    ],
    expectedResult: "Inventory reflects exactly 45 units remaining (48 - 3).",
    priority: "P1",
    type: "Positive",
    linkedRequirementId: "REQ-NSO-02",
    linkedBugId: "BUG-NSO-02",
    manualSnippet: "Precondition: Stock = 48\nAction: Order 3\nExpected: Stock = 45",
    playwrightSnippet: `test('decrements inventory after order', async ({ page }) => {
  await page.goto('/checkout');
  const stockBefore = await page.getByTestId('stock-count').innerText();
  await page.getByRole('button', { name: 'Place Order' }).click();
  await expect(page.getByTestId('order-success')).toBeVisible();
  await expect(page.getByTestId('stock-count')).toHaveText('45 units');
});`,
  },
  {
    id: "TC-NSO-003",
    project: "nso",
    module: "Checkout",
    scenario: "Verify place order button debouncing prevents duplicate order submissions",
    steps: [
      "Add 1 item to cart and proceed to checkout",
      "Double click 'Place Order' within 150 milliseconds",
      "Inspect network traffic and confirmation view",
    ],
    expectedResult: "Only one HTTP POST is dispatched; button enters disabled pending state immediately.",
    priority: "P1",
    type: "Edge",
    linkedRequirementId: "REQ-NSO-03",
    linkedBugId: "BUG-NSO-03",
    manualSnippet: "Perform rapid double-click on Place Order button. Verify only 1 order ID returned.",
    playwrightSnippet: `test('prevents duplicate order on rapid double click', async ({ page }) => {
  const submitBtn = page.getByRole('button', { name: 'Place Order' });
  await submitBtn.dblclick();
  await expect(submitBtn).toBeDisabled();
  const orderReceipts = page.getByTestId('order-receipt');
  await expect(orderReceipts).toHaveCount(1);
});`,
  },
  {
    id: "TC-NSO-004",
    project: "nso",
    module: "Billing / Tax",
    scenario: "Verify 5% GST tax is computed on net discounted subtotal",
    steps: [
      "Add items totaling ₹400 to cart",
      "Apply promo coupon 'WAFFLE100' for ₹100 discount",
      "Inspect subtotal (₹300) and computed GST (₹15.00)",
    ],
    expectedResult: "Tax is calculated as 5% of ₹300 = ₹15.00. Grand total equals ₹315.00.",
    priority: "P2",
    type: "Positive",
    linkedRequirementId: "REQ-NSO-04",
    linkedBugId: "BUG-NSO-04",
    manualSnippet: "Subtotal: ₹400\nDiscount: ₹100\nTaxable: ₹300\nTax (5%): ₹15\nTotal: ₹315",
    playwrightSnippet: `test('calculates GST on discounted price', async ({ page }) => {
  await page.goto('/checkout');
  await page.getByPlaceholder('Promo Code').fill('WAFFLE100');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByTestId('tax-amount')).toHaveText('₹15.00');
  await expect(page.getByTestId('grand-total')).toHaveText('₹315.00');
});`,
  },
  {
    id: "TC-NSO-005",
    project: "nso",
    module: "Cart & Pricing",
    scenario: "Verify currency decimal precision is preserved on fractional prices",
    steps: [
      "Add 3 items priced at ₹199.99 each",
      "Inspect cart summary total line",
    ],
    expectedResult: "Total correctly computes to ₹599.97 without integer rounding truncation.",
    priority: "P2",
    type: "Edge",
    linkedRequirementId: "REQ-NSO-01",
    linkedBugId: "BUG-NSO-05",
    manualSnippet: "Add 3 x ₹199.99. Total must be ₹599.97 (not ₹597.00).",
    playwrightSnippet: `test('preserves two decimal places in total', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByTestId('cart-total-price')).toHaveText('₹599.97');
});`,
  },
  {
    id: "TC-HK-001",
    project: "hikode",
    module: "Application Flow",
    scenario: "Verify candidate cannot submit multiple applications to the same job opening",
    steps: [
      "Log in as candidate 'kishore.qa@example.com'",
      "Navigate to job 'QA Automation Engineer (ID: JOB-101)'",
      "Click 'Apply Now' and confirm",
      "Observe button state after submission",
    ],
    expectedResult: "Button label updates to 'Applied' and becomes permanently disabled.",
    priority: "P1",
    type: "Negative",
    linkedRequirementId: "REQ-HK-01",
    linkedBugId: "BUG-HK-01",
    manualSnippet: "Submit application once. Check button is disabled with text 'Already Applied'.",
    playwrightSnippet: `test('disables apply button after initial submission', async ({ page }) => {
  await page.goto('/jobs/JOB-101');
  const applyBtn = page.getByRole('button', { name: 'Apply Now' });
  await applyBtn.click();
  await expect(page.getByText('Application Submitted')).toBeVisible();
  await expect(applyBtn).toHaveText('Applied');
  await expect(applyBtn).toBeDisabled();
});`,
  },
  {
    id: "TC-HK-002",
    project: "hikode",
    module: "Profile Settings",
    scenario: "Verify resume uploader rejects binary executables (.exe, .sh, .bat)",
    steps: [
      "Navigate to Candidate Profile > Documents",
      "Select 'trojan_installer.exe' in file picker",
      "Trigger upload submission",
    ],
    expectedResult: "Upload is blocked with validation message: 'Only PDF and DOCX files are allowed'.",
    priority: "P1",
    type: "Negative",
    linkedRequirementId: "REQ-HK-02",
    linkedBugId: "BUG-HK-02",
    manualSnippet: "Upload invalid .exe file. Must show validation error and reject payload.",
    playwrightSnippet: `test('rejects .exe files in resume uploader', async ({ page }) => {
  await page.goto('/profile');
  const fileInput = page.getByLabel('Upload Resume');
  await fileInput.setInputFiles({
    name: 'exploit.exe',
    mimeType: 'application/x-msdownload',
    buffer: Buffer.from('MZ...'),
  });
  await expect(page.getByText('Only PDF and DOCX files are allowed')).toBeVisible();
});`,
  },
  {
    id: "TC-HK-003",
    project: "hikode",
    module: "Job Search",
    scenario: "Verify keyword search query persists across browser history navigation",
    steps: [
      "On /jobs page, enter 'TypeScript' into search input",
      "Click on first job posting in results",
      "Click browser 'Back' button",
    ],
    expectedResult: "Search input continues to contain 'TypeScript' and list displays matching roles.",
    priority: "P3",
    type: "Positive",
    linkedRequirementId: "REQ-HK-03",
    linkedBugId: "BUG-HK-03",
    manualSnippet: "Search 'TypeScript' -> Click Result -> Browser Back -> Verify search input has 'TypeScript'",
    playwrightSnippet: `test('persists search query on back navigation', async ({ page }) => {
  await page.goto('/jobs');
  const searchInput = page.getByPlaceholder('Search jobs by title...');
  await searchInput.fill('TypeScript');
  await page.keyboard.press('Enter');
  await page.getByRole('link', { name: /TypeScript/i }).first().click();
  await page.goBack();
  await expect(searchInput).toHaveValue('TypeScript');
});`,
  },
  {
    id: "TC-HK-004",
    project: "hikode",
    module: "Session & Auth",
    scenario: "Verify session is invalidated on sign out and back button redirects to login",
    steps: [
      "Log into candidate portal",
      "Click 'Sign Out' in navigation",
      "Click browser back button to attempt viewing private dashboard",
    ],
    expectedResult: "Browser immediately redirects to /login; sensitive candidate data is never shown.",
    priority: "P1",
    type: "Edge",
    linkedRequirementId: "REQ-HK-04",
    linkedBugId: "BUG-HK-04",
    manualSnippet: "Login -> Sign Out -> Browser Back -> Must redirect to /login",
    playwrightSnippet: `test('clears session and prevents back-cache access after logout', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Sign Out' }).click();
  await expect(page).toHaveURL('/login');
  await page.goBack();
  await expect(page).toHaveURL('/login');
});`,
  },
  {
    id: "TC-HK-005",
    project: "hikode",
    module: "Profile Settings",
    scenario: "Verify clicking 'Remove Avatar' when no image uploaded does not trigger crash",
    steps: [
      "Access profile with default initial placeholder avatar",
      "Click 'Remove Avatar'",
    ],
    expectedResult: "App remains stable; button is either disabled or displays 'No custom avatar to remove'.",
    priority: "P2",
    type: "Negative",
    linkedRequirementId: "REQ-HK-02",
    linkedBugId: "BUG-HK-05",
    manualSnippet: "Profile without avatar -> Click 'Remove Avatar' -> No JS console errors",
    playwrightSnippet: `test('handles remove avatar with null state gracefully', async ({ page }) => {
  await page.goto('/settings/profile');
  const removeBtn = page.getByRole('button', { name: 'Remove Avatar' });
  await removeBtn.click();
  await expect(page.getByText('No custom avatar to remove')).toBeVisible();
});`,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TRACEABILITY MATRIX
// ─────────────────────────────────────────────────────────────────────────────

export const TRACEABILITY_MATRIX: TraceabilityNode[] = [
  {
    requirementId: "REQ-NSO-01",
    requirementTitle: "Cart Calculations & Fractional Precision",
    project: "nso",
    testCaseIds: ["TC-NSO-001", "TC-NSO-005"],
    bugIds: ["BUG-NSO-01", "BUG-NSO-05"],
  },
  {
    requirementId: "REQ-NSO-02",
    requirementTitle: "Real-time Franchise Inventory Synchronization",
    project: "nso",
    testCaseIds: ["TC-NSO-002"],
    bugIds: ["BUG-NSO-02"],
  },
  {
    requirementId: "REQ-NSO-03",
    requirementTitle: "Checkout Idempotency & Duplicate Prevention",
    project: "nso",
    testCaseIds: ["TC-NSO-003"],
    bugIds: ["BUG-NSO-03"],
  },
  {
    requirementId: "REQ-NSO-04",
    requirementTitle: "Compliant GST Invoicing & Coupon Deduction Order",
    project: "nso",
    testCaseIds: ["TC-NSO-004"],
    bugIds: ["BUG-NSO-04"],
  },
  {
    requirementId: "REQ-HK-01",
    requirementTitle: "Candidate Job Application Uniqueness Constraint",
    project: "hikode",
    testCaseIds: ["TC-HK-001"],
    bugIds: ["BUG-HK-01"],
  },
  {
    requirementId: "REQ-HK-02",
    requirementTitle: "Secure Document Ingestion & Profile Hygiene",
    project: "hikode",
    testCaseIds: ["TC-HK-002", "TC-HK-005"],
    bugIds: ["BUG-HK-02", "BUG-HK-05"],
  },
  {
    requirementId: "REQ-HK-03",
    requirementTitle: "State Preservation in Job Search & History",
    project: "hikode",
    testCaseIds: ["TC-HK-003"],
    bugIds: ["BUG-HK-03"],
  },
  {
    requirementId: "REQ-HK-04",
    requirementTitle: "Zero-Trust Session Invalidation & Cache-Control",
    project: "hikode",
    testCaseIds: ["TC-HK-004"],
    bugIds: ["BUG-HK-04"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HEATMAP / MODULE COVERAGE
// ─────────────────────────────────────────────────────────────────────────────

export const MODULE_COVERAGE_DATA: ModuleCoverage[] = [
  { module: "Cart & Pricing", project: "nso", testCaseCount: 14, bugsFound: 2, totalBugs: 2, coverageScore: 92 },
  { module: "Inventory", project: "nso", testCaseCount: 8, bugsFound: 1, totalBugs: 1, coverageScore: 88 },
  { module: "Checkout", project: "nso", testCaseCount: 11, bugsFound: 1, totalBugs: 1, coverageScore: 95 },
  { module: "Billing / Tax", project: "nso", testCaseCount: 9, bugsFound: 1, totalBugs: 1, coverageScore: 90 },
  { module: "Job Search", project: "hikode", testCaseCount: 12, bugsFound: 1, totalBugs: 1, coverageScore: 85 },
  { module: "Application Flow", project: "hikode", testCaseCount: 16, bugsFound: 1, totalBugs: 1, coverageScore: 94 },
  { module: "Profile Settings", project: "hikode", testCaseCount: 10, bugsFound: 2, totalBugs: 2, coverageScore: 89 },
  { module: "Session & Auth", project: "hikode", testCaseCount: 15, bugsFound: 1, totalBugs: 1, coverageScore: 96 },
];

// ─────────────────────────────────────────────────────────────────────────────
// API ENDPOINTS & NEGATIVE TEST SUITE
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiEndpointSpec {
  id: string;
  project: ProjectKey;
  name: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  defaultHeaders: Record<string, string>;
  defaultBody?: Record<string, unknown>;
  expectedStatus: number;
}

export const API_ENDPOINTS: ApiEndpointSpec[] = [
  // NSO Endpoints
  {
    id: "ep-nso-1",
    project: "nso",
    name: "Create Order",
    method: "POST",
    path: "/api/mock/nso/orders",
    description: "Submits cart items and customer branch to create a supply chain dispatch order.",
    defaultHeaders: { "Content-Type": "application/json", "x-api-key": "demo-nso-key-2026" },
    defaultBody: {
      cartId: "CRT-7749",
      franchiseId: "FR-HYD-04",
      items: [{ id: "WFL-01", name: "Nutella Waffle", qty: 2, unitPrice: 199.99 }],
      paymentMethod: "UPI",
    },
    expectedStatus: 201,
  },
  {
    id: "ep-nso-2",
    project: "nso",
    name: "Get Order by ID",
    method: "GET",
    path: "/api/mock/nso/orders?id=ORD-2026-8841",
    description: "Fetches live order status, timestamps, and itemized billing breakdown.",
    defaultHeaders: { "x-api-key": "demo-nso-key-2026" },
    expectedStatus: 200,
  },
  {
    id: "ep-nso-3",
    project: "nso",
    name: "Update Stock",
    method: "PATCH",
    path: "/api/mock/nso/stock",
    description: "Adjusts warehouse stock allocation for specific Belgian waffle SKUs.",
    defaultHeaders: { "Content-Type": "application/json", "Authorization": "Bearer mock-auth-token" },
    defaultBody: { sku: "SKU-WFL-BATTER-10KG", adjustment: -5, reason: "FR-HYD-04 Fulfillment" },
    expectedStatus: 200,
  },
  {
    id: "ep-nso-4",
    project: "nso",
    name: "Cancel Order",
    method: "DELETE",
    path: "/api/mock/nso/orders?id=ORD-2026-8841",
    description: "Cancels an order before depot dispatch and releases allocated inventory.",
    defaultHeaders: { "Authorization": "Bearer mock-auth-token" },
    expectedStatus: 200,
  },

  // HiKode Endpoints
  {
    id: "ep-hk-1",
    project: "hikode",
    name: "Candidate Login",
    method: "POST",
    path: "/api/mock/hikode/auth/login",
    description: "Authenticates candidate credentials and returns JWT bearer token.",
    defaultHeaders: { "Content-Type": "application/json" },
    defaultBody: { email: "kishore.qa@example.com", password: "Password123!" },
    expectedStatus: 200,
  },
  {
    id: "ep-hk-2",
    project: "hikode",
    name: "Get Job Listings",
    method: "GET",
    path: "/api/mock/hikode/jobs?q=QA&limit=5",
    description: "Fetches open software engineering and QA positions with keyword filtering.",
    defaultHeaders: { "Accept": "application/json" },
    expectedStatus: 200,
  },
  {
    id: "ep-hk-3",
    project: "hikode",
    name: "Apply to Job",
    method: "POST",
    path: "/api/mock/hikode/jobs/apply",
    description: "Submits candidate resume, notice period, and application notes for an open job.",
    defaultHeaders: { "Content-Type": "application/json", "Authorization": "Bearer mock-candidate-jwt" },
    defaultBody: { jobId: "JOB-101", candidateId: "CAN-5502", resumeUrl: "https://mock.storage/resume.pdf" },
    expectedStatus: 201,
  },
  {
    id: "ep-hk-4",
    project: "hikode",
    name: "Update Profile",
    method: "PUT",
    path: "/api/mock/hikode/profile",
    description: "Updates candidate contact details, skills, and portfolio repository links.",
    defaultHeaders: { "Content-Type": "application/json", "Authorization": "Bearer mock-candidate-jwt" },
    defaultBody: { name: "Kishore Kumar", skills: ["Playwright", "TypeScript", "Postman", "Manual Testing"], noticePeriodDays: 15 },
    expectedStatus: 200,
  },
];

export const NEGATIVE_TEST_SCENARIOS: NegativeTestScenario[] = [
  {
    id: "NEG-01",
    title: "Empty JSON Request Body on Order Creation",
    project: "nso",
    method: "POST",
    endpoint: "/api/mock/nso/orders",
    expectedStatus: 400,
    payloadDescription: "Sending empty object `{}` with Content-Type application/json",
    samplePayload: {},
    expectedErrorMessage: "Missing required field 'cartId' or 'items'. Payload cannot be empty.",
  },
  {
    id: "NEG-02",
    title: "Missing Bearer Authorization Token on Protected Stock Update",
    project: "nso",
    method: "PATCH",
    endpoint: "/api/mock/nso/stock",
    expectedStatus: 401,
    payloadDescription: "Sending stock update without Authorization header",
    samplePayload: { sku: "SKU-WFL-01", adjustment: -1 },
    expectedErrorMessage: "Unauthorized: Missing Bearer token in Authorization header.",
  },
  {
    id: "NEG-03",
    title: "Semantic Schema Validation: Invalid Quantity Data Type",
    project: "nso",
    method: "POST",
    endpoint: "/api/mock/nso/orders",
    expectedStatus: 422,
    payloadDescription: "Passing non-numeric string for numeric quantity field `{ qty: 'two_boxes' }`",
    samplePayload: { cartId: "CRT-7749", items: [{ id: "WFL-01", qty: "two_boxes" }] },
    expectedErrorMessage: "Unprocessable Entity: 'qty' must be a strictly positive integer.",
  },
  {
    id: "NEG-04",
    title: "Query Non-Existent Order ID",
    project: "nso",
    method: "GET",
    endpoint: "/api/mock/nso/orders?id=ORD-99999",
    expectedStatus: 404,
    payloadDescription: "Attempting to retrieve non-existent order record",
    expectedErrorMessage: "Order 'ORD-99999' not found in system records.",
  },
  {
    id: "NEG-05",
    title: "Candidate Accessing Admin-Restricted Resource",
    project: "hikode",
    method: "POST",
    endpoint: "/api/mock/hikode/jobs/apply",
    expectedStatus: 403,
    payloadDescription: "Candidate attempting to perform recruiter-level status overwrite",
    samplePayload: { jobId: "JOB-101", adminAction: "ARCHIVE_JOB" },
    expectedErrorMessage: "Forbidden: Candidate role lacks 'jobs:archive' administrative permission.",
  },
  {
    id: "NEG-06",
    title: "Login with Invalid Password Credentials",
    project: "hikode",
    method: "POST",
    endpoint: "/api/mock/hikode/auth/login",
    expectedStatus: 401,
    payloadDescription: "Submitting incorrect password credentials",
    samplePayload: { email: "kishore.qa@example.com", password: "wrong_password" },
    expectedErrorMessage: "Invalid email or password credentials provided.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS CODE CHALLENGE (400 vs 422, 401 vs 403, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export const CHALLENGE_QUESTIONS: ChallengeQuestion[] = [
  {
    id: "CHAL-01",
    scenario: "A client submits a POST request to `/api/v1/users` with valid JSON syntax, but the email field contains 'not-an-email' which fails domain format validation. Which status code is the most semantically accurate?",
    topic: "400 Bad Request vs 422 Unprocessable Entity",
    options: [
      {
        code: 400,
        label: "400 Bad Request",
        isCorrect: false,
        explanation: "400 is typically reserved for malformed syntax (e.g. invalid JSON, missing brackets) or generic client protocol errors.",
      },
      {
        code: 422,
        label: "422 Unprocessable Entity",
        isCorrect: true,
        explanation: "422 (RFC 4918) signifies that the request body syntax is completely valid JSON, but the semantic validation instructions (e.g. invalid email format) could not be processed.",
      },
      {
        code: 404,
        label: "404 Not Found",
        isCorrect: false,
        explanation: "404 indicates the requested URI path does not exist on the server.",
      },
      {
        code: 500,
        label: "500 Internal Server Error",
        isCorrect: false,
        explanation: "Validation failures should never return a 5xx server crash error.",
      },
    ],
  },
  {
    id: "CHAL-02",
    scenario: "A logged-in QA intern has a valid JWT session token, but attempts to call DELETE `/api/v1/billing/contracts/99` which requires SuperAdmin permissions. Which status code must the server return?",
    topic: "401 Unauthorized vs 403 Forbidden",
    options: [
      {
        code: 401,
        label: "401 Unauthorized",
        isCorrect: false,
        explanation: "401 means 'Unauthenticated' — the caller's identity is unknown or their token is missing/expired. Here, the identity IS known.",
      },
      {
        code: 403,
        label: "403 Forbidden",
        isCorrect: true,
        explanation: "403 Forbidden means authentication succeeded and the server knows who you are, but you do not possess permission for this operation.",
      },
      {
        code: 405,
        label: "405 Method Not Allowed",
        isCorrect: false,
        explanation: "405 is returned when the endpoint doesn't support the HTTP verb (e.g. DELETE isn't implemented).",
      },
      {
        code: 400,
        label: "400 Bad Request",
        isCorrect: false,
        explanation: "Lack of authorization is not a bad syntax error; 403 is the standard security status code.",
      },
    ],
  },
  {
    id: "CHAL-03",
    scenario: "A POST request creates a new order in the warehouse queue and immediately returns the created order object and location header. What HTTP status code should be returned?",
    topic: "200 OK vs 201 Created",
    options: [
      {
        code: 200,
        label: "200 OK",
        isCorrect: false,
        explanation: "200 OK is suitable for general updates or reads, but 201 specifically denotes a new resource was created on the server.",
      },
      {
        code: 201,
        label: "201 Created",
        isCorrect: true,
        explanation: "201 Created is the standard RESTful status indicating successful resource creation, ideally paired with a Location header.",
      },
      {
        code: 204,
        label: "204 No Content",
        isCorrect: false,
        explanation: "204 is returned when an action succeeds but returns zero response body bytes (e.g. successful DELETE).",
      },
      {
        code: 302,
        label: "302 Found",
        isCorrect: false,
        explanation: "302 is a redirection status code.",
      },
    ],
  },
  {
    id: "CHAL-04",
    scenario: "A client sends a DELETE request to delete order #ORD-501. The order is removed successfully, and the server returns no response body. What status code is expected?",
    topic: "200 OK vs 204 No Content",
    options: [
      {
        code: 200,
        label: "200 OK",
        isCorrect: false,
        explanation: "200 is acceptable if a confirmation JSON payload is returned, but when there is NO response body, 204 is the RFC standard.",
      },
      {
        code: 204,
        label: "204 No Content",
        isCorrect: true,
        explanation: "204 No Content explicitly indicates the action was successfully performed and there is no entity-body in the response.",
      },
      {
        code: 404,
        label: "404 Not Found",
        isCorrect: false,
        explanation: "404 should only be returned if the resource did not exist prior to deletion (or if non-idempotent delete is configured).",
      },
      {
        code: 410,
        label: "410 Gone",
        isCorrect: false,
        explanation: "410 indicates a permanently removed resource, but is not standard for the immediate deletion response.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// POSTMAN-STYLE COLLECTION VIEWER (READ-ONLY TREE)
// ─────────────────────────────────────────────────────────────────────────────

export const POSTMAN_COLLECTIONS: PostmanCollectionTree[] = [
  {
    project: "nso",
    collectionName: "NSO Belgian Waffle Supply Chain v2.4 (Postman)",
    folders: [
      {
        name: "01 - Authentication & Security",
        requests: [
          {
            name: "Generate Franchise Token",
            method: "POST",
            endpoint: "/api/mock/nso/auth/token",
            description: "Generates HMAC signed token for franchise terminal API access.",
            tests: [
              "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
              "pm.test('Token is present', () => pm.expect(pm.response.json().token).to.be.a('string'));",
            ],
          },
        ],
      },
      {
        name: "02 - Inventory & Warehouse",
        requests: [
          {
            name: "Query Waffle SKU Stock",
            method: "GET",
            endpoint: "/api/mock/nso/stock?sku=SKU-WFL-BATTER-10KG",
            description: "Fetches current available units and reserved pallet counts.",
            tests: [
              "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
              "pm.test('Stock is non-negative', () => pm.expect(pm.response.json().units).to.be.above(0));",
            ],
          },
          {
            name: "Update Stock Allocation",
            method: "PATCH",
            endpoint: "/api/mock/nso/stock",
            description: "Decrements units upon order dispatch.",
            tests: [
              "pm.test('Stock updated', () => pm.response.to.have.status(200));",
            ],
          },
        ],
      },
      {
        name: "03 - Order Processing & Invoicing",
        requests: [
          {
            name: "Create Franchise Order",
            method: "POST",
            endpoint: "/api/mock/nso/orders",
            description: "Dispatches new multi-item waffle order.",
            tests: [
              "pm.test('Created 201', () => pm.response.to.have.status(201));",
              "pm.test('Order ID returned', () => pm.expect(pm.response.json().orderId).to.match(/^ORD-/));",
              "pm.test('GST calculated on post-discount', () => pm.expect(pm.response.json().tax).to.be.a('number'));",
            ],
          },
          {
            name: "Get Order Receipt Details",
            method: "GET",
            endpoint: "/api/mock/nso/orders?id=ORD-2026-8841",
            description: "Returns order status and timestamp breakdown.",
            tests: [
              "pm.test('Status 200 OK', () => pm.response.to.have.status(200));",
            ],
          },
          {
            name: "Cancel Order",
            method: "DELETE",
            endpoint: "/api/mock/nso/orders?id=ORD-2026-8841",
            description: "Cancels order prior to loading dock departure.",
            tests: [
              "pm.test('Status 200 OK', () => pm.response.to.have.status(200));",
            ],
          },
        ],
      },
    ],
  },
  {
    project: "hikode",
    collectionName: "HiKode Candidate Platform v1.8 (Postman)",
    folders: [
      {
        name: "01 - Candidate Authentication",
        requests: [
          {
            name: "Candidate Sign In",
            method: "POST",
            endpoint: "/api/mock/hikode/auth/login",
            description: "Authenticates candidate email/password and sets auth cookie.",
            tests: [
              "pm.test('Status code is 200', () => pm.response.to.have.status(200));",
              "pm.test('JWT token returned', () => pm.expect(pm.response.json().token).to.exist);",
            ],
          },
        ],
      },
      {
        name: "02 - Job Search & Discovery",
        requests: [
          {
            name: "Search Active Listings",
            method: "GET",
            endpoint: "/api/mock/hikode/jobs?q=QA",
            description: "Returns active tech openings matching keyword filter.",
            tests: [
              "pm.test('Status 200', () => pm.response.to.have.status(200));",
              "pm.test('Jobs array non-empty', () => pm.expect(pm.response.json().jobs).to.be.an('array'));",
            ],
          },
        ],
      },
      {
        name: "03 - Applications & Profile",
        requests: [
          {
            name: "Submit Job Application",
            method: "POST",
            endpoint: "/api/mock/hikode/jobs/apply",
            description: "Submits resume and application to employer queue.",
            tests: [
              "pm.test('Status 201 Created', () => pm.response.to.have.status(201));",
              "pm.test('Application reference code', () => pm.expect(pm.response.json().applicationId).to.exist);",
            ],
          },
          {
            name: "Update Candidate Profile",
            method: "PUT",
            endpoint: "/api/mock/hikode/profile",
            description: "Updates skills, portfolio links, and notice period.",
            tests: [
              "pm.test('Status 200 OK', () => pm.response.to.have.status(200));",
            ],
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-CUTTING: "DAY IN THE LIFE" QA TIMELINE
// ─────────────────────────────────────────────────────────────────────────────

export interface TimelineStage {
  step: number;
  stage: string;
  subtitle: string;
  description: string;
  tools: string[];
  deliverables: string;
}

export const QA_TIMELINE_STAGES: TimelineStage[] = [
  {
    step: 1,
    stage: "Requirement Analysis",
    subtitle: "Sprint grooming & acceptance criteria",
    description: "Analyze PRDs and user stories. Identify edge cases, boundary limits, and clarify ambiguous acceptance criteria with PMs and devs.",
    tools: ["Jira", "Confluence", "Notion"],
    deliverables: "Traceability matrix mapping & risk assessment",
  },
  {
    step: 2,
    stage: "Test Design",
    subtitle: "Scenarios, matrices & Playwright POM",
    description: "Write structured manual test cases with preconditions, test steps, and exact expected results. Outline Playwright test automation skeletons.",
    tools: ["Google Sheets", "Playwright (TypeScript)", "VS Code"],
    deliverables: "Comprehensive test scenarios across positive, negative, and edge cases",
  },
  {
    step: 3,
    stage: "Execution",
    subtitle: "Cross-browser & API validation",
    description: "Perform exploratory manual testing, execute Postman API suites, and run automated Playwright E2E tests against staging environments.",
    tools: ["Postman", "Playwright Test Runner", "Chrome DevTools"],
    deliverables: "Pass/fail execution logs, API response verification, latency metrics",
  },
  {
    step: 4,
    stage: "Bug Logged",
    subtitle: "Triage & reproducible bug reporting",
    description: "Log defects with clear steps to reproduce, actual vs expected behavior, screenshots, console logs, network payloads, severity, and priority.",
    tools: ["Jira / Bug Tracker", "Loom", "Browser Console"],
    deliverables: "Standardized defect tickets assigned with root-cause indicators",
  },
  {
    step: 5,
    stage: "Retest & Verification",
    subtitle: "Regression testing after fix",
    description: "Verify deployed bug fixes in fresh staging build. Perform regression testing to ensure adjacent components were not broken.",
    tools: ["Playwright Regression Suite", "Postman Monitors"],
    deliverables: "Retest sign-off comments and automated regression pass certificates",
  },
  {
    step: 6,
    stage: "Sign-Off & Closed",
    subtitle: "Release sign-off & retrospective",
    description: "Update defect status to 'Closed', mark test runs as passed, and present sprint QA readiness metrics to engineering leadership.",
    tools: ["GitHub PRs", "QA Metrics Dashboard", "Slack"],
    deliverables: "Final QA Release Sign-off and sprint defect retrospective notes",
  },
];
