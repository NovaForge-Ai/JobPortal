FROM node:18.18.0
RUN npm install -g nodemon
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5053
ENV NODE_ENV=development
ENV JWT_SECRET=your_jwt_secret_key
ENV PORT=5053
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5053/ || exit 1
CMD ["npm", "run", "start"]
