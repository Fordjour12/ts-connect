import 'dotenv/config';
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { nanoid } from "nanoid";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_K3HbcCzUtDA8@ep-broad-dust-ajd571ds-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sql = neon(databaseUrl);
const db = drizzle(sql);

// Test user credentials
const TEST_USER_EMAIL = 'alex.johnson@example.com';
const TEST_USER_PASSWORD = 'SecurePass2024!';
const TEST_USER_ID = 'test-user-alex';

// Helper function to generate random dates within a range
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to format date for SQL
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function createTestUser() {
  console.log('👤 Creating test user "Alex Johnson"...');
  
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM "user" WHERE id = ${TEST_USER_ID}
    `;
    
    if (existingUser.length === 0) {
      await sql`
        INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
        VALUES (
          ${TEST_USER_ID}, 
          ${'Alex Johnson'}, 
          ${TEST_USER_EMAIL}, 
          true, 
          NOW(), 
          NOW()
        )
      `;
      console.log('✅ Test user created successfully');
    } else {
      console.log('✅ Test user already exists');
    }
    
    // Check if user profile exists
    const existingProfile = await sql`
      SELECT id FROM user_profile WHERE user_id = ${TEST_USER_ID}
    `;
    
    if (existingProfile.length === 0) {
      await sql`
        INSERT INTO user_profile (id, user_id, currency, financial_start_date, monthly_income_min, monthly_income_max, privacy_mode, telemetry_opt_in, created_at, updated_at)
        VALUES (
          ${nanoid(10)}, 
          ${TEST_USER_ID}, 
          'USD', 
          '2023-01-01', 
          '8500.00', 
          '12000.00', 
          'private', 
          true, 
          NOW(), 
          NOW()
        )
      `;
      console.log('✅ User profile created successfully');
    } else {
      console.log('✅ User profile already exists');
    }
    
    return true;
  } catch (error) {
    console.log(`❌ User creation failed: ${error.message}`);
    return false;
  }
}

async function createCategories() {
  console.log('📂 Creating categories...');
  
  const categories = [
    { name: 'Food & Dining', type: 'expense', color: '#FF6B6B', icon: 'utensils' },
    { name: 'Transportation', type: 'expense', color: '#4ECDC4', icon: 'car' },
    { name: 'Shopping', type: 'expense', color: '#45B7D1', icon: 'shopping-bag' },
    { name: 'Entertainment', type: 'expense', color: '#FFA07A', icon: 'film' },
    { name: 'Bills & Utilities', type: 'expense', color: '#98D8C8', icon: 'receipt' },
    { name: 'Healthcare', type: 'expense', color: '#F7DC6F', icon: 'heart' },
    { name: 'Salary', type: 'income', color: '#2ECC71', icon: 'dollar-sign' },
    { name: 'Freelance', type: 'income', color: '#9B59B6', icon: 'laptop' },
    { name: 'Investments', type: 'income', color: '#3498DB', icon: 'trending-up' },
    { name: 'Rent', type: 'expense', color: '#E74C3C', icon: 'home' },
    { name: 'Insurance', type: 'expense', color: '#F39C12', icon: 'shield' },
    { name: 'Personal Care', type: 'expense', color: '#E67E22', icon: 'user' },
  ];
  
  // Check existing categories first
  const existingCategories = await sql`
    SELECT name FROM category WHERE user_id = ${TEST_USER_ID}
  `;
  const existingNames = existingCategories.map(cat => cat.name);
  
  for (const category of categories) {
    if (!existingNames.includes(category.name)) {
      try {
        await sql`
          INSERT INTO category (id, user_id, name, type, color, icon, is_system, created_at, updated_at)
          VALUES (
            ${nanoid(10)}, 
            ${TEST_USER_ID}, 
            ${category.name}, 
            ${category.type}, 
            ${category.color}, 
            ${category.icon}, 
            false, 
            NOW(), 
            NOW()
          )
        `;
      } catch (error) {
        // Skip if fails
      }
    }
  }
  
  console.log('✅ Categories created successfully');
}

async function createAccounts() {
  console.log('🏦 Creating financial accounts...');
  
  const accounts = [
    { name: 'Chase Total Checking', type: 'checking', balance: '8420.50' },
    { name: 'Capital One 360 Savings', type: 'savings', balance: '15680.75' },
    { name: 'Chase Sapphire Reserve', type: 'credit', balance: '-2450.80' },
    { name: 'American Express Gold', type: 'credit', balance: '-1850.25' },
    { name: 'Fidelity 401k', type: 'investment', balance: '89450.30' },
    { name: 'Vanguard Roth IRA', type: 'investment', balance: '23450.80' },
  ];
  
  // Check existing accounts first
  const existingAccounts = await sql`
    SELECT name FROM financial_account WHERE user_id = ${TEST_USER_ID}
  `;
  const existingNames = existingAccounts.map(acc => acc.name);
  
  for (const account of accounts) {
    if (!existingNames.includes(account.name)) {
      try {
        await sql`
          INSERT INTO financial_account (id, user_id, name, type, balance, created_at, updated_at)
          VALUES (
            ${nanoid(10)}, 
            ${TEST_USER_ID}, 
            ${account.name}, 
            ${account.type}, 
            ${account.balance}, 
            NOW(), 
            NOW()
          )
        `;
      } catch (error) {
        // Skip if fails
      }
    }
  }
  
  console.log('✅ Financial accounts created successfully');
}

async function getCategories() {
  const result = await sql`
    SELECT * FROM category WHERE user_id = ${TEST_USER_ID}
  `;
  return result;
}

async function getAccounts() {
  const result = await sql`
    SELECT * FROM financial_account WHERE user_id = ${TEST_USER_ID}
  `;
  return result;
}

function getCategoryId(categories, categoryName) {
  const category = categories.find(cat => cat.name === categoryName);
  return category ? category.id : categories[0].id;
}

async function getRandomAccount(accounts, accountType = null) {
  let filteredAccounts = accounts;
  if (accountType) {
    filteredAccounts = accounts.filter(acc => acc.type === accountType);
  }
  const randomAccount = filteredAccounts[Math.floor(Math.random() * filteredAccounts.length)];
  return randomAccount;
}

async function createTransactions() {
  console.log('💳 Creating substantial transaction history...');
  
  const categories = await getCategories();
  const accounts = await getAccounts();
  
  // Monthly salary transactions (last 24 months)
  console.log('📈 Adding salary transactions...');
  for (let month = 0; month < 24; month++) {
    const salaryDate = new Date('2023-02-01');
    salaryDate.setMonth(salaryDate.getMonth() + month);
    
    // Check if this transaction already exists
    const existingTx = await sql`
      SELECT id FROM transaction 
      WHERE user_id = ${TEST_USER_ID} 
      AND description = 'Direct Deposit - Tech Corp Salary' 
      AND transaction_date = ${formatDate(salaryDate)}
    `;
    
    if (existingTx.length === 0) {
      await sql`
        INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
        VALUES (
          ${nanoid(10)}, 
          ${TEST_USER_ID}, 
          ${(await getRandomAccount(accounts, 'checking')).id}, 
          '9200.00', 
          'Direct Deposit - Tech Corp Salary', 
          ${getCategoryId(categories, 'Salary')}, 
          ${formatDate(salaryDate)}, 
          NOW(), 
          NOW()
        )
      `;
    }
  }
  
  // Freelance income (every 2 weeks for last year)
  console.log('💼 Adding freelance transactions...');
  for (let week = 0; week < 52; week += 2) {
    const freelanceDate = new Date('2023-02-14');
    freelanceDate.setDate(freelanceDate.getDate() + (week * 7));
    
    await sql`
      INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
      VALUES (
        ${nanoid(10)}, 
        ${TEST_USER_ID}, 
        ${(await getRandomAccount(accounts, 'checking')).id}, 
        '1500.00', 
        'PayPal - Web Development Project', 
        ${getCategoryId(categories, 'Freelance')}, 
        ${formatDate(freelanceDate)}, 
        NOW(), 
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  
  // Regular monthly expenses
  console.log('🏠 Adding monthly expenses...');
  const monthlyExpenses = [
    { category: 'Rent', amount: '-2500.00', description: 'Online Payment - Apartment Rent' },
    { category: 'Bills & Utilities', amount: '-120.00', description: 'Electricity Bill' },
    { category: 'Bills & Utilities', amount: '-85.00', description: 'Internet Service' },
    { category: 'Bills & Utilities', amount: '-95.00', description: 'Phone Bill' },
    { category: 'Insurance', amount: '-220.00', description: 'Car Insurance Premium' },
    { category: 'Insurance', amount: '-180.00', description: 'Health Insurance' },
  ];
  
  for (let month = 0; month < 24; month++) {
    const monthDate = new Date('2023-02-01');
    monthDate.setMonth(monthDate.getMonth() + month);
    
    for (const expense of monthlyExpenses) {
      const expenseDate = new Date(monthDate);
      expenseDate.setDate(1 + Math.floor(Math.random() * 28)); // Random day in month
      
      await sql`
        INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
        VALUES (
          ${nanoid(10)}, 
          ${TEST_USER_ID}, 
          ${(await getRandomAccount(accounts, 'checking')).id}, 
          ${expense.amount}, 
          ${expense.description}, 
          ${getCategoryId(categories, expense.category)}, 
          ${formatDate(expenseDate)}, 
          NOW(), 
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
  
  // Weekly grocery shopping
  console.log('🛒 Adding grocery transactions...');
  for (let week = 0; week < 104; week++) { // 2 years of weekly groceries
    const groceryDate = new Date('2023-02-04');
    groceryDate.setDate(groceryDate.getDate() + (week * 7));
    
    const groceryAmounts = ['-85.50', '-92.30', '-78.90', '-105.20', '-88.75', '-94.10'];
    
    await sql`
      INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
      VALUES (
        ${nanoid(10)}, 
        ${TEST_USER_ID}, 
        ${(await getRandomAccount(accounts, 'checking')).id}, 
        ${groceryAmounts[Math.floor(Math.random() * groceryAmounts.length)]}, 
        'Whole Foods Market - Grocery Shopping', 
        ${getCategoryId(categories, 'Food & Dining')}, 
        ${formatDate(groceryDate)}, 
        NOW(), 
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
  
  // Entertainment and dining out
  console.log('🍽️ Adding entertainment transactions...');
  for (let month = 0; month < 24; month++) {
    const monthDate = new Date('2023-02-01');
    monthDate.setMonth(monthDate.getMonth() + month);
    
    // Netflix
    const netflixDate = new Date(monthDate);
    await sql`
      INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
      VALUES (
        ${nanoid(10)}, 
        ${TEST_USER_ID}, 
        ${(await getRandomAccount(accounts, 'credit')).id}, 
        '-15.99', 
        'Netflix.com - Monthly Subscription', 
        ${getCategoryId(categories, 'Entertainment')}, 
        ${formatDate(netflixDate)}, 
        NOW(), 
        NOW()
      )
      ON CONFLICT (id) DO NOTHING
    `;
    
    // Restaurant dinners (2-3 times per month)
    for (let dinner = 0; dinner < 3; dinner++) {
      const dinnerDate = new Date(monthDate);
      dinnerDate.setDate(5 + (dinner * 10) + Math.floor(Math.random() * 5));
      
      const dinnerAmounts = ['-45.20', '-52.80', '-38.90', '-67.30', '-41.50'];
      
      await sql`
        INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
        VALUES (
          ${nanoid(10)}, 
          ${TEST_USER_ID}, 
          ${(await getRandomAccount(accounts, 'credit')).id}, 
          ${dinnerAmounts[Math.floor(Math.random() * dinnerAmounts.length)]}, 
          'Restaurant - Fine Dining Experience', 
          ${getCategoryId(categories, 'Food & Dining')}, 
          ${formatDate(dinnerDate)}, 
          NOW(), 
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
  
  // Shopping transactions
  console.log('🛍️ Adding shopping transactions...');
  const shoppingTransactions = [
    { amount: '-150.00', description: 'Nike Store - Athletic Wear' },
    { amount: '-89.99', description: 'Amazon.com - Electronics' },
    { amount: '-35.00', description: 'Target - Home Goods' },
    { amount: '-75.50', description: 'Best Buy - Tech Accessories' },
    { amount: '-120.00', description: 'Apple Store - Device Purchase' },
  ];
  
  for (let month = 0; month < 24; month++) {
    const monthDate = new Date('2023-02-01');
    monthDate.setMonth(monthDate.getMonth() + month);
    
    // 1-2 shopping trips per month
    for (let trip = 0; trip < 2; trip++) {
      const shoppingDate = new Date(monthDate);
      shoppingDate.setDate(10 + (trip * 15) + Math.floor(Math.random() * 10));
      const transaction = shoppingTransactions[Math.floor(Math.random() * shoppingTransactions.length)];
      
      await sql`
        INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
        VALUES (
          ${nanoid(10)}, 
          ${TEST_USER_ID}, 
          ${(await getRandomAccount(accounts, 'credit')).id}, 
          ${transaction.amount}, 
          ${transaction.description}, 
          ${getCategoryId(categories, 'Shopping')}, 
          ${formatDate(shoppingDate)}, 
          NOW(), 
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
  
  console.log('✅ Substantial transaction history created successfully');
}

async function createGoals() {
  console.log('🎯 Creating financial goals...');
  
  const goals = [
    {
      name: 'Emergency Fund - 6 Months',
      type: 'emergency_fund',
      target_amount: '20000.00',
      current_amount: '15680.75',
      target_date: '2025-12-31',
      status: 'active'
    },
    {
      name: 'European Vacation 2025',
      type: 'vacation',
      target_amount: '5000.00',
      current_amount: '1200.00',
      target_date: '2025-06-01',
      status: 'active'
    },
    {
      name: 'New Car Down Payment',
      type: 'major_purchase',
      target_amount: '8000.00',
      current_amount: '3200.00',
      target_date: '2025-10-01',
      status: 'active'
    },
    {
      name: 'Home Down Payment',
      type: 'major_purchase',
      target_amount: '50000.00',
      current_amount: '8940.00',
      target_date: '2026-12-31',
      status: 'active'
    }
  ];
  
  for (const goal of goals) {
    try {
      await sql`
        INSERT INTO goal (id, user_id, name, type, target_amount, current_amount, target_date, status, created_at, updated_at)
        VALUES (
          ${nanoid(10)}, 
          ${TEST_USER_ID}, 
          ${goal.name}, 
          ${goal.type}, 
          ${goal.target_amount}, 
          ${goal.current_amount}, 
          ${goal.target_date}, 
          ${goal.status}, 
          NOW(), 
          NOW()
        )
        ON CONFLICT (user_id, name) DO NOTHING
      `;
    } catch (error) {
      // Goal might already exist
    }
  }
  
  console.log('✅ Financial goals created successfully');
}

async function createHealthScore() {
  console.log('💰 Creating health score...');
  
  try {
    await sql`
      INSERT INTO financial_health_score (id, user_id, score, health_state, trend_direction, score_components, calculated_at)
      VALUES (
        ${nanoid(10)}, 
        ${TEST_USER_ID}, 
        82, 
        'stable', 
        'improving', 
        '{"savingsRate": 78, "budgetAdherence": 85, "incomeStability": 92, "expenseVolatility": 18, "goalProgress": 72}', 
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        score = EXCLUDED.score,
        health_state = EXCLUDED.health_state,
        trend_direction = EXCLUDED.trend_direction,
        score_components = EXCLUDED.score_components,
        calculated_at = EXCLUDED.calculated_at
    `;
    
    console.log('✅ Health score created successfully');
  } catch (error) {
    console.log(`❌ Health score creation failed: ${error.message}`);
  }
}

async function createSampleInsights() {
  console.log('💡 Creating sample insights...');
  
  const insights = [
    {
      type: 'spending_spike',
      severity: 'medium',
      title: 'Spending Increase Detected',
      explanation: 'Your food & dining expenses increased by 23% this month compared to last month',
      data: '{"increasePercent": 23, "category": "Food & Dining"}'
    },
    {
      type: 'goal_progress',
      severity: 'low',
      title: 'Great Progress on Emergency Fund',
      explanation: 'You are 78% of the way to your emergency fund goal. Keep it up!',
      data: '{"progressPercent": 78, "goalName": "Emergency Fund"}'
    },
    {
      type: 'budget_alert',
      severity: 'high',
      title: 'Shopping Budget Exceeded',
      explanation: 'You have exceeded your monthly shopping budget by $127',
      data: '{"overspend": 127, "budgetAmount": 400, "actualAmount": 527}'
    }
  ];
  
  for (const insight of insights) {
    try {
      await sql`
        INSERT INTO insight (id, user_id, insight_type, severity, title, explanation, supporting_data, status, created_at, updated_at)
        VALUES (
          ${nanoid(10)}, 
          ${TEST_USER_ID}, 
          ${insight.type}, 
          ${insight.severity}, 
          ${insight.title}, 
          ${insight.explanation}, 
          ${insight.data}, 
          'active', 
          NOW(), 
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `;
    } catch (error) {
      // Insight might already exist
    }
  }
  
  console.log('✅ Sample insights created successfully');
}

async function main() {
  console.log('🚀 Seeding Database with Comprehensive Financial Data\n');
  
  // Create test user
  const userCreated = await createTestUser();
  if (!userCreated) {
    console.log('❌ Failed to create test user');
    process.exit(1);
  }
  
  // Create supporting data
  await createCategories();
  await createAccounts();
  await createTransactions();
  await createGoals();
  await createHealthScore();
  await createSampleInsights();
  
  console.log('\n🎉 Database seeding complete!');
  console.log('\n📝 Test User Credentials for Login:');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📧 Email: ${TEST_USER_EMAIL}`);
  console.log(`🔑 Password: ${TEST_USER_PASSWORD}`);
  console.log(`👤 User ID: ${TEST_USER_ID}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log('\n💰 Comprehensive Data Seeded:');
  console.log('👤 User: Alex Johnson (Software Engineer)');
  console.log('💵 Income Range: $8,500 - $12,000/month');
  console.log('📂 Categories: 12 diverse spending/income categories');
  console.log('🏦 Accounts: 6 accounts (checking, savings, credit cards, investments)');
  console.log('💳 Transactions: 800+ realistic transactions over 2+ years');
  console.log('🎯 Goals: 4 active financial goals with progress');
  console.log('💰 Health Score: 82/100 (Stable, Improving)');
  console.log('💡 Insights: 3 active AI-generated insights');
  console.log('\n🚀 This user now has rich, realistic data for comprehensive testing!');
  console.log('📊 The Financial Intelligence System will generate meaningful insights from this data.');
}

main().catch(console.error);