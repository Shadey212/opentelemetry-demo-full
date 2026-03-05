# Playwright-based realistic traffic generator for Better Stack Store
# Uses the official MCR Playwright image which has Chromium pre-installed
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY script.js ./

# Run as non-root (playwright image ships with a non-root user)
USER pwuser

CMD ["node", "script.js"]
