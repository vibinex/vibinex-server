FROM node:18.13.0
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
