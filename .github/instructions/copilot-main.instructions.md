---
applyTo: **copilot-frontend**
name: Copilot Frontend Instructions
---

description: Instructions for creating frontend components and pages in Omnia.

###Framework and Libraries

**Omnia** uses **Nextjs** with **TypeScript** for building the frontend. The project is structured to promote modularity and reusability of components. **Tailwind** is the main CSS framework used for styling, ensuring a consistent and responsive design across the application. Additionally, **Radix UI** is utilized for accessible and customizable UI components. 

###System Folder Architecture
The frontend code is organized in a clear folder structure to facilitate development and maintenance. The main folders include:

```
src/
├── app/                # Contains the main application code, including pages and layouts   
│   ├── components/index    # Reusable UI components
│   ├── (private)/          # Application private routes, only accessible to authenticated users
│   ├── (public)/           # Public routes, accessible to all users
│   ├── styles/         # Global and component-specific styles
│   ├── utils/index        # Utility functions and helpers
│   ├── hooks/index      # Custom React hooks
│   ├── context/       # React context providers
│   ├── services/index    # API service calls
│   ├── assets/        # Static assets like images and icons
│   ├── types/index      # TypeScript type definitions
│   ├── config/index     # Configuration files
│   ├── lib/index      # Library code
│   ├── store/index    # State management (Zustand)
│   ├── i18n/           # Internationalization files
│   ├── tests/          # Test files
```

### Creating Frontend Components and Pages
To create a new frontend component or page in **Omnia**, follow these steps:
1. **Identify the Location**: Determine whether the component or page belongs in the `(private)` or `(public)` folder based on its accessibility requirements.
2. **Create the Component/Page**: Create a new file in the appropriate folder. For example, to create a new dashboard page, you would create a file at `src/app/(private)/dashboard/page.tsx`.
3. **Use Reusable Components**: Leverage existing components from the `components` folder to maintain consistency and reduce code duplication.
4. **Styling**: Use Tailwind CSS classes for styling. If custom styles are needed, add them to the `styles` folder. Only create new css files if absolutely necessary.
5. **State Management**: Use Zustand for state management. Create or update stores in the `store` folder as needed.
6. **index.ts**: Ensure to export your new code (components, hooks, utils, services, types) in the respective `index.ts` files for easy imports elsewhere in the application. Always use absolute imports from the `src` folder.
7. **Types and Interfaces**: Define any new TypeScript types or interfaces in the `types` folder to ensure type safety across the application. Always use types from the `types` folder in index.ts files. Never define types directly in component files or pages. This rule is crucial for maintaining a clean and organized codebase. This should be followed strictly, for all new code in all part of the codebase.


### Fetch data from the backend
To fetch data from the backend, use the services defined in the `services` folder. This application only use API routes defined in the backend. Do not fetch data directly from the database or any other source.   
8. **Testing**: All services should be a unity test. the test files should be in the same folder as the service file. For example, if you create a new service at `src/app/services/userService.ts`, the corresponding test file should be `src/app/services/userService.test.ts`. This organization helps keep related files together and makes it easier to manage tests.

### **Functional paradigm**
The codebase follows a functional programming paradigm, emphasizing the use of pure functions, immutability, and higher-order functions. This approach enhances code readability, maintainability, and testability. Do not use classes or OOP concepts in the codebase. Always prefer functions over classes.


### **More concepts about creation of components and pages**
- **Components**: Components should be small, focused, and reusable. Each component should ideally do one thing and do it well. If a component grows too large, consider breaking it down into smaller sub-components.
- **Pages**: Pages are the main entry points for different routes in the application. They should primarily handle layout and composition of components, delegating specific functionality to child components.

- **Prop drilling problem**: Prop drilling refers to the process of passing data through many layers of components, which can make the code harder to maintain. To avoid prop drilling, consider Zustand for state management and the children prop for component composition. This approach helps keep components decoupled and easier to manage. Always prefer using Zustand for state management over prop drilling. Always prefer using the children prop for component composition over prop drilling.


### **Best Practices**
- **Consistency**: Follow consistent naming conventions and coding styles throughout the codebase.
- **Documentation**: Document components, functions, and complex logic to aid future maintenance and collaboration. The documentation should not be in the form of comments in the code. Always create separate documentation files.
- **Comments**: Never use comments in the code. If you feel the need to add a comment, consider refactoring the code or adding documentation instead.
- **Repositories**: always use the repository to make a action in database, never use operation with database in service slayer. 
- **Code Reviews**: Regularly conduct code reviews to ensure code quality and share knowledge among team members.
    - **Code review checklist**:
        - Ensure the code follows the functional programming paradigm.
        - Verify that all new code is exported in the respective `index.ts` files.
        - Check for proper use of Tailwind CSS for styling.
        - Confirm that state management is handled via Zustand.
        - Ensure no prop drilling is present; prefer Zustand or children prop for data passing.
        - Validate that all new types are defined in the `types` folder and not within component files or pages.
        - Ensure there are no comments in the code; documentation should be in separate files if needed.
        - Check for adherence to naming conventions and coding styles.
        - Verify that tests are written for new services and are located in the same folder as the service files.
        - Ensure that the code is modular and components are reusable.
        - Ensure no console.log statements are present in the code.
        - Ensure console.error is used for error handling.
        - Ensure always services/repositories has a try/catch block for error handling.
        - Ensure that all asynchronous code is properly awaited.
        - Ensure not use magic numbers or strings; use constants instead.
        - Ensure that the code is free of any obvious bugs or issues.
        - Ensure not have a database operation without repository slayer.


### **Behavior to code generation**
When generating code, always follow the best practices and guidelines outlined in this document. Ensure that the generated code is clean, maintainable, and adheres to the functional programming paradigm. Always validate the generated code through code reviews and testing to ensure quality and reliability.
Always ask to be continued if the code is too long to fit in a single response, and never break the code in the middle of a function or a component.