export interface TestCase {
  id: string;
  title: string;
  project: string;
  type: "Functional" | "API" | "Regression" | "Smoke" | "Sanity";
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Passed" | "Failed" | "Blocked";
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  actualResult: string;
}

export interface ApiTestEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  description: string;
  expectedStatus: number;
  samplePayload?: Record<string, unknown>;
  expectedResponse: Record<string, unknown>;
  latencyMs: number;
}

export interface PlaywrightTestStep {
  id: string;
  action: string;
  target: string;
  durationMs: number;
  status: "passed" | "running" | "pending";
}

export interface PlaywrightTestSuite {
  id: string;
  name: string;
  file: string;
  browser: "chromium" | "firefox" | "webkit";
  steps: PlaywrightTestStep[];
}

export interface BugScenario {
  id: string;
  title: string;
  project: string;
  module: string;
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  severity: "Critical" | "High" | "Medium";
  status: "Open" | "In Progress" | "Resolved";
  isFound: boolean;
}

export const sampleTestCases: TestCase[] = [
  {
    id: "TC-HK-001",
    title: "Verify User Authentication with Valid Credentials",
    project: "HiKode Web Platform",
    type: "Smoke",
    severity: "Critical",
    status: "Passed",
    preconditions: ["User is registered and account is active", "User navigates to login page"],
    steps: [
      "Enter registered email address in email input field",
      "Enter valid password in password field",
      "Click on 'Sign In' button",
    ],
    expectedResult: "User is successfully authenticated and redirected to dashboard with JWT token stored securely.",
    actualResult: "User redirected to dashboard in 420ms with active session state.",
  },
  {
    id: "TC-BW-014",
    title: "Verify Order Cart Total Price Calculation with Applied Coupon",
    project: "NSO — Belgian Waffle",
    type: "Functional",
    severity: "High",
    status: "Passed",
    preconditions: ["At least 2 items added to cart", "User is on Checkout page"],
    steps: [
      "Enter valid promo code 'WAFFLE20' in discount field",
      "Click 'Apply Discount' button",
      "Verify subtotal, tax, discount rate, and total payable amount",
    ],
    expectedResult: "20% discount applied to subtotal before tax calculation; grand total correctly calculated.",
    actualResult: "Discount applied correctly. Calculated tax matches expected formula.",
  },
  {
    id: "TC-HK-042",
    title: "Verify API Rate Limiting on Authentication Endpoint",
    project: "HiKode Web Platform",
    type: "API",
    severity: "Medium",
    status: "Passed",
    preconditions: ["Postman / Automated API script initialized"],
    steps: [
      "Send 10 consecutive POST requests to /api/auth/login within 5 seconds",
      "Inspect HTTP response status code for 11th request",
    ],
    expectedResult: "11th request receives HTTP 429 Too Many Requests with Retry-After header.",
    actualResult: "HTTP 429 returned as expected after 10 requests.",
  },
];

export const sampleApiEndpoints: ApiTestEndpoint[] = [
  {
    id: "API-01",
    method: "POST",
    endpoint: "/api/v1/auth/login",
    description: "Authenticates user and returns JWT authorization token",
    expectedStatus: 200,
    samplePayload: { email: "kishore.qa@ratnamsolutions.com", password: "••••••••" },
    expectedResponse: { status: "success", token: "eyJhbGciOiJIUzI1Ni...", expiresIn: 3600 },
    latencyMs: 145,
  },
  {
    id: "API-02",
    method: "GET",
    endpoint: "/api/v1/products?category=waffles&limit=10",
    description: "Fetches active product list with filtering and pagination",
    expectedStatus: 200,
    expectedResponse: { total: 24, page: 1, items: [{ id: 101, name: "Nutella Waffle", price: 180 }] },
    latencyMs: 82,
  },
  {
    id: "API-03",
    method: "POST",
    endpoint: "/api/v1/orders/checkout",
    description: "Submits cart items for order processing and payment link generation",
    expectedStatus: 201,
    samplePayload: { cartId: "cart_99812", paymentMethod: "UPI" },
    expectedResponse: { orderId: "ORD-2026-8841", status: "PENDING_PAYMENT", amount: 350 },
    latencyMs: 210,
  },
  {
    id: "API-04",
    method: "GET",
    endpoint: "/api/v1/students/enrolments/stats",
    description: "Returns academy enrolment metric summary for administrative dashboard",
    expectedStatus: 200,
    expectedResponse: { totalStudents: 1420, activeBatches: 18, pendingReviews: 5 },
    latencyMs: 95,
  },
];

export const samplePlaywrightSuite: PlaywrightTestSuite = {
  id: "PW-SUITE-01",
  name: "E2E Checkout Flow & Order Confirmation",
  file: "tests/e2e/checkout.spec.ts",
  browser: "chromium",
  steps: [
    { id: "s1", action: "page.goto('/products')", target: "Navigating to store homepage", durationMs: 420, status: "passed" },
    { id: "s2", action: "page.click('[data-testid=add-to-cart]')", target: "Clicking 'Add Nutella Waffle'", durationMs: 180, status: "passed" },
    { id: "s3", action: "expect(page.locator('.cart-count')).toHaveText('1')", target: "Asserting cart counter updated", durationMs: 60, status: "passed" },
    { id: "s4", action: "page.goto('/checkout')", target: "Navigating to Checkout page", durationMs: 310, status: "passed" },
    { id: "s5", action: "page.fill('#promo-input', 'WAFFLE20')", target: "Entering promo code", durationMs: 120, status: "passed" },
    { id: "s6", action: "expect(page.locator('.total')).toContainText('₹144')", target: "Asserting 20% discount applied", durationMs: 90, status: "passed" },
  ],
};

export const sampleBugScenarios: BugScenario[] = [
  {
    id: "BUG-101",
    title: "Cart total calculation ignores fractional decimal currency precision",
    project: "NSO — Belgian Waffle",
    module: "Checkout",
    description: "When adding items with prices ending in .99, rounding truncates decimals instead of computing exact float value.",
    stepsToReproduce: [
      "Add 3 items priced at ₹199.99 each to cart",
      "Proceed to order summary screen",
      "Compare displayed total against expected sum (₹599.97)",
    ],
    expectedBehavior: "Cart displays grand total as ₹599.97.",
    actualBehavior: "Cart displays grand total as ₹597.00 due to integer conversion bug.",
    severity: "High",
    status: "Open",
    isFound: false,
  },
  {
    id: "BUG-102",
    title: "Profile upload button triggers unhandled null reference on missing avatar",
    project: "HiKode Platform",
    module: "User Settings",
    description: "Clicking 'Remove Avatar' when no avatar image was previously uploaded causes React error boundary crash.",
    stepsToReproduce: [
      "Log in as a new user with default avatar placeholder",
      "Navigate to Account Settings > Profile",
      "Click 'Remove Avatar' button",
    ],
    expectedBehavior: "Button is disabled or shows toast notification 'No avatar to remove'.",
    actualBehavior: "TypeError: Cannot read properties of null (reading 'url') thrown.",
    severity: "Medium",
    status: "Open",
    isFound: false,
  },
];
