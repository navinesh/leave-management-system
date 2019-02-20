# Leave management system

Server has been developed in Python and PostgreSQL database using flask web framework for RESTful API and Graphene-Python for GraphQL API

### How to Run the Project

Install the following libraries:

* flask
* httplib2
* sqlalchemy
* graphene
* graphene_sqlalchemy
* passlib
* psycopg2
* flask_graphql
* flask_seasurf
* flask_httpauth
* flask_cors

Create Postgres database (create a "lms" user in Postgres before running the command below. Else edit the file to change the username to that you have setup locally):
`psql -f database.sql`

Run the command `python application.py` to run the application

You can use Postman to create the admin user account by using `POST` request to send email, surname, othernames and password as a json object.

API is ```http://localhost:8080/addadminuser```

Payload: ```{"email": "example@example.com","password": "YourPassword", "surname": "YourSurname", "othernames": "YourOthernames"}```

Once the admin account has been created you can log in to the ````admin web app```` and create user accounts.

## Creator
Navinesh Chand
* https://twitter.com/navinesh
* https://github.com/navinesh
