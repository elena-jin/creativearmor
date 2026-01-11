<div align="center">

</div>

# CreativeArmor - Active Identity Defense

Protect your digital identity against deepfakes and AI-generated content using cryptographic biometric verification, powered by **Solana**, **Snowflake**, and **Vultr**.

## 🚀 Features

- 🔐 **Biometric Authentication** - Cryptographic identity verification
- 🛡️ **Active Defense** - Automated DMCA takedown requests
- 📊 **Analytics Dashboard** - Powered by Snowflake API
- ⛓️ **Blockchain Storage** - Immutable scan events on Solana
- ☁️ **Scalable Storage** - Deepfake images stored on Vultr Object Storage
- 🎯 **Real-time Detection** - AI-powered deepfake identification

## 🏆 MLH Prize Integrations

- **Solana** - Blockchain storage for scan events ([Get Started](https://mlh.link/solana))
- **Snowflake API** - Analytics and data warehousing ([Get Started](https://mlh.link/snowflake-signup))
- **Vultr** - Object storage for images ([Get Started](https://mlh.link/vultr))

## 📦 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables in `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_key
   
   # Optional: For full API integration
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   SNOWFLAKE_ACCOUNT=your_account
   VULTR_ACCESS_KEY=your_access_key
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

## 🔧 API Integration Setup

See [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for detailed instructions on integrating:
- **Solana** blockchain storage
- **Snowflake** analytics API
- **Vultr** object storage

## 📚 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Blockchain**: Solana (Web3.js)
- **Analytics**: Snowflake REST API
- **Storage**: Vultr Object Storage (S3-compatible)
- **AI**: Google Gemini API

## 🎯 Project Structure

```
creativearmor/
├── components/          # React components
├── services/           # API integrations
│   ├── solanaService.ts    # Solana blockchain
│   ├── snowflakeService.ts # Snowflake analytics
│   ├── vultrService.ts     # Vultr storage
│   └── geminiService.ts    # AI DMCA generation
├── API_SETUP_GUIDE.md  # Integration instructions
└── README.md           # This file
```

## 📝 License

MIT
