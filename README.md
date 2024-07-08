# plant-store
Online Plant Store





I. Enabling transactions for the backend:
	1. You need to create some replica sets connected to your database:
	2. CMD -> 

mongod --replSet rs0 --port 27017 --dbpath D:\Dev\Web_Projects\plant-store\mongo-replicas\store\d1 --bind_ip localhost
mongod --replSet rs0 --port 27018 --dbpath D:\Dev\Web_Projects\plant-store\mongo-replicas\store\d2 --bind_ip localhost
mongod --replSet rs0 --port 27019 --dbpath C:\Program Files\MongoDB\Server\7.0\data --bind_ip localhost // ??????????
D:\Dev\Web_Projects\plant-store\mongo_replicas\db1
D:\Dev\Web_Projects\plant-store\mongo-replicas\store\d1
	*. if mongod doesn't work:
		1. Window key -> type Path -> Enter -> Open Environment Variables -> Click on Path -> Click Edit -> Click New -> paste mongoDB path to mongodb (by default C:\Program Files\MongoDB\Server\7.0\bin)