# Use official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port (Ensure it matches what your server uses)
EXPOSE 4000

# Start the server
CMD ["npm", "run", "dev"]
