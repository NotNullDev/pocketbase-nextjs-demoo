FROM ubuntu:22.04

WORKDIR /root/pocketbase
RUN apt update && apt install ca-certificates -y


RUN mkdir -p /root/pocketbase/pb_data
COPY ./pocketbase/pb_data /root/pocketbase/pb_data

COPY ./pocketbase .

EXPOSE 8080

RUN ls

# start PocketBase
CMD ["./pocketbase", "serve", "http=0.0.0.0:8080"]