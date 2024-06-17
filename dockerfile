# Use the official Node.js image as the base image
FROM node:18

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y wget gnupg && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable

# Install Playwright dependencies
RUN apt-get install -y libnss3 libxss1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 libxrandr2 libgtk-3-0 libgbm1

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install Playwright and Chromium
RUN npx playwright install chromium

# Copy the local code to the container image
COPY . .

# Expose the port on which your app runs
EXPOSE 3000

# Run the app
CMD [ "node", "index.js" ]
