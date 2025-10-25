# GetEmpStatus Backend Service

A structured backend service that retrieves employee information, processes salary data, and calculates employee status based on defined business logic.

## Architecture

This application is built using NestJS with the following architecture:

- Controller Layer: Handles HTTP requests and responses
- Service Layer: Contains business logic and orchestration
- Data Access Layer: Manages database interactions
- Common Modules: Shared utilities (validation, configuration, etc.)

### Core Components

1. ProcessStatusService: Main business logic and orchestration
2. DataAccessService: Database interactions and queries
3. ValidatorService: Input validation
4. Configuration Service: Environment-based configuration

## Setup & Execution Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database server running locally
- Database named `salaries_db` created
- PostgreSQL user with appropriate permissions

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp env.example .env
```

### Database Configuration

The application is configured to use PostgreSQL. Update the `.env` file with your database credentials:

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=salaries_db
DB_SYNCHRONIZE=true
DB_LOGGING=true
```

##Assumptions:
- PostgreSQL server is running on localhost:5432
- Database `salaries_db` exists
- User has appropriate permissions to create tables and insert data

### Running the Application

1. Development mode:
```bash
npm run start:dev
```

2. Production mode:
```bash
npm run build
npm run start:prod
```

3. Seed the database (after starting the application):
```bash
# Option 1: Use the seed API endpoint
curl -X POST http://localhost:3000/api/seed

# Option 2: Import from SQL file (if you have database-schema.sql)
# Execute the SQL file directly in your PostgreSQL database:
psql -U postgres -d salaries_db -f database-schema.sql
```

4. Access Swagger API Documentation:
```
http://localhost:3000/api/docs
```

## API Documentation

The application includes comprehensive Swagger documentation available at:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **JSON Schema**: `http://localhost:3000/api/docs-json`

### 1. Cache Handler
- **Purpose**: Reduces database calls by caching frequently accessed employee data
- **Implementation**: In-memory cache with TTL (Time To Live)
- **Cache Keys**: 
  - User data: `user:{nationalNumber}` (10 minutes TTL)
  - Salary data: `salaries:{userId}` (15 minutes TTL)

### 2. Centralized Logger
- **Purpose**: Logs all application activities to both database and file
- **Architecture**: Logger Service → Logger Data Access Service → Database
- **Log Levels**: INFO, WARN, ERROR, DEBUG
- **Database Table**: `LogEntry`
- **File Logging**: `logs/application.log`
- **Web Interface**: Real-time log viewer at `/api/logs/view`
- **Fields**: Level, Message, Context, UserId, NationalNumber, AdditionalData, CreatedAt
- **Separation**: Database operations isolated in data access layer

### 3. Retry Mechanism
- **Purpose**: Automatically retries failed database operations
- **Configuration**: Up to 3 attempts with exponential backoff
- **Retry Logic**: 500ms initial delay, 2x multiplier, max 5s delay

### 4. API Token Validation
- **Purpose**: Validates API tokens before processing requests
- **Error Response**: 401 Unauthorized for invalid/missing tokens
- **Implementation**: Bearer token authentication

### 5. Log Viewer Web Interface
- **Purpose**: Real-time log monitoring with web interface
- **Features**:
  - Real-time log updates (auto-refresh every 30 seconds)
  - Filter by log level (INFO, WARN, ERROR, DEBUG)
  - Filter by user national number
  - Adjustable log limit (1-1000 entries)
  - Color-coded log levels
  - Clear logs functionality
  - Responsive dark theme design
- **Access**: Navigate to `http://localhost:3000/api/logs/view`


## Development Notes

- The application uses TypeORM for database operations
- Configuration is managed through environment variables
- The service follows NestJS best practices with dependency injection
- All database operations are handled through the DataAccessService
- Business logic is centralized in the ProcessStatusService


DISCLAIMER: the readme.md was written by AI after examining the code as I'm not very good with documentations