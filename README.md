# Pinata Cleanup Script

This script helps you unpin old and unused Pinata pins programmatically. This is useful when you programmatically pin files, like backups, and want to delete old ones after a while.

## Usage

- Clone this repo
- Run `yarn` inside the folder on Node 14.16 or newer
- Copy and modify the `config.example.js` file into `config.js`
- Run with `node index.js`

Ideally you would set this thing up to work on a cronjob, so that it auto-cleans regularly.

### How it works

Currently there are no batch operations on Pinata's API, and there's no way to bulk-unpin, so what the script does is:

1. Gets all the pins that need to be unpinned, one page of 1000 records at a time and combines them
2. Processes all the pins one after the other.

The speed it can reach is about ~50 per minute, so set your cronjobs accordingly.

## Configuration Options

- `API key` & `API secret` can be obtained from Pinata on the API Keys page of your profile
- `olderThanMinutes` is the age below which a file will not be unpinned. E.g. if you pinned something 59 minutes ago, and the value is 60, then this pin is immune.
- `names` is an array of filenames to target. So if your backups are named "db_backup.sql" and "images_backups.zip", you would put those. This value is always an array evne when it's just one name.
- `leaveMinimum` will leave at least that many pins alive, not cleaning them all.

## Recent

The `recent` script will just list all the recent pins with the config-defined names. Just run `node recent.js`.