FROM ubuntu:22.04

WORKDIR /root/pocketbase
RUN apt update && apt install ca-certificates sendmail

RUN mkdir -p /root/pocketbase/pb_data

COPY ./pocketbase .

RUN chmod +x ./pocketbase

RUN ls -a

EXPOSE 8080

# start PocketBase
ENTRYPOINT ["./pocketbase", "serve", "--http=0.0.0.0:8080"]