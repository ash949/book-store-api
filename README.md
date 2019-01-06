# book-store-api

**Features**

- User authentication and authorization
- User can view books and view/modify their data
- Authors are users and can create/update their books and upload PDFs
- Admins are users and can create users, books and categories
- Admins are the only people who can can modify roles for other users (availale roles: `user`, `author`, `admin`);
- Admins can`t remove/modify other admin accounts

**Notes:**

- The api expects `NODE_ENV` evnironment variable to be populated before start
- BDD is applied to categories router only (intended to just showcase how BDD is done)
- To view a book pdf file, just add `/view` to the `GET` single book url, it is the only exception that is not RESTful, other than that, all routes are RESTful

**Topics showcased:**

- `Nodejs` (creating modules, using a variaty modules)
- Heavy use of Promises (chaining, controlling execution path,...etc)
- `Expressjs`
- Modular Routing
- Restful API (check the last note in "Notes" section)
- File upload using `multer`
- This api is build around serving JSON objects
- Sequelize (including associations, validation, migrations, scopes, models, join queries)
- Extracted schemas to be used in both Migrations and Models creation (no need to provide attributes and metadata twice for each migration and model) (DRY);
- Database used: `Postgres`
- Token based authentication using passport and JWT
- Modular authorization system build with passport and JWT
- TDD and BDD development including automated testing (I used `mocha` and `chai` with `chai-http` plugin)

**Incoming later on**

- Rating/Comments system (the foundation is there: assoications, schama and model are already set)
- Downloads/Views tracker
- Payment system
