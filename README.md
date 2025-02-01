# Task Buddy 📋✨

## Project Overview
Task Buddy is a modern, responsive task management application built with React and Firebase. It provides an intuitive interface for creating, editing, and tracking tasks across different categories.

## Features
- 🚀 Create, Edit, and Delete Tasks
- 📊 Task Categorization (Work and Personal)
- 📅 Due Date Tracking
- 🔍 Task Status Management (To-Do, In Progress, Completed)
- 📱 Responsive Design with Mobile-Friendly Bottom Sheet Modal
- 🔥 Firebase Integration for Sign-In and authentication

## Technology Stack
- React
- Redux
- Firebase
- Bootstrap
- CSS

## Prerequisites
- npm or yarn
- Firebase Account

## Installation Steps
1. Clone the repository
```bash
git clone https://github.com/komolika05/task-buddy.git
cd task-buddy
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
- Create a Firebase project
- Add your Firebase configuration to `.env` file
- Enable Firestore and Authentication

4. Run the application
```bash
npm start
```

## Challenges and Solutions
- **Drag and Drop Functionality**: The most challending part of the project was to implement DnD-kit for dragging and dropping tasks across statuses, especially in the Board View. This could work after a lot many trial and errors. Also, the logic to maintain order of the tasks in the global state was pretty complicated and challenging. It involves considering many edge cases in order to finally result in correct order for the tasks belonging to same status. 
- **State Management**: Maintaing global state for tasks. Also, to be able to keep the state even after reloading the app without using any backend solutions currently in the project.
- **Architecture**: Implementing and creating correct and reusable coomponents for the application was slightly challenging. It was a good learning experience to work on the architecture of the application.
- **Responsiveness**: Making the application responsive in the end was another challenge which I faced, it's not perfect yet but does the job.
- **Batch Actions**: Implementing batch actions such as deleting multiple tasks at once was a challenge. It involved managing the state of the tasks and updating the UI accordingly. 

## Future Roadmap
- [ ] Add more responsiveness
- [ ] Correcting styling for list view
- [ ] Backend integration
- [ ] Add task priority levels
- [ ] Comments and collaboration across teams/different members
