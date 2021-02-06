# Tutlið booking

## Getting started
1. rename `docker.env.sample` to `docker.env`. The file is ignored as it might contain secrets in the future.
2. Run docker-compose up --build or use Docker extension for VSCode and right click on docker-compose.yml and select 'Compose Up'

## Generating database migrations
When needing to add new tables, columns or making any other changes to the database model in general you need to make the changes in code, and then generate a migration file for these changes.
To generate a migration do the following:
1. navigate to the server folder containing package.json and a Dockerfile.
2. run `yarn run docker:migration:generate <migration_name>` if any changes have been detected a new migration file will be created in `migrations` folder with the given migration name (`<migration_name>`).

## Heroku Secrets ##

run: heroku authorizations:create to get an API key