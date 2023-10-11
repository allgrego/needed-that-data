FROM node:16-alpine AS builder

LABEL maintainer="Gregorio Alvarez <allgrego14@gmail.com>"

WORKDIR /home/node/app

RUN chown -R node:node /home/node/app \
    && touch /home/node/app/.timestamp \
    && ls -la /home/node/app;

USER node

# RUN rm -rf ./env

COPY ./ ./

RUN npm ci && npm cache clean --force


RUN npm run build

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

FROM node:16-alpine AS final 

LABEL maintainer="Gregorio Alvarez <allgrego14@gmail.com>"

WORKDIR /home/node/app

COPY --from=builder ./home/node/app/dist ./dist
COPY package*.json ./

RUN chown -R node:node /home/node/app \
    && touch /home/node/app/.timestamp \
    && ls -la /home/node/app;

USER node

RUN npm install --omit=dev

ARG NODE_ENV=production
ARG PORT=8000
ARG APP_VERSION='1.2.1'
ARG NODE_TLS_REJECT_UNAUTHORIZED=0
ARG DOCUMENTATION_URL='https://github.com/allgrego/needed-that-data/blob/main/README.md'
ARG CNE_EXAMPLE_CID='12123123'

ENV NODE_ENV ${NODE_ENV}
ENV PORT ${PORT}
ENV APP_VERSION ${APP_VERSION}
ENV NODE_TLS_REJECT_UNAUTHORIZED ${NODE_TLS_REJECT_UNAUTHORIZED}
ENV DOCUMENTATION_URL ${DOCUMENTATION_URL}
ENV CNE_EXAMPLE_CID ${CNE_EXAMPLE_CID}


EXPOSE 8000
CMD [ "npm", "start" ]