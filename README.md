To get updates from staging branch:

1. Make sure you're on staging branch (git checkout staging)
2. Pull the latest changes (git pull origin staging)

To get updates from a feature branch:

1. Fetch all branches (git fetch origin)
2. Switch to the feature branch (git checkout feature/admin-panel)
3. Pull the latest changes (git pull origin feature/admin-panel)

Or to merge feature branch into your current branch:

1. Fetch all branches (git fetch origin)
2. Merge the feature branch (git merge origin/feature/admin-panel)

To merge feature branch into staging:

1. Make sure all changes are committed (git status)
2. Switch to staging branch (git checkout staging)
3. Merge the feature branch (git merge feature/admin-panel)
4. Push to staging (git push origin staging)

To push changes to main Github branch:
1. Sync everything on staging (commit)
2. Switch to the main branch (git checkout main)
3. Merge changes (git merge staging)
4. Push changes (git push origin main)
