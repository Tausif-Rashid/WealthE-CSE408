
Testing : db-only docker image runs at :5401, but no data in it, sql backup fails
docker compose db at :5454 (will change back)

ALTER DATABASE "your_database_name" SET lc_monetary = 'en_US.UTF-8';

#run dev version with:
#docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

pg_dump -U postgres -d WealthEdb1 -F c -f backupv13.dump
New Machine:
createdb -U your_user your_database
pg_restore -U your_user -d your_database -F c backupv13.dump

Delete existing volumes if new restore required(not needed 1st time)
docker volume ls #list volumes
docker compose down
docker volume rm <name of db vol to delete>

#put backupv13.dump ,  restore.sh in same directory as compose file
#make restore.sh executable by running in bash: chmod +x restore.sh 
docker-compose -f docker-compose-db-only.yml up

pgadmin can connect this db, r-click server, register, give port and credentials


#in compose file, host:container ports are used, other services use container port, only external services use host port
# ie. browser, pgadmin 