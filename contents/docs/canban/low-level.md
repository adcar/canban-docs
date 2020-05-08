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
object which contains the column titles and generates arrays for each column based on the `assignments` prop. This `initialBoard` is passed to `react-kanban`.
The most important job `Board` has is sending the correct API requests based on the kanban board's changing state.
`react-kanban` has a callback prop called `onCardDragEnd`. This callback is called whenever a card is finished being dragged.
`Board` has a function called `onBoardChange`. This function is passed into the `onCardDragEnd` prop in `react-kanban`.
`onBoardChange` iterates through each card, and compares it to the previous position of the card. If the card has moved to
a different column, an API request is fired. If the card is moved to the `To Do` column, the [markAsNotDone](#markasnotdone)
utility function is called. If the card is moved to the `Doing`, [markAsDoing](#markasdoing) and [markAsNotDone](#markasnotdone)
are called. If the card is moved to `Done`, [markAsDone](#markasdone) is called. These utlity functions are specified in
more detail in the [Utility Functions](#utility-functions) section. `renderCard` is passed to `react-kanban` with the `Card`
component. `react-kanban` takes this prop to render a custom card component rather than their default.

##### Props

- assignments: `IAssignment[]`

  An array of IAssignment objects. `Board` iterates through these to generate an `initialBoard` which gets passed to `react-kanban`.

- colors: `IColors`

  `Board` takes in custom colors from the Canvas API to set the course names with those colors in the cards.

- doingIds: `number[]`

  Assignment IDs of assignments (cards) that are currently in the `Doing` column.

#### Card

Renders a card with assignment details. Displays a _more info_ button. The _more info_ button is a `ModalButton` component.

##### Props

- id: `number`

  ID of the assignment.

- courseId: `number`

  ID of the course which contains the assignment.

- title: `string`

  Assignment title.

- dueAt: `Date`

  Due date for the assignment.

- courseName: `string`

  Name of the course which contains the assignment.

- color: `string`

  hexadecimal color corresponding to the custom course color.

- dragging: `boolean`

  `false` if the card is not currently being dragged (and `true` if it is currently being dragged).

#### ModalButton

Displays a button titled "More Info". On click it calls [getCourse](#getcourse) to retrieve course details. These course
details are displayed in a modal. The data it displays includes The assignment title, due date and time, the points possible,
and the assignment description.

##### Props

- id: `number`

  ID of the assignment.

- courseId: `number`
  ID of the course which contains the assignment.
- title: `string`

  Assignment title.

- dateString: `string`

  The date when the assignment is due. Formatted `Month D`. Can also be `Today` or `Tomorrow`.

- dueTime: `string`
  The time the when the assignment is due. Formatted `H:MM AM/PM`

#### Navbar

##### Props

### Utility Functions

#### markAsNotDone

#### markAsDoing

#### getCourse

### TypeScript Interfaces

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

### Generated HTML Sample

## UI/UX design
