# Use the official Node.js image as the base image
FROM node:20

# Create and change to the app directory
WORKDIR /app

# Copy application dependency manifests to the container image
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install

# Copy local code to the container image
COPY . .

# Set the environment variable to development
ENV NODE_ENV=development

# Start the Next.js app in development mode
CMD ["npm", "run", "dev"]
