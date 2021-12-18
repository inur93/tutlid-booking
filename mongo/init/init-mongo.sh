#!/bin/bash

# console.log('this is a test from my friend Joe');
# db.createDatabase('tutlid');
# db = db.getSiblingDB('admin')
# db.auth("root", "example")
# db.getSiblingDB("tutlid")

echo "hello from init-mongo.sh"
set -e
mongo <<EOF
use $MONGO_INITDB_DATABASE
db.createUser(
    {
        user: '$DEFAULT_API_USER_USERNAME',
        pwd: '$DEFAULT_API_USER_PASSWORD',
        roles: [
            {
                role: "readWrite",
                db: "tutlid"
            }
        ]
    }
)
db.createCollection("bookings")
EOF