const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = 'http://127.0.0.1:8080'; // API Gateway URL
const TEST_ITERATIONS = 100; // Number of times to run each test
const STATS_DIR = path.join(__dirname, 'stats');

// Ensure stats directory exists
if (!fs.existsSync(STATS_DIR)) {
  fs.mkdirSync(STATS_DIR);
}

// Run multiple operations in parallel
async function runConcurrentRequests(concurrency, operationFactory) {
  const promises = [];
  for (let i = 0; i < concurrency; i++) {
    promises.push(operationFactory(i));
  }
  return Promise.allSettled(promises);
}

// Helper function to generate random user data
function getRandomUser() {
  const firstNames = [
    'John',
    'Jane',
    'Mike',
    'Sarah',
    'David',
    'Emma',
    'Alex',
    'Lisa',
  ];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomString = Math.random().toString(36).substring(2, 8);

  const user = {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${randomString}@example.com`,
    password: `Password${randomString}!`,
  };

  return user;
}

const testProduct = {
  name: 'Test Product',
  price: 99.99,
  description: 'A test product',
  stock: 10,
};

// Statistics storage
const stats = {
  users: {
    create: { times: [], success: 0, failed: 0 },
    read: { times: [], success: 0, failed: 0 },
    update: { times: [], success: 0, failed: 0 },
    delete: { times: [], success: 0, failed: 0 },
    list: { times: [], success: 0, failed: 0 },
  },
  products: {
    create: { times: [], success: 0, failed: 0 },
    read: { times: [], success: 0, failed: 0 },
    update: { times: [], success: 0, failed: 0 },
    delete: { times: [], success: 0, failed: 0 },
    list: { times: [], success: 0, failed: 0 },
  },
};

// Helper function to measure response time
async function measureResponseTime(operation) {
  const start = process.hrtime();
  try {
    await operation();
    const [seconds, nanoseconds] = process.hrtime(start);
    return seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
  } catch (error) {
    const [seconds, nanoseconds] = process.hrtime(start);
    throw { error, time: seconds * 1000 + nanoseconds / 1000000 };
  }
}

// Test functions
async function testUserService() {
  console.log('Testing User Service...');
  let userId;

  for (let i = 0; i < TEST_ITERATIONS; i++) {
    const testUser = getRandomUser();

    // Create
    try {
      const time = await measureResponseTime(async () => {
        const response = await axios.post(`${API_BASE_URL}/users`, testUser);
        userId = response.data.id;
      });
      stats.users.create.times.push(time);
      stats.users.create.success++;
    } catch (error) {
      stats.users.create.failed++;
      console.error('Create user failed:', error.message);
      continue;
    }

    // Read
    try {
      const time = await measureResponseTime(async () => {
        await axios.get(`${API_BASE_URL}/users/${userId}`);
      });
      stats.users.read.times.push(time);
      stats.users.read.success++;
    } catch (error) {
      stats.users.read.failed++;
      console.error('Read user failed:', error.message);
    }

    // Update
    try {
      const time = await measureResponseTime(async () => {
        await axios.put(`${API_BASE_URL}/users/${userId}`, {
          ...testUser,
          firstName: 'Updated ' + testUser.firstName,
        });
      });
      stats.users.update.times.push(time);
      stats.users.update.success++;
    } catch (error) {
      stats.users.update.failed++;
      console.error('Update user failed:', error.message);
    }

    // List
    try {
      const time = await measureResponseTime(async () => {
        await axios.get(`${API_BASE_URL}/users`);
      });
      stats.users.list.times.push(time);
      stats.users.list.success++;
    } catch (error) {
      stats.users.list.failed++;
      console.error('List users failed:', error.message);
    }

    // Delete
    try {
      const time = await measureResponseTime(async () => {
        await axios.delete(`${API_BASE_URL}/users/${userId}`);
      });
      stats.users.delete.times.push(time);
      stats.users.delete.success++;
    } catch (error) {
      stats.users.delete.failed++;
      console.error('Delete user failed:', error.message);
    }
  }
}

async function testProductService() {
  console.log('Testing Product Service...');
  let productId;

  for (let i = 0; i < TEST_ITERATIONS; i++) {
    // Create
    try {
      const time = await measureResponseTime(async () => {
        const response = await axios.post(
          `${API_BASE_URL}/products`,
          testProduct
        );
        productId = response.data.id;
      });
      stats.products.create.times.push(time);
      stats.products.create.success++;
    } catch (error) {
      stats.products.create.failed++;
      console.error('Create product failed:', error.message);
      continue;
    }

    // Read
    try {
      const time = await measureResponseTime(async () => {
        await axios.get(`${API_BASE_URL}/products/${productId}`);
      });
      stats.products.read.times.push(time);
      stats.products.read.success++;
    } catch (error) {
      stats.products.read.failed++;
      console.error('Read product failed:', error.message);
    }

    // Update
    try {
      const time = await measureResponseTime(async () => {
        await axios.put(`${API_BASE_URL}/products/${productId}`, {
          ...testProduct,
          name: 'Updated Test Product',
        });
      });
      stats.products.update.times.push(time);
      stats.products.update.success++;
    } catch (error) {
      stats.products.update.failed++;
      console.error('Update product failed:', error.message);
    }

    // List
    try {
      const time = await measureResponseTime(async () => {
        await axios.get(`${API_BASE_URL}/products`);
      });
      stats.products.list.times.push(time);
      stats.products.list.success++;
    } catch (error) {
      stats.products.list.failed++;
      console.error('List products failed:', error.message);
    }

    // Delete
    try {
      const time = await measureResponseTime(async () => {
        await axios.delete(`${API_BASE_URL}/products/${productId}`);
      });
      stats.products.delete.times.push(time);
      stats.products.delete.success++;
    } catch (error) {
      stats.products.delete.failed++;
      console.error('Delete product failed:', error.message);
    }
  }
}

// Calculate statistics
function calculateStats(times) {
  if (times.length === 0) return { min: 0, max: 0, avg: 0 };

  const min = Math.min(...times);
  const max = Math.max(...times);
  const avg = times.reduce((a, b) => a + b, 0) / times.length;

  return { min, max, avg };
}

// Generate report
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    testIterations: TEST_ITERATIONS,
    services: {
      users: {},
      products: {},
    },
  };

  for (const [service, operations] of Object.entries(stats)) {
    for (const [operation, data] of Object.entries(operations)) {
      const timeStats = calculateStats(data.times);
      report.services[service][operation] = {
        success: data.success,
        failed: data.failed,
        successRate: (data.success / TEST_ITERATIONS) * 100,
        timing: {
          min: timeStats.min.toFixed(2),
          max: timeStats.max.toFixed(2),
          avg: timeStats.avg.toFixed(2),
        },
      };
    }
  }

  const reportPath = path.join(STATS_DIR, `report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report generated: ${reportPath}`);

  // Print summary to console
  console.log('\nTest Summary:');
  for (const [service, operations] of Object.entries(report.services)) {
    console.log(`\n${service.toUpperCase()} SERVICE:`);
    for (const [operation, data] of Object.entries(operations)) {
      console.log(`  ${operation}:`);
      console.log(`    Success Rate: ${data.successRate.toFixed(2)}%`);
      console.log(
        `    Timing (ms): min=${data.timing.min}, max=${data.timing.max}, avg=${data.timing.avg}`
      );
    }
  }
}

// Helper: split array into chunks
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function testConcurrency(concurrency) {
  console.log(
    `\nTesting concurrent product creation with concurrency=${concurrency}...`
  );

  // --- Step 1: Create products in parallel ---
  const createResults = await runConcurrentRequests(concurrency, async () => {
    const start = Date.now();
    const response = await axios.post(`${API_BASE_URL}/products`, testProduct);
    const duration = Date.now() - start;
    return { id: response.data.id, duration };
  });

  const successful = createResults
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
  const failed = createResults.filter((r) => r.status === 'rejected');

  console.log(
    `Created ${successful.length} products (failed=${failed.length})`
  );

  // --- Step 2: Delete products in batches ---
  console.log('Cleaning up products...');

  const batchSize = 50; // max parallel deletes per batch
  let deleted = 0;
  let deleteFailed = 0;

  const batches = chunkArray(successful, batchSize);

  for (const batch of batches) {
    const results = await Promise.allSettled(
      batch.map((p) => axios.delete(`${API_BASE_URL}/products/${p.id}`))
    );

    deleted += results.filter((r) => r.status === 'fulfilled').length;
    deleteFailed += results.filter((r) => r.status === 'rejected').length;

    // optional: tiny delay to reduce DB load further
    await new Promise((res) => setTimeout(res, 50));
  }

  console.log(`Deleted ${deleted} products (failed=${deleteFailed})`);

  return {
    created: successful.length,
    failedCreates: failed.length,
    deleted,
    failedDeletes: deleteFailed,
  };
}

// Main function
async function main() {
  try {
    console.log(
      `Starting tests with ${TEST_ITERATIONS} iterations per operation...\n`
    );

    // await testUserService();
    // await testProductService();
    // generateReport();

    const result = await testConcurrency(TEST_ITERATIONS);
    console.log(result);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run tests
main();
