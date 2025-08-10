# InfluNest: Automate Campains with Blockchain MORPH

> _TEAM InfluNest: http://influnest-morph.vercel.app/

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Platform](https://img.shields.io/badge/Platform-MiniApp-blue)
![Blockchain](https://img.shields.io/badge/Blockchain-Morph-blue)

---

### 🌐 Introduction

Our Application automates influencer campaigns, integrating blockchain technology to ensure transparency, security, and agility.

---

### 🌐 Influencer and Brand Application

- Influencer: [Click here](https://influnest-morph.vercel.app/)
- Link Payment Brand: [Click here](https://influnest-morph.vercel.app/campaign-pay/32482)

---

### 🔴 Morph Application     

We created a Application on Morph using the rainbowkit and wagmi resources from the official documentation. We leveraged the available tools to deliver an integrated, efficient solution that's fully aligned with the Morph ecosystem.

--- 

### 🔗 Smart Contracts on Morph Holesky

📄 **Deployed Contracts:**  

- 🪙 [CampaignManager](https://explorer-holesky.morphl2.io/address/0x2ea1a20e0cc5f508fe0d5a73d9e4d78c3dc88ee6) (Manager Campaings)
- 📡 [OracleConnector](https://explorer-holesky.morphl2.io/address/) (Oracle for collect data API Instagram)
- ⚽ [Payment Vault](https://explorer-holesky.morphl2.io/address/0x3edf04039da966b28778a8e26fa1b5dbdf4da4ac) (For payments Influencers)
- 💵 [USDC](https://explorer-holesky.morphl2.io/address/0xe8ef6b6b76c31299cfc5b91e8ebb4d7ac79ffa51) (USDC for Payments) 

⚠️ Actively in development · Live on **Morph Holesky** (Note: Transactions may be pending due to network congestion)

---

### 🔁 End-to-End MiniApp Flowchart

![DApp Flowchart](https://github.com/user-attachments/assets/)

---

## 🛠 Installation (Front-end)

1. **Pre-requisites**
    - Make sure you have NodeJS installed on your machine.

2. **Clone the Repository**

    ```bash
    git clone https://github.com/bellujrb/influnest/front-end
    ```

3. **Install Dependencies**

    ```bash
    npm install
    ```

4. **Run the App**

    ```bash
    npm run dev
    ```

---

## 📂 Project File Tree
    
```
influnest
├── front-end
│   └── abi
│       └── CampaignManager.json
│       └── OracleConnector.json
│       └── PaymentVault.json
│   └── app
│       └── api
│           └── balance
│           └── instagram
│           └── notify
│           └── transactions
│           └── webhook
│       └── campaign-pay
│           └── [id]
│               └── page.tsx
│       └── components
│           └── ...
│       └── contexts
│           └── campaign-context.tsx
│       └── hooks
│           └── useCampaignForm.ts
│           └── useCampaigns.ts
│           └── useCreateCampaign.ts
│           └── useWalletBalance.ts
│           └── useWalletTransactions.ts
│       └── globals.css
│       └── layout.tsx
│       └── page.tsx
│       └── providers.tsx
│       └── theme.css
│   └── components
│       └── ...
│   └── lib
│   └── ...
├── blockchain
│   └── abi
│       └── CampaignManager.json
│       └── OracleConnector.json
│       └── PaymentVault.json
│   └── broadcast
│       └── ...
│   └── lib
│       └── ...
│   └── script
│       └── Deploy.s.sol
│   └── src
│       └── CampaignManager.sol
│       └── OracleConnector.sol
│       └── PaymentVault.sol
│       └── USDC.sol
│   └── deploy.sh
├── README.MD
```
---

#### `influnest`

- `front-end`
    - Frontend Application
- `blockchain`
    - Blockchain Application
- `README.md`
    - Documentation Project

---

## 🙏 Acknowledgments

Special thanks to Morph for this ambitious opportunity.
