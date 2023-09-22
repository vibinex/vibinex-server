FROM node:18.13.0
WORKDIR /app
COPY . .
RUN npm install
ENV NODE_ENV=development
CMD ["next", "dev", "-H", "0.0.0.0", "-p", "3000"]