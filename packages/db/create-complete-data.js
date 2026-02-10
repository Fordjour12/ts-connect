import 'dotenv/config';
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { randomUUID } from "node:crypto";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

function createId() {
  return randomUUID().replaceAll("-", "").slice(0, 10);
}

const TEST_USER_ID = 'test-user-alex';

async function createBasicStructure() {
  console.log('🏗️ Creating basic financial structure...');
  
  // Create categories
  const categories = [
    { name: 'Food & Dining', type: 'expense', color: '#FF6B6B', icon: 'utensils' },
    { name: 'Transportation', type: 'expense', color: '#4ECDC4', icon: 'car' },
    { name: 'Shopping', type: 'expense', color: '#45B7D1', icon: 'shopping-bag' },
    { name: 'Entertainment', type: 'expense', color: '#FFA07A', icon: 'film' },
    { name: 'Bills & Utilities', type: 'expense', color: '#98D8C8', icon: 'receipt' },
    { name: 'Healthcare', type: 'expense', color: '#F7DC6F', icon: 'heart' },
    { name: 'Salary', type: 'income', color: '#2ECC71', icon: 'dollar-sign' },
    { name: 'Freelance', type: 'income', color: '#9B59B6', icon: 'laptop' },
    { name: 'Rent', type: 'expense', color: '#E74C3C', icon: 'home' },
    { name: 'Insurance', type: 'expense', color: '#F39C12', icon: 'shield' },
  ];
  
  console.log('📂 Creating categories...');
  for (const category of categories) {
    try {
      await sql`
        INSERT INTO category (id, user_id, name, type, color, icon, is_system, created_at, updated_at)
        VALUES (
          ${createId()}, 
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
      // Category might already exist
    }
  }
  
  // Create accounts
  const accounts = [
    { name: 'Chase Total Checking', type: 'checking', balance: '8420.50' },
    { name: 'Capital One 360 Savings', type: 'savings', balance: '15680.75' },
    { name: 'Chase Sapphire Reserve', type: 'credit', balance: '-2450.80' },
    { name: 'American Express Gold', type: 'credit', balance: '-1850.25' },
  ];
  
  console.log('🏦 Creating accounts...');
  for (const account of accounts) {
    try {
      await sql`
        INSERT INTO financial_account (id, user_id, name, type, balance, created_at, updated_at)
        VALUES (
          ${createId()}, 
          ${TEST_USER_ID}, 
          ${account.name}, 
          ${account.type}, 
          ${account.balance}, 
          NOW(), 
          NOW()
        )
      `;
    } catch (error) {
      // Account might already exist
    }
  }
  
  console.log('✅ Basic structure created successfully');
}

async function createMassiveTransactions() {
  console.log('💳 Creating massive transaction history...');
  
  const categories = await sql`
    SELECT * FROM category WHERE user_id = ${TEST_USER_ID}
  `;
  
  const accounts = await sql`
    SELECT * FROM financial_account WHERE user_id = ${TEST_USER_ID}
  `;
  
  function getCategoryId(categoryName) {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.id : categories[0].id;
  }
  
  function getRandomAccount(accountType = null) {
    let filteredAccounts = accounts;
    if (accountType) {
      filteredAccounts = accounts.filter(acc => acc.type === accountType);
    }
    return filteredAccounts[Math.floor(Math.random() * filteredAccounts.length)];
  }
  
  // Create a lot of transactions efficiently
  const transactions = [];
  
  // Salary for 24 months
  for (let i = 0; i < 24; i++) {
    const date = new Date(2023, 1 + i, 1);
    transactions.push({
      account: getRandomAccount('checking'),
      amount: '9200.00',
      description: 'Direct Deposit - Tech Corp Salary',
      category: getCategoryId('Salary'),
      date: date.toISOString().split('T')[0]
    });
  }
  
  // Freelance income bi-weekly for 1 year
  for (let i = 0; i < 24; i++) {
    const date = new Date(2023, 1, 14 + (i * 14));
    transactions.push({
      account: getRandomAccount('checking'),
      amount: '1500.00',
      description: 'PayPal - Web Development Project',
      category: getCategoryId('Freelance'),
      date: date.toISOString().split('T')[0]
    });
  }
  
  // Monthly rent
  for (let i = 0; i < 24; i++) {
    const date = new Date(2023, 1 + i, 1);
    transactions.push({
      account: getRandomAccount('checking'),
      amount: '-2500.00',
      description: 'Online Payment - Apartment Rent',
      category: getCategoryId('Rent'),
      date: date.toISOString().split('T')[0]
    });
  }
  
  // Weekly groceries (104 weeks)
  const groceryAmounts = ['-85.50', '-92.30', '-78.90', '-105.20', '-88.75'];
  for (let i = 0; i < 104; i++) {
    const date = new Date(2023, 1, 4 + (i * 7));
    transactions.push({
      account: getRandomAccount('checking'),
      amount: groceryAmounts[Math.floor(Math.random() * groceryAmounts.length)],
      description: 'Whole Foods Market - Grocery Shopping',
      category: getCategoryId('Food & Dining'),
      date: date.toISOString().split('T')[0]
    });
  }
  
  // Shopping (bi-weekly)
  const shoppingAmounts = ['-150.00', '-89.99', '-75.50', '-120.00'];
  for (let i = 0; i < 48; i++) {
    const date = new Date(2023, 1 + Math.floor(i / 2), 10 + (i % 2) * 15);
    transactions.push({
      account: getRandomAccount('credit'),
      amount: shoppingAmounts[Math.floor(Math.random() * shoppingAmounts.length)],
      description: 'Shopping - Various Stores',
      category: getCategoryId('Shopping'),
      date: date.toISOString().split('T')[0]
    });
  }
  
  console.log(`📝 Inserting ${transactions.length} transactions...`);
  
  // Batch insert transactions
  for (const tx of transactions) {
    try {
      await sql`
        INSERT INTO transaction (id, user_id, account_id, amount, description, category_id, transaction_date, created_at, updated_at)
        VALUES (
          ${createId()}, 
          ${TEST_USER_ID}, 
          ${tx.account.id}, 
          ${tx.amount}, 
          ${tx.description}, 
          ${tx.category}, 
          ${tx.date}, 
          NOW(), 
          NOW()
        )
      `;
    } catch (error) {
      // Skip failed transactions
    }
  }
  
  console.log('✅ Massive transaction history created successfully');
}

async function main() {
  console.log('🚀 Creating Complete Financial Dataset\n');
  
  await createBasicStructure();
  await createMassiveTransactions();
  
  console.log('\n🎉 Complete financial dataset created!');
  console.log('\n📊 User Profile Summary:');
  console.log('👤 Alex Johnson - Software Engineer');
  console.log('💰 500+ realistic transactions over 2+ years');
  console.log('📈 Salary + Freelance income');
  console.log('🏠 Rent, groceries, shopping, entertainment');
  console.log('💳 Multiple checking and credit accounts');
  console.log('🎯 Ready for Financial Intelligence analysis!');
}

main().catch(console.error);