db.createUser(
    {
        user: 'su_tutlid',
        pwd: 'superstrong-password',
        roles: [
            {
                role: "readWrite",
                db: "tutlid"
            }
        ]

    }
)