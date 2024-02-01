# MongoDB local

Checkout database folder.

# Run

sudo docker container start job-portal-local
sudo docker container stop job-portal-local

# Create User for database

mongo -u root -p password --authenticationDatabase admin
use freelancer-client
db.createUser({user: "mongo", pwd: "mongo", roles: [{role: "readWrite", db: "freelancer-client"}]});

# Note: Sometimes you have to run the create user command manually
