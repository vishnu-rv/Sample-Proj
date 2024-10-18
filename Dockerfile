# Use the official Node.js image as the base
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the .env file into the container
COPY .env ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
