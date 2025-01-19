# Daily Affirmation API

A RESTful API service that provides daily positive affirmations. Built with Fastify, TypeScript, and MySQL.

## Features

- Daily rotating affirmations
- Automatic scheduling via cron jobs
- Multiple database support (MySQL, SQLite) (Postgresql and MongoDB coming soon)
- Environment-based configuration
- Fallback affirmations when database is unavailable

## API Endpoints

### GET /daily-affirmation

Returns the current daily affirmation.

**Response Example:**
```json
{
  "message": "I am capable of achieving anything I set my mind to"
}
```

## Setup

### Prerequisites

- Node.js (v14 or higher)
- Any database (MySQL, SQLite, Postgresql, MongoDB)
- TypeScript

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd node-affirmation-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=affirmations_db
DB_SSL_CA_CONTENT=your_ssl_certificate_content (If required for SSL) 
(Create a cert directory and add the path to the cert in the .env file)
```

4. Running the application:

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

## Configuration

The application can be configured through environment variables:

- `PORT`: Server port (default: 3002)
- `NODE_ENV`: Environment (development/production)
- `CRON_SCHEDULE`: Schedule for updating daily affirmation (default: "0 0 * * *")
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_DATABASE`: Database name
- `DB_SSL_CA_CONTENT`: SSL certificate content (optional)

## Database Structure

The application uses a simple database structure with a single table:

```sql
CREATE TABLE affirmations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Architecture

- `src/config/`: Configuration files for app and database
- `src/data/`: Data access layer and repositories
- `src/jobs/`: Scheduled tasks and cron jobs
- `src/middleware/`: Express middleware
- `src/routes/`: API route definitions
- `src/services/`: Business logic
- `src/utils/`: Utility functions
- `src/scripts/`: Database initialization and maintenance scripts

## Error Handling

The API implements centralized error handling that:
- Logs all errors
- Returns appropriate HTTP status codes
- Sanitizes error messages in production
- Handles both operational and programming errors

## Security

- SSL/TLS support for database connections
- Environment variable based configuration
- Error message sanitization
- Graceful shutdown handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE)

## Support

For support, please open an issue in the repository.