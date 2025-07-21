# Discord Verification Bot

A Discord bot designed to verify new Discord members by linking their Discord accounts with their Minecraft accounts.

## Features

- **User Verification:**  
  New Discord server members can verify their identity by linking their Discord account to their Minecraft account using the `/verify` command. Members have only 3 attempts; if exceeded, they will be rate limited for 5 minutes before they can try again.

- **User Unverification:**  
  Verified members can unverify themselves at any time.

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Cl0udyHi/Discord-Verification-Bot.git
   cd Discord-Verification-Bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the bot:**
   - Add your bot token to the `.env` file:
     ```env
     BOT_TOKEN=<YOUR_BOT_TOKEN>
     ```
   - Add your server ID, bot ID, and verification role ID:
     ```json
     {
       "guild_id": "<SERVER_ID>",
       "bot_id": "<YOUR_DISCORD_BOT_ID>",
       "verify_id": "<VERIFICATION_ROLE_ID>"
     }
     ```

4. **Run the bot:**
   ```bash
   npm start
   ```

## Usage

- When a new user joins, they must run the `/verify` command to receive the verification role.
- Upon successful verification, their Discord and Minecraft IDs are saved in `src/verify.json`.

## Notes

- This project is legacy code and may not reflect the latest best practices.
- For customizations or additional features, feel free to modify the source as needed.

## ⚖ License

This project is open-source. You are welcome to modify and use it as you wish.
