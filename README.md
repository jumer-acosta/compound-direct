# Compound-Direct Project

## Setup Instructions

To get started with this project, follow the steps below:

1. Clone the repository to your local machine.
2. Navigate to the project directory:
   ```bash
   cd compound-direct
   ```
3. Install the required Node.js modules:
   ```bash
   npm install @playwright/test
   ```

## Running Tests

After installing the dependencies, you can run the Playwright tests using the following command:

```bash
npx playwright test
```

## How to Manually Trigger It on GitHub

1. Go to your GitHub repository.
2. Click on the **Actions** tab.
3. Click on the workflow name (e.g., **Playwright Tests**).
4. Hit the **Run workflow** button on the right.
5. (Optional) Choose a branch to run the workflow on.
6. Click **Run workflow** to start it!

## Additional Notes

- Ensure you have Node.js (version 14 or higher) installed on your system.
- If you encounter any issues, try running:
  ```bash
  npx playwright install
  ```
  to download the necessary browser binaries.
