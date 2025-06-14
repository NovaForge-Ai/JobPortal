FROM --platform=linux/arm64 node:18.18.0
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN rm -rf node_modules package-lock.json && \
    npm install --platform=linux --arch=arm64

# Copy the rest of the application
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]