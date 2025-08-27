# Crypto Next.js Monitoring App

## Project Overview
A Next.js application for monitoring interesting crypto metrics using React, TypeScript, and Tailwind CSS.

## Tech Stack
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **Runtime**: Bun
- **UI Library**: React with TSX components
- **State Management**: Redux Toolkit
- **Data Storage**: Google Sheets (read/write)
- **Linting**: ESLint

## Development Commands
- `bun dev` - Start development server
- `bun build` - Build for production  
- `bun start` - Start production server
- `bun lint` - Run ESLint checks
- `bun lint:fix` - Fix ESLint issues

## Project Structure
- `src/app/` - Next.js app router pages
- `src/components/` - Reusable React components
- `src/app/globals.css` - Global styles with Tailwind

## Notes for Claude
- Use TSX for all React components
- Follow Tailwind CSS patterns for styling
- Prefer functional components with hooks
- Use TypeScript for type safety
- Use Redux Toolkit for state management
- Google Sheets serves as the data persistence layer
- Run `bun lint` before committing changes
- Follow ESLint rules for code consistency

## Redux Store Structure
- `src/store/` - Redux store configuration
- `src/features/` - Feature-based slices (crypto data, UI state)
- Use createSlice from Redux Toolkit
- Async actions with createAsyncThunk for API calls

## Google Sheets Integration
- Use GoogleSheetEmbed component for display
- Google Sheets API for read/write operations
- Store configuration and historical data in sheets