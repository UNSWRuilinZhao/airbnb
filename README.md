# Airbnb-Inspired Booking Platform

An Airbnb-inspired full-stack web application built with React and Node.js. This project recreates core accommodation booking flows such as authentication, listing management, browsing published properties, booking, and reviews.

## Highlights

- User registration and login
- Host listing creation and editing
- Listing publishing and unpublishing
- Public listing browsing
- Listing detail pages with booking and review flows
- React frontend with an Express backend

## Tech Stack

### Frontend
- React 17
- React Router
- Redux Toolkit
- Ant Design
- Axios

### Backend
- Node.js
- Express
- JWT authentication
- Swagger UI
- JSON-based local persistence

## Project Structure

```text
frontend/   React single-page application
backend/    Express REST API
```

## Run Locally

### Start the backend

```bash
cd backend
npm install
npm start
```

Backend URL:

```text
http://localhost:5005
```

### Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Frontend URL:

```text
http://localhost:3000
```

## Current Status

This project already includes several core product flows, but some features and polish are still incomplete. The preserved internal project guide is available in:

```text
guide.md
```

That file contains the original detailed project guide and can be used to compare the current implementation against the broader requirements.