# API Integration Setup Guide

This guide explains how to integrate **Solana**, **Snowflake**, and **Vultr** APIs into CreativeArmor.

## 🟣 Solana Integration

### Purpose
Store scan events immutably on the Solana blockchain for trust and verification.

### Setup Steps

1. **Install Solana Web3.js**
   ```bash
   npm install @solana/web3.js @solana/spl-token
   ```

2. **Get Started with Solana**
   - Visit: https://mlh.link/solana
   - Create a Solana wallet
   - Get testnet SOL from: https://faucet.solana.com

3. **Configure Environment Variables**
   ```env
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   SOLANA_WALLET_PRIVATE_KEY=your_private_key_here
   ```

4. **Update `services/solanaService.ts`**
   - Uncomment the production code
   - Replace mock implementation with actual Solana transactions
   - Use `Connection`, `Keypair`, and `Transaction` classes

5. **Example Implementation**
   ```typescript
   import { Connection, Keypair, Transaction, SystemProgram } from '@solana/web3.js';
   
   const connection = new Connection(process.env.SOLANA_RPC_URL!);
   const wallet = Keypair.fromSecretKey(Buffer.from(process.env.SOLANA_WALLET_PRIVATE_KEY!, 'hex'));
   
   // Create transaction to store scan event
   const transaction = new Transaction().add(
     // Your program instruction here
   );
   
   const signature = await connection.sendTransaction(transaction, [wallet]);
   ```

### Resources
- Solana Docs: https://docs.solana.com/
- Web3.js Docs: https://solana-labs.github.io/solana-web3.js/
- Get Started: https://mlh.link/solana

---

## ❄️ Snowflake Integration

### Purpose
Powerful analytics and data warehousing for scan metrics and insights.

### Setup Steps

1. **Sign Up for Snowflake**
   - Visit: https://mlh.link/snowflake-signup
   - Get 120-day free trial (student special)
   - Create your account

2. **Create Database and Table**
   ```sql
   CREATE DATABASE creativearmor;
   USE DATABASE creativearmor;
   
   CREATE TABLE scan_events (
     scan_id VARCHAR PRIMARY KEY,
     timestamp TIMESTAMP,
     detected_incident BOOLEAN,
     confidence_score FLOAT,
     defense_activated BOOLEAN,
     platform VARCHAR,
     alert_id VARCHAR
   );
   ```

3. **Get API Credentials**
   - Go to Snowflake Dashboard
   - Navigate to Admin → Users
   - Create API user or use your account
   - Note your account URL (e.g., `xy12345.us-east-1`)

4. **Configure Environment Variables**
   ```env
   SNOWFLAKE_ACCOUNT=xy12345
   SNOWFLAKE_USERNAME=your_username
   SNOWFLAKE_PASSWORD=your_password
   SNOWFLAKE_WAREHOUSE=COMPUTE_WH
   SNOWFLAKE_DATABASE=creativearmor
   ```

5. **Update `services/snowflakeService.ts`**
   - Uncomment the production code
   - Replace mock implementation with actual REST API calls
   - Use the Snowflake REST API endpoint

6. **Example API Call**
   ```typescript
   const response = await fetch(`https://${account}.snowflakecomputing.com/api/v2/statements`, {
     method: 'POST',
     headers: {
       'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
       'Content-Type': 'application/json',
       'X-Snowflake-Account': account,
     },
     body: JSON.stringify({
       statement: 'SELECT COUNT(*) FROM scan_events',
       warehouse: 'COMPUTE_WH',
       database: 'creativearmor',
     }),
   });
   ```

### Resources
- Snowflake REST API: https://docs.snowflake.com/en/developer-guide/sql-api
- Get Started: https://mlh.link/snowflake
- SQL API Reference: https://docs.snowflake.com/en/developer-guide/sql-api/intro

---

## 🟢 Vultr Integration

### Purpose
Scalable object storage for deepfake images and scan artifacts.

### Setup Steps

1. **Sign Up for Vultr**
   - Visit: https://mlh.link/vultr
   - Create account and claim free credits
   - Navigate to Object Storage

2. **Create Object Storage Bucket**
   - Go to Vultr Dashboard → Object Storage
   - Create new bucket: `creativearmor-scans`
   - Note your endpoint (e.g., `ewr1.vultrobjects.com`)

3. **Get Access Keys**
   - Go to Object Storage → Access Keys
   - Create new access key
   - Save Access Key ID and Secret Key

4. **Install AWS SDK** (Vultr is S3-compatible)
   ```bash
   npm install @aws-sdk/client-s3
   ```

5. **Configure Environment Variables**
   ```env
   VULTR_ENDPOINT=ewr1.vultrobjects.com
   VULTR_REGION=ewr1
   VULTR_ACCESS_KEY=your_access_key
   VULTR_SECRET_KEY=your_secret_key
   VULTR_BUCKET=creativearmor-scans
   ```

6. **Update `services/vultrService.ts`**
   - Uncomment the production code
   - Replace mock implementation with actual S3 client calls
   - Use `S3Client` and `PutObjectCommand`

7. **Example Implementation**
   ```typescript
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
   
   const s3Client = new S3Client({
     endpoint: `https://${process.env.VULTR_ENDPOINT}`,
     region: process.env.VULTR_REGION,
     credentials: {
       accessKeyId: process.env.VULTR_ACCESS_KEY!,
       secretAccessKey: process.env.VULTR_SECRET_KEY!,
     },
   });
   
   const command = new PutObjectCommand({
     Bucket: process.env.VULTR_BUCKET,
     Key: `deepfakes/${scanId}/${filename}`,
     Body: imageBuffer,
   });
   
   await s3Client.send(command);
   ```

### Resources
- Vultr Object Storage: https://www.vultr.com/docs/vultr-object-storage/
- AWS S3 SDK Docs: https://docs.aws.amazon.com/sdk-for-javascript/v3/
- Get Started: https://mlh.link/vultr

---

## 🔧 Quick Start Checklist

### Solana
- [ ] Install `@solana/web3.js`
- [ ] Create Solana wallet
- [ ] Get testnet SOL
- [ ] Set `SOLANA_RPC_URL` and `SOLANA_WALLET_PRIVATE_KEY`
- [ ] Update `services/solanaService.ts`

### Snowflake
- [ ] Sign up at https://mlh.link/snowflake-signup
- [ ] Create database and table
- [ ] Get account URL and credentials
- [ ] Set Snowflake environment variables
- [ ] Update `services/snowflakeService.ts`

### Vultr
- [ ] Sign up at https://mlh.link/vultr
- [ ] Create Object Storage bucket
- [ ] Get access keys
- [ ] Install `@aws-sdk/client-s3`
- [ ] Set Vultr environment variables
- [ ] Update `services/vultrService.ts`

---

## 🎯 Integration Points

### Current Mock Services
- `services/solanaService.ts` - Stores scan events on blockchain
- `services/snowflakeService.ts` - Analytics and metrics
- `services/vultrService.ts` - Image and file storage

### Where They're Used
- **Solana**: Dashboard → Scan History card, Ledger page
- **Snowflake**: Dashboard → Analytics card
- **Vultr**: ActiveDefense component (for storing deepfake images)

---

## 🏆 MLH Prize Eligibility

To qualify for MLH prizes:

1. **Best Use of Solana**: Show Solana blockchain integration for immutable scan event storage
2. **Best Use of Snowflake API**: Demonstrate analytics powered by Snowflake REST API
3. **Best Use of Vultr**: Use Vultr Object Storage for scalable file storage

Make sure to:
- Actually connect to these services (not just mock)
- Document your integration
- Show real data flowing through the APIs
- Mention MLH prizes in your demo/presentation

---

## 📝 Notes

- All services currently use mock implementations for development
- Uncomment production code when ready to integrate
- Test with free tiers before scaling
- Keep API keys secure (use `.env.local` file)
- Add error handling for production use
