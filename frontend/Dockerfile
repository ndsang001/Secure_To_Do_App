# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire frontend code
COPY . .

# Expose frontend port
# Expose the correct frontend port (5173 as per docker-compose)
EXPOSE 5173

# Build Vite frontend
RUN npm run build

# Serve the app
CMD ["npm", "run", "dev", "--", "--host"]
