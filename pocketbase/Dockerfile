FROM ubuntu:22.04

WORKDIR /root/pocketbase
RUN apt update && apt install ca-certificates -y


RUN mkdir -p /root/pocketbase/pb_data
COPY pb_data /root/pocketbase/pb_data

COPY . .

ARG POCKETBASE_PORT=8080

EXPOSE ${POCKETBASE_PORT}

# start PocketBase
CMD ["./entrypoint.sh"]