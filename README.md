# MobileOS

A browser-based mobile operating system built with **Next.js**, **TypeScript**, and **Redux Toolkit**, featuring a window management system inspired by modern mobile operating systems.

## Features

- 📱 Mobile OS-style user interface
- 🚀 Dynamic application registration and loading
- 🪟 Window management system
    - Open applications
    - Minimize applications
    - Restore applications
    - Focus and z-index management

- ✨ Smooth app launch and minimize animations
- 🎯 Icon-to-window transition effects inspired by iOS
- 🧩 Extensible application manifest architecture
- 📦 Centralized state management with Redux Toolkit
- 🔧 Service-based architecture for UI actions and app lifecycle management
- 🗂️ DOM registry system for advanced UI animations and window tracking

## Architecture

The project follows a layered architecture:

### App Manager

Responsible for application registration, metadata management, and app discovery.

### UI Actions

Handles application lifecycle operations and window animations such as opening, minimizing, restoring, and focus management.

### UI Registry

Maintains references to application windows and icons, enabling advanced animations and transitions without polluting application state.

### Redux Store

Acts as the single source of truth for runtime application state.

## Tech Stack

- Next.js
- React
- TypeScript
- Redux Toolkit
- Tailwind CSS
- Lucide Icons

## Goals

This project is an exploration of building a desktop/mobile operating system experience entirely within the browser while maintaining a scalable and maintainable architecture. The focus is on application lifecycle management, window orchestration, smooth animations, and clean separation of concerns.

## Status

🚧 Work in Progress

Current development focuses on:

- Window lifecycle improvements
- Animation system refinements
- Dock and navigation interactions
- Multi-window management
- Application persistence
- Enhanced mobile OS behaviors
