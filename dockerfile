# Use the official Node.js image as a base
FROM node:18

# Install necessary dependencies for Chromium
RUN apt-get update && apt-get install -y \
    chromium-browser \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libasound2 \
    libxshmfence1 \
    libnss3-tools \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright and its dependencies
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .

# Build your application if necessary
# RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to start both your application and Playwright tests
CMD ["npm", "start"]