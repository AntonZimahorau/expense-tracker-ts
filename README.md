# Expense Tracker

## Technology Stack

- React 19 with TypeScript
- Create React App for build tooling and development
- HTTP client: axios
- Sentry for error tracking and performance monitoring

## Docker compose

```bash
docker-compose -f docker-compose.yaml up -d --build
docker-compose -f docker-compose.yaml down
```
App is available at http://localhost:3000/

## Development

To get started with development:

```bash
# Start database
docker-compose up -d db

# Down databese
docker-compose down

# Start backend
cd backend
sh start.sh

# Start development server
cd frontend
npm install
npm start

# Run tests
npm run test

# Run linters
npm run lint
npm run stylelint
npm run format

# Build for production
npm run build
