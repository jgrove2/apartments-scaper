# Apartments.com Scraper
The apartments.com scraper is given a url for a outlined area from apartments.com and over the course of time that it is running it will scrape and update the user on new apartments that appear fitting the description they want. If a new apartment appears it will send a message to a discord channel. The user can also ask to view all apartments currently listed that fit their description.

## Setup

### Prerecs

| Technology | Version |
| ---------- | -------- |
| Bun | 1.0.0 |
| sqlite | X |

### Install

```bash
git clone {repo}
cd apartment-scraper
```

### Build/Run

```bash
npm run start
```

## Instructions

### Sqlite Database

- If there is no sqlite database file in the db folder open a new folder there
- The table will be created on start of the program if it is not already there

### Discord Bot

- On startup the discord bot every hour will check and see if there is any new apartments. If there is it will send data to the channel you set up in env

#### Commands

- /view-all
    - will return a table of all apartments fitting the description from env variables
- /ping
    - Used to test will just return with Pong

### Scraper

- Give all ids in env variables
- Give url from apartments.com
- Every 2 hours on the turn of the hour it will scrap and send data into the sqlite apartments table