FROM ubuntu:22.04

WORKDIR /root/pocketbase

RUN mkdir -p /root/pocketbase/pb_data
COPY ./pocketbase/pb_data /root/pocketbase/pb_data

COPY ./pocketbase .

ARG POCKETBASE_PORT=8080


EXPOSE ${POCKETBASE_PORT}

RUN ls

# start PocketBase
CMD ["./entrypoint.sh"]