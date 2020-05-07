---
title: Low Level Design
sidebar: Docs
showTitle: true
---

## Code Design

### Introduction

Canban uses React. With React, Elements are broken up in to components to allow for re-use and provide an easy-to-follow
composition model. Other than React components, Canban also contains utility functions written in TypeScript. Everything written
in the TypeScript is transpiled to JavaScript before being shipped to the browser.

### React Components

#### Board

The `Board` component utilizes a library called `react-kanban` to create a Kanban board. `Board` creates an `initialBoard`
object which contains the column titles and empty arrays for the cards. This `initialBoard` is passed to `react-kanban`.
The most important job `Board` has is sending the correct API requests based on the kanban board's changing state.
`react-kanban` has a callback prop called `onCardDragEnd`. This callback is called whenever a card is finished being dragged.
`Board` has a function called `onBoardChange`. This function is passed into the `onCardDragEnd` prop in `react-kanban`.
`onBoardChange` iterates through each card, and compares it to the previous position of the card. If the card has moved to
a different column, an API request is fired. If the card is moved to the `To Do` column, the [markAsNotDone](#markasnotdone)
utility function is called. If the card is moved to the `Doing`, [markAsDoing](#markasdoing) and [markAsNotDone](#markasnotdone)
are called. If the card is moved to `Done`, [markAsDone](#markasdone) is called. These utlity functions are specified in
more detail in the [Utility Functions](#utility-functions) section.

##### Props

- assignments: `IAssignment[]`
  An array of IAssigment objects.
- colors: `IColor[]`
- doingIds: `number[]`

#### Card

##### Props

#### ModalButton

##### Props

#### Navbar

##### Props

### Utility Functions

#### markAsNotDone

#### markAsDoing

### Interfaces

#### IAssignment

```tsx
interface IAssignment {
  id: number
  courseId: number
  title: string
  dueAt: Date
  courseName: string
  color: string
}

interface IColors {
  custom_colors: CustomColor[]
}

interface CustomColor {
  [name: string]: string
}
```

#### IColor

### Generated HTML Sample

## UI/UX design
