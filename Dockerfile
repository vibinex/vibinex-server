FROM node:18.13.0
WORKDIR /app
COPY . .
RUN npm install

# Set NODE_ENV to development for the build phase
ENV NODE_ENV=development
RUN npm run build

# Optionally, reset NODE_ENV to production or another value for runtime
# ENV NODE_ENV=production

CMD ["npm", "start"]
