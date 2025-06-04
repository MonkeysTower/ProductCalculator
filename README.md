# ProductCalculator (Calculation Web Application)
## Project Description
This is a web application developed using Django (backend) and React (frontend) technologies. The project is designed to perform product cost calculations for registered users. All the products have a hierarchical structure (Category>Product Type>Product Series). In this case, the main distinguishing feature is the absence of the ability to register users without the knowledge of the administrator. The application is packaged in Docker containers for easy deployment and scalability.

---
## Application features
 - Fresh news publication: the app shows the latest published news stored in the application's database, while the photo for this post can be either stored locally or taken from another internet resource (http).
 - Product cost calculation: registered users can authorise on the site to get the product cost calculation depending on the product parameters, and the calculation is started by the developer with the help of separate py-modules. 
 - Access: Users who are not authorised will not be able to get the calculation, which allows to keep confidentiality.
 - Registration: registration does not take place without the knowledge of the administrator. When registering, the data specified by the user is sent to the administrator, who in turn adds it to the database, thus eliminating the possibility of access to the calculation by undesirable persons.
 - Support: The user can also contact the technical support of the site and his request will be sent to the corresponding e-mail specified in .env.
---
## Technologies
 - Backend : Django (Python 3.11)
 - Frontend : React (Node.js 18)
 - Database : PostgreSQL
 - Authentication : JWT (JSON Web Tokens) using rest_framework_simplejwt
 - Containerization : Docker + Docker Compose
 - Reverse Proxy : Nginx
 - Additional Features : CORS, REST API

---
## Project Structure
```
ProjectSite/
├── django/                 # Backend (Django)
│   ├── manage.py           # Django management script
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Dockerfile for the backend
│   └── ...
├── react/                  # Frontend (React)
│   ├── src/                # React source code
│   ├── package.json        # Node.js dependencies
│   ├── Dockerfile          # Dockerfile for the frontend
│   └── ...
├── nginx/                  # Nginx configuration
│   ├── nginx.conf          # Main configuration file
│   └── Dockerfile          # Dockerfile for Nginx
│ 
├── .env.sample             # Example of required environment variables for an .env file
├── docker-compose.yml      # Main Docker Compose file
└── README.md               # Project documentation
```

---
## Installation and Setup

### Prerequisites
#### 1. Installed Tools:
 - Docker ([installation guide](https://docs.docker.com/get-started/get-docker/))
 - Docker Compose (included in Docker Desktop)

#### 2. Dependencies:
 - Ensure that ports 80, 8000, DB_PORT (in .env), and 3000 are free on your machine.

---
### Steps to Run
#### 1. Clone the Repository:
```bash
git clone https://github.com/MonkeysTower/ProductCalculator.git 
cd ProductCalculator
```

#### 2.Create `.env` file:
 - Create an .env file in the main directory following the example of the .env.sample file

#### 3.Start the Containers:
```bash
docker-compose up --build
```


#### After successful startup, the application will be available at: `http://localhost:3000`

---
## Working with the Project
### API
 - API is accessible at:
```https
http://localhost:8000/api/
```

 - Django admin panel
```https
http://localhost:8000/admin/
```

 - For create a superuser to access the admin panel:
```
docker exec -it <backend_container_id> python manage.py createsuperuser
```

 - For create a initial working sample data use:
```
docker exec -it <backend_container_id> python manage.py create_sample_data
```

 - If you make changes to Django models, apply migrations: reduild Containers

---
## Contact
If you have any questions or suggestions, feel free to contact me:
 - Email: Trifandre@yandex.ru
 - GitHub: <https://github.com/MonkeysTower/>