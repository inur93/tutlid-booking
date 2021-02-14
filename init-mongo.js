db.createUser(
    {
        user: process.env.DEFAULT_API_USER_USERNAME,
        pwd: process.env.DEFAULT_API_USER_PASSWORD,
        roles: [
            {
                role: "readWrite",
                db: "tutlid"
            }
        ]

    }
)