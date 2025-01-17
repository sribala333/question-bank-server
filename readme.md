project-root/
├── src/
│   ├── controllers/      # Define application logic for handling routes
│   │   ├── userController.js
│   │   ├── productController.js
│   ├── routes/           # Route definitions and configurations
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   ├── models/           # Database schemas or models
│   │   ├── userModel.js
│   │   ├── productModel.js
│   ├── middlewares/      # Custom middleware for request validation or authentication
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   ├── config/           # Configuration files
│   │   ├── database.js
│   │   ├── appConfig.js
│   ├── utils/            # Utility functions/helpers
│   │   ├── logger.js
│   │   ├── validators.js
│   ├── app.js            # App initialization and middleware setup
│   ├── server.js         # Starting the server
├── .env                  # Environment variables
├── package.json          # Dependencies and scripts




Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.
5. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

More information in our documentation:
https://pris.ly/d/getting-started

npx prisma db pull


Composite Unique Constraint  @@unique([user_id, dept_role_id])
npx prisma db push