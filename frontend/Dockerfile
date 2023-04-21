ARG ba_platform=amd64
# base image
FROM --platform=${ba_platform} node:18-alpine
ARG BUILD_ENV=development

WORKDIR /app

COPY ./frontend /app

RUN npm install --global vite
RUN yarn


EXPOSE 8080

CMD ["yarn", "dev"]