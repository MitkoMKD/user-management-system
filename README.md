# user-management-system

Веб апликација за регистрација и процес на најава на корисници. Оваа апликација може да биде изработена во технологии по избор (Препорачуваме .Net (Backend), Angular (Frontend) и MSSQL (Database)).
Апликацијата треба да содржи 2 workspaces. Кориснички дел и администраторски дел
Корисничкиот workspace треба само да има празна страна во кој ќе испишува Добредојдовте “Корисничкото име на најавениот корисник“.
Администраторскиот workspace треба да има страна за регистрација на корисници
При регистрацијата на корисникот освен основни податоци, треба да се назначи во соодветна улога (Администратор или обичен корисник) како и поле дали корисникот е Активен или не. Дополнително да има можност да се листаат и пребаруваат корисниците. Да може да се променат основни податоци за корисникот како и можност за бришење.
По регистрација на корисникот, истиот да може да се најави на системот
Доколку е во улога Администратор да го пренасочи во администраторскиот workspace
Доколку е во улога на обичен корисник да го пренасочи во страната за добредојде
Администраторот треба да има можност за пристап до 2та workspaces
Обичниот корисник може да пристапи само до страната за добредојде. Доколку се обиде да пристапи до Админ делот тогаш треба да му појави или пренасочи до страна Access Denied
Доколку корисникот се означи за Неактивен тогаш, после најавата треба да го пренасочи до страна во која ќе добие известување дека не е регистриран во системот.

User Management System – A full-stack application built with .NET 8 (Web API + EF Core) and Angular 18 for managing users, roles, and access control.

2. Features

Bullet points of what’s implemented:

User registration & login (with role-based access)

Admin workspace: list, search, edit, delete users

User workspace: view profile, restricted actions

Role-based routing & “Access Denied” handling in Angular

Active/Inactive user toggle

CRUD operations via REST API (ASP.NET Core)

Unit tests for backend services

3. Architecture

UserManagementSystem.API → REST API with .NET 8

UserManagementSystem.EF → Entity Framework Core (DbContext, Migrations)

UserManagementSystem.Repository → Repository pattern implementation

UserManagementSystem.Models → DTOs & Entities

UserManagementSystem.Frontend → Angular 18 app

UserManagementSystem.UnitTests → NUnit/Moq unit tests

4. Tech Stack

Backend: .NET 8, ASP.NET Core Web API, EF Core

Frontend: Angular 18, TypeScript

Database: SQL Server (or SQLite, if used)

Testing: NUnit, Moq, Jasmine/Karma (if Angular tests exist)

5. Setup Instructions

Backend

cd UserManagementSystem.API
dotnet restore
dotnet ef database update   # run migrations
dotnet run


The API will be available at https://localhost:7095/api.

Frontend

cd UserManagementSystem.Frontend
npm install
ng serve -o


The Angular app will be available at http://localhost:4200.


