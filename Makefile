IMAGE=vivekbhandari/messenger

image-dev:
	docker build -f ./Dockerfile_dev -t ${IMAGE} .

image:
	docker build -t ${IMAGE} .

start-dev:
	docker run -dt --name messenger --hostname messenger -p 3000:3000 ${IMAGE}

start:
	docker-compose -f docker-compose.yml up -d

redis:
	docker run -it --network messenger_mynet123 --name redis-cli --rm redis redis-cli -h redis

logs:
	docker logs -f messenger_messenger_1

stop:
	docker stop `docker ps --no-trunc -aq`
	docker rm `docker ps --no-trunc -aq`

