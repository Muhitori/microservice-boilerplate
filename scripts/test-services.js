const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Configuration
const API_BASE_URL = "http://localhost:8080"; // API Gateway URL
const TEST_ITERATIONS = 1; // Number of times to run each test
const STATS_DIR = path.join(__dirname, "stats");

// Ensure stats directory exists
if (!fs.existsSync(STATS_DIR)) {
	fs.mkdirSync(STATS_DIR);
}

// Test data
const testUser = {
	firstName: "test",
	lastName: "user",
	email: `test+${Math.random()}@example.com`,
	password: "password123",
};

const testProduct = {
	name: "Test Product",
	price: 99.99,
	description: "A test product",
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
	console.log("Testing User Service...");
	let userId;

	for (let i = 0; i < TEST_ITERATIONS; i++) {
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
			console.error("Create user failed:", error.message);
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
			console.error("Read user failed:", error.message);
		}

		// Update
		try {
			const time = await measureResponseTime(async () => {
				await axios.put(`${API_BASE_URL}/users/${userId}`, {
					...testUser,
					name: "Updated Test User",
				});
			});
			stats.users.update.times.push(time);
			stats.users.update.success++;
		} catch (error) {
			stats.users.update.failed++;
			console.error("Update user failed:", error.message);
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
			console.error("List users failed:", error.message);
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
			console.error("Delete user failed:", error.message);
		}
	}
}

async function testProductService() {
	console.log("Testing Product Service...");
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
			console.error("Create product failed:", error.message);
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
			console.error("Read product failed:", error.message);
		}

		// Update
		try {
			const time = await measureResponseTime(async () => {
				await axios.put(`${API_BASE_URL}/products/${productId}`, {
					...testProduct,
					name: "Updated Test Product",
				});
			});
			stats.products.update.times.push(time);
			stats.products.update.success++;
		} catch (error) {
			stats.products.update.failed++;
			console.error("Update product failed:", error.message);
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
			console.error("List products failed:", error.message);
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
			console.error("Delete product failed:", error.message);
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
	console.log("\nTest Summary:");
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

// Main function
async function main() {
	try {
		console.log(
			`Starting tests with ${TEST_ITERATIONS} iterations per operation...\n`
		);

		await testUserService();
		await testProductService();

		generateReport();
	} catch (error) {
		console.error("Test failed:", error);
		process.exit(1);
	}
}

// Run tests
main();

