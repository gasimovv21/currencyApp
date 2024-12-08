# CurrencyApp

CurrencyApp is a comprehensive backend application for managing users, currency accounts, transactions, and currency conversions. Built with Django Rest Framework, the app supports secure user management and real-time currency exchange using external APIs.

---

## Key Features

- **User Registration and Authentication**: Secure user registration and login functionality.
- **Currency Account Management**:
  - Default PLN account creation upon registration.
  - Create, edit, and delete additional currency accounts.
  - Protection against deletion of default PLN accounts or accounts with non-zero balances.
- **Currency Conversion**:
  - Real-time exchange rates fetched from the NBP API.
  - Support for multiple currencies (e.g., USD, EUR, GBP).
  - Automatic updates for account balances during conversions.
- **Transaction and History Tracking**:
  - Detailed logs of all transactions and account activities (deposits, withdrawals).
  - Filter transactions by user and date.
- **Deposits**:
  - Deposit money into specific currency accounts.
  - Maintain a history of deposits for better financial tracking.

---

## Technologies

- **Backend**: Django, Django Rest Framework
- **Database**: SQLite (default), with support for other databases via Django settings
- **Real-Time API**: Integration with NBP API for live currency exchange rates

---

## Installation and Setup

### Prerequisites
- Python 3.8+
- pip

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/currencyapp.git
   cd currencyapp
   ```

2. **Set up and activate a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. **Install backend dependencies**:
   ```bash
   cd currencyApp
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Set up the frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   - Check your IPv4 address to set baseURL for running the server on your local network.
   ```bash
   ipconfig
   ```
   - Look for your "Wireless LAN adapter Wi-Fi" section, and note your IPv4 address (e.g., 192.168.x.x).
   - Open the App.js file and insert your IPv4 address at the specified location on line 17.

6. **Start the Django development server**:
   - Now, start the Django development server using your IPv4 address:
   ```bash
   python manage.py runserver <your_IPv4_here>:8000
   ```

7. **Access the API**: Open [http://<your_IPv4_here>:8000/api/](http://your_IPv4_here:8000/api/) in your browser or Postman.

## Running the Backend in Docker

### Requirements
- Installed [Docker](https://www.docker.com/)
- Installed [Docker Compose](https://docs.docker.com/compose/)

### Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gasimovv21/currencyApp
   cd currencyApp

2. **Build and run the Docker containers:**:
   ```bash
   docker-compose up --build

3. **Access the API: The backend will be available at:**:
   ```bash
   http://localhost:8000

   Test endpoints by navigating to:

   http://localhost:8000/api/

4. **Stop the Docker containers: To stop and remove containers, networks, and volumes created by docker-compose, run:**:
   ```bash
   docker-compose down --volumes

---

## Usage

### User Management
- Register a new user using the `/api/register/` endpoint.
- Log in to manage your accounts and transactions securely.

### Currency Account Management
- Each user starts with a PLN account by default.
- Create additional accounts for supported currencies like USD, EUR, and GBP.
- Manage account balances, view transaction histories, and handle deposits.

### Currency Conversion
- Convert currencies using real-time exchange rates fetched from the NBP API.
- Ensure sufficient funds are available in the source account.

### Deposit Management
- Deposit money into any of your accounts.
- Track all deposits using the deposit history endpoints.

---

## API Endpoints

### User Management
| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| POST   | `/api/register/`         | Register a new user      |
| POST   | `/api/login/`            | Login a user             |
| POST   | `/api/logout/`           | Logout a user            |
| GET    | `/api/users/`            | List all users           |
| GET    | `/api/users/<id>/`       | Get user details         |
| PUT    | `/api/users/<id>/`       | Update user details      |
| DELETE | `/api/users/<id>/`       | Delete a user            |

### Currency Accounts
| Method | Endpoint                         | Description                            |
|--------|----------------------------------|----------------------------------------|
| GET    | `/api/currency-accounts/`       | List all currency accounts             |
| GET    | `/api/currency-accounts/<id>/`  | Get details of a specific account      |
| POST   | `/api/currency-accounts/`       | Create a new currency account          |
| PUT    | `/api/currency-accounts/<id>/`  | Update a currency account              |
| DELETE | `/api/currency-accounts/<id>/`  | Delete a currency account              |
| GET    | `/api/currency-accounts/user/<id>/` | Get accounts for a specific user    |

### Transactions
| Method | Endpoint                                     | Description                         |
|--------|---------------------------------------------|-------------------------------------|
| POST   | `/api/currency-accounts/convert/<id>/`      | Convert between currencies          |
| GET    | `/api/currency-accounts/convert/<id>/`      | View transaction history for a user |

### Deposits
| Method | Endpoint                                     | Description                         |
|--------|---------------------------------------------|-------------------------------------|
| POST   | `/api/currency-accounts/deposit/<id>/`      | Deposit money into a currency account |
| GET    | `/api/currency-accounts/deposit/<id>/`      | View deposit history for a user      |

### Account History
| Method | Endpoint                                     | Description                         |
|--------|---------------------------------------------|-------------------------------------|
| GET    | `/api/currency-accounts/history/<id>/`      | View account history for a user     |

---

## Notes

- **Default Currency Account**: Each user automatically gets a PLN account upon registration.
- **Real-time Exchange Rates**: The app fetches live exchange rates using the NBP API.
- **Password Security**: All user passwords are securely hashed using Django’s built-in utilities.

---

## Future Improvements

- Add JWT authentication for more robust session handling.
- Build a frontend app using React or Vue.js.
- Implement automated testing for all endpoints.

---

## Database Design

![View Database Design](https://github.com/gasimovv21/currencyApp/blob/main/Database%20Design.png)

---

## Use Case Diagram

![View Use Case Diagram](https://github.com/gasimovv21/currencyApp/blob/main/Use%20Case%20Diagram.png)

---

## Class Diagram

![Show Class Diagram](https://github.com/gasimovv21/currencyApp/blob/main/Class%20Diagram.png)

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

### **Authors 👨💻 👨💻 👨💻**
- Ahmet Eren Artam - 41155 | Recep Enes Karatekin - 40796 | Eltun Gasimov - 41160 
