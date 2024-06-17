# Use the official Node.js image as the base image
FROM node:18

# Install necessary dependencies
RUN apt-get update && apt-get install -y supervisor curl wget gnupg unzip   chromium 

# You should install the dependencies required to run the browsers.
# There's no need to install chromium separately
RUN apt-get install -y libnss3 libasound2 libgbm-dev

# Install Playwright dependencies
RUN apt-get update && \
    apt-get install -y libnss3 libxss1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxcomposite1 libxrandr2 libgtk-3-0 libgbm1 --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

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

RUN npm run build

# Expose the port on which your app runs
EXPOSE 3000

# Run the app
CMD [ "npm", "start" ]
