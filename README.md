# Planner Scheduler Application

## Overview
The Planner Scheduler Application is a web-based tool designed to help users manage their events and schedules efficiently. It allows users to create, update, delete, and view events in a user-friendly interface.

## Features
- Create, read, update, and delete events
- Support for all-day events
- User-friendly interface with responsive design
- Integration with a database for persistent storage

## Project Structure
```
planner-scheduler-app
├── src
│   ├── Planner.Web
│   │   ├── Controllers
│   │   │   └── ScheduleController.cs
│   │   ├── Models
│   │   │   └── Event.cs
│   │   ├── Services
│   │   │   └── IEventService.cs
│   │   ├── Data
│   │   │   └── ApplicationDbContext.cs
│   │   ├── Pages
│   │   │   └── Index.cshtml
│   │   ├── wwwroot
│   │   │   ├── css
│   │   │   │   └── site.css
│   │   │   └── js
│   │   │       └── site.js
│   │   ├── appsettings.json
│   │   ├── Program.cs
│   │   └── Planner.Web.csproj
│   └── Planner.Tests
│       ├── Planner.Tests.csproj
│       └── SchedulerServiceTests.cs
├── planner-scheduler-app.sln
├── .gitignore
├── Dockerfile
└── README.md
```

## Getting Started

### Prerequisites
- .NET SDK
- A compatible database (e.g., SQL Server, SQLite)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd planner-scheduler-app
   ```
3. Restore the dependencies:
   ```
   dotnet restore
   ```

### Running the Application
To run the application, use the following command:
```
dotnet run --project src/Planner.Web/Planner.Web.csproj
```
The application will be available at `http://localhost:5000`.

### Running Tests
To run the unit tests, use the following command:
```
dotnet test src/Planner.Tests/Planner.Tests.csproj
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.