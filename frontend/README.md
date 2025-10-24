# Task Control Panel Frontend

A modern React application built with Vite, TypeScript, and SCSS for managing projects and tasks.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better developer experience  
- **Vite** - Fast build tool and development server
- **SCSS** - Advanced CSS with variables, mixins, and nesting
- **ESLint** - Code linting and formatting

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable React components
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # SCSS stylesheets
│   │   ├── variables.scss    # SCSS variables
│   │   ├── mixins.scss      # SCSS mixins
│   │   └── global.scss      # Global styles
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   ├── App.scss        # App-specific styles
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite configuration
└── README.md          # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or  
   yarn dev
   ```

4. Open your browser and visit `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🎨 Styling

The project uses SCSS with a well-organized structure:

- **Variables** (`variables.scss`) - Colors, spacing, typography, and breakpoints
- **Mixins** (`mixins.scss`) - Reusable SCSS mixins for common patterns
- **Global** (`global.scss`) - Base styles, typography, and utility classes

### SCSS Features

- CSS variables for theming
- Responsive design mixins
- Utility classes for common layouts
- Component-scoped styling

## 🔧 Configuration

### TypeScript

The project is configured with strict TypeScript settings for better type safety:
- Strict mode enabled
- Unused locals and parameters detection
- Modern ES2020 target

### Vite

Optimized Vite configuration includes:
- React plugin for JSX support
- SCSS preprocessing with global variable imports
- Development server on port 3000
- Automatic browser opening

### ESLint

Code quality is maintained with:
- TypeScript ESLint rules
- React hooks rules
- React refresh rules
- Custom rules for unused variables

## 📦 Dependencies

### Production Dependencies
- `react` - React library
- `react-dom` - React DOM rendering

### Development Dependencies
- `@vitejs/plugin-react` - Vite React plugin
- `typescript` - TypeScript compiler
- `sass` - SCSS compiler
- `eslint` - Code linting
- Various ESLint plugins for TypeScript and React

## 🚀 Next Steps

This is the basic project structure. You can now start building:

1. **Components** - Create reusable UI components
2. **API Integration** - Connect to your backend API
3. **State Management** - Add Context API or state management library
4. **Routing** - Add React Router for navigation
5. **Authentication** - Implement user authentication
6. **Testing** - Add testing framework (Jest, React Testing Library)

## 🤝 Development Workflow

1. Create feature branches from `main`
2. Follow the established folder structure
3. Use TypeScript for all new code
4. Follow the established SCSS patterns
5. Run linting before commits
6. Test your changes thoroughly

Happy coding! 🎉