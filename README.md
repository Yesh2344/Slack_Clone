# ChatVerse: A Futuristic Chat Application

Welcome to ChatVerse, a real-time, futuristic-themed chat application built with Convex, React, Vite, and TailwindCSS.

## Overview

ChatVerse provides a sleek, modern interface for users to communicate in different channels. It features real-time message updates, typing indicators, user profiles with avatars, and a notification system for unread messages.

## Technologies Used

*   **Backend**:
    *   [Convex](https://convex.dev/): Reactive database, serverless functions, real-time updates, scheduled jobs, and authentication.
*   **Frontend**:
    *   [React](https://react.dev/): JavaScript library for building user interfaces.
    *   [Vite](https://vitejs.dev/): Fast frontend build tool.
    *   [TailwindCSS](https://tailwindcss.com/): Utility-first CSS framework for styling.
    *   [TypeScript](https://www.typescriptlang.org/): Superset of JavaScript for type safety.
*   **UI Components**:
    *   [Sonner](https://sonner.emilkowal.ski/): For toast notifications.

## Features

*   **User Authentication**: Secure sign-in using username/password (provided by the Chef template).
*   **Channel Management**:
    *   Create new channels.
    *   List available channels.
*   **Real-time Messaging**:
    *   Send and receive messages instantly within channels.
    *   Messages display author's name and avatar.
*   **Typing Indicators**: See when other users are actively typing in a channel.
*   **User Profiles**:
    *   Edit display name.
    *   Upload and display a profile avatar.
*   **Notifications**:
    *   Visual indicators for channels with unread messages.
    *   Global notification alert in the header for any unread messages.
    *   Notifications are automatically marked as read when a channel is viewed.
*   **Futuristic UI Theme**: A sleek, dark theme with vibrant teal accents.
*   **Responsive Design**: Adapts to different screen sizes (basic responsiveness from TailwindCSS).

## Project Structure

### Backend (`convex/` directory)

The `convex/` directory contains all the backend logic deployed to the Convex cloud.

*   `convex/schema.ts`: Defines the database schema, including tables for users (from auth), channels, messages, typing indicators, and notifications.
*   `convex/auth.config.ts` & `convex/auth.ts`: Configuration for user authentication (managed by the Chef template).
*   `convex/channels.ts`: Contains mutations for creating channels and queries for listing them.
*   `convex/messages.ts`: Handles sending messages and listing messages for a channel. Also triggers notification creation.
*   `convex/typing.ts`: Manages real-time typing indicators and their cleanup.
*   `convex/notifications.ts`: Contains queries to fetch unread notifications and mutations to mark them as read.
*   `convex/users.ts`: Handles user profile updates, including avatar uploads.
*   `convex/crons.ts`: Defines scheduled jobs, such as cleaning up old typing indicators.
*   `convex/http.ts`: Handles HTTP endpoints (primarily for auth in this template).

