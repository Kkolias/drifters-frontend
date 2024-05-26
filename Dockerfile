# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Nuxt 3 application
RUN pnpm run build

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "run", "start"]