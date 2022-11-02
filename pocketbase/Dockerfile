FROM ubuntu:22.04

WORKDIR /root/pocketbase

RUN mkdir -p /root/pocketbase/pb_data
COPY pb_data /root/pocketbase/pb_data

COPY . .

ARG POCKETBASE_PORT=8080

EXPOSE ${POCKETBASE_PORT}

# start PocketBase
CMD ["./entrypoint.sh"]