# OdooCombat 2024

## Overview

The Library Management System is a comprehensive platform designed to manage book inventories, user activities, and borrowing processes efficiently. It features secure login/logout for Admins, Librarians, and Users, with role-based access control. The system supports adding, updating, deleting, and searching for books, displaying real-time availability, and integrating with the Google Books API for easy book entry using ISBN. Users can borrow and return books, with due dates and late fees automatically calculated. Advanced search options and personalized book recommendations enhance user experience. Notifications overdue books ensure users stay informed. 

## Tech Stack

- **Frontend:** React, Tailwind CSS, antdesign
- **Backend:** Node.js, Express
- **Database:** MongoDB

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your machine
- npm or yarn installed on your machine

## Installation Guide without script
### 1. Clone Repo.
### 2. `cd client --> npm i`
### 3. `cd server --> npm i`
### 4. `cd server --> npm run dev`
### 5. `cd client --> npm start`
### 6. Please update the environment variable according to the requirement.

## Core Features

## User Management
- Login/Logout functionality for Admin and Users.
- Role-based access control: Admin, Librarian, and User roles.
- Book Inventory Management

## Add, update, delete, and search for books.
- Book details: ISBN, title, author, publisher, year, genre, quantity.
- Real-time availability status.
- Note: You can use the Google Books API to fetch the data to add new books (enter the book ISBN number to fetch the book details) https://www.googleapis.com/books/v1/volumes?q=isbn:9781787123427

## Borrowing System
- Checkout process for borrowing books.
- Return process including due dates and late fees calculation.
- History tracking for each user's borrowed and returned books.
- Search and Recommendations

## Advanced search options (by title, author, genre, etc.).
- Book recommendations based on user history or popular trends.
- Notifications and Alerts

## Email or SMS notifications for due dates, new arrivals, etc.
- Alerts for overdue books and outstanding fees.
- Reporting

-- Generate reports on book usage, overdue items, user activity, etc.
Dashboard for admins and librarians to see real-time statistics.
