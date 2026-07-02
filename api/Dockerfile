FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm db:generate

# Set production environment
ENV NODE_ENV=production

EXPOSE 3001

# Use tsx to run TypeScript directly (avoids ESM issues with Prisma)
CMD ["pnpm", "tsx", "src/index.ts"]
