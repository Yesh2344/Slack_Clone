# ChatVerse: A Futuristic Chat Application

Welcome to ChatVerse, a real-time, futuristic-themed chat application built with Convex, React, Vite, and TailwindCSS.



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

### Frontend (`src/` directory)

The `src/` directory contains the React application code.

*   `src/main.tsx`: The entry point for the React application, sets up the Convex provider.
*   `src/App.tsx`: The main application component, handles routing between authenticated and unauthenticated views, and manages overall layout.
*   `src/index.css`: Global styles and TailwindCSS base/components/utilities.
*   `src/SignInForm.tsx` & `src/SignOutButton.tsx`: Authentication components (managed by the Chef template).
*   **Components**:
    *   `src/ChannelsPanel.tsx`: Displays the list of channels and unread notification indicators.
    *   `src/MessagesPane.tsx`: Displays messages for a selected channel, handles message input, and typing indicators.
    *   `src/ProfileEditor.tsx`: Allows users to edit their profile information.
    *   `src/CreateChannelModal.tsx`: Modal dialog for creating new channels.
*   **Convex Integration**:
    *   Components use `useQuery` and `useMutation` hooks from `convex/react` to interact with the backend.
    *   The `convex/_generated/api` object provides typed access to backend functions.

## Setup and Running

This application is designed to run within the Chef (AI Software Developer) environment.

1.  **Dependencies**: Dependencies are listed in `package.json` and are automatically managed by the Chef environment.
2.  **Convex Backend**: The Convex backend is automatically provisioned and deployed by Chef.
3.  **Environment Variables**:
    *   `CONVEX_DEPLOYMENT`: Automatically set by Chef to link the frontend to your Convex deployment.
4.  **Running the App**:
    *   The Chef environment handles building and running the Vite development server for the frontend and deploying the Convex backend.
    *   A preview URL is provided to access the application.

## How It Works

*   **Real-time Updates**: Convex's reactive queries ensure that the UI updates automatically when data changes in the database (e.g., new messages, typing status).
*   **Authentication**: Leverages `@convex-dev/auth` for user management.
*   **File Storage**: User avatars are uploaded to Convex file storage, and their URLs are stored in the user's profile.
*   **Scheduled Tasks**: Cron jobs in Convex are used for periodic cleanup tasks (e.g., old typing indicators).

This README provides a good starting point for understanding the project.
"# Slack_Clone" 


## Link

https://focused-manatee-33.convex.app/

## Copyrights

@Yeswanth Soma All Copyrights Reserved

## Contact

Email:yeswanthsoma83@gmail.com
