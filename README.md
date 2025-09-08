# Project

## Description

PCC - Spots is a lightweight web app to collect, browse, and manage nightlife and dining spots.

- **Browse & search**: Free-text search across name, tags, zone, and city.
- **Filter**: By category (bar, dinner, aperitivo, club, other), cuisine, zone, and minimum rating.
- **Sort**: By name, rating, price, zone, category, date added, or by distance from your current location.
- **Add & edit spots**: Create new spots or update existing ones via a modal form.
- **Bulk import**: Import multiple spots at once; duplicates by name+city are skipped.
- **Persistence**: Data is stored in `localStorage`; initial data loads from `public/spots.json`.
- **Extras**: Quick Google search for a spot; visual rating and price indicators; tag chips; address display.

All features are mobile-friendly and work offline once loaded (thanks to local storage).

## How can I edit this code?

- Ensure you have Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Enter the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

Alternatively, you can edit files directly on GitHub or use GitHub Codespaces.

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
