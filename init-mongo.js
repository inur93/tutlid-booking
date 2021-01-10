db.createUser(
    {
        user: 'tutlid_api_user',
        pwd: 'mQmxL1hlh8NnqmrcqVnFsFjzQLdiUVbd',
        roles: [
            {
                role: "readWrite",
                db: "tutlid"
            }
        ]

    }
)