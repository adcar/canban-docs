---
title: Low Level Design
sidebar: Docs
showTitle: true
---

## Code Design

### Introduction

Canban uses React and TypeScript. With React, Elements are broken up in to components to allow for re-use and provide an easy-to-follow
composition model. Other than React components, Canban also contains various utility functions. Because Canban is written
in TypeScript, we have the advantage of defining parameter types that utility functions accept and the data types that
components accept in their props. These props may use interfaces which are defined in the [Interfaces](#interfaces) section.

The TypeScript is transpiled to JavaScript before being shipped to the browser.

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
component. `react-kanban` takes this prop to render a custom card component rather than their default. `Board` also
maintains an array of assignment IDs that are in the `Doing` column. So, whenever an assignment is moved into the `Doing`
column, the array of assignment IDs is updated to include that assignment. And vice-versa for when an assignment is moved
out of `Doing`.

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

#### Appbar

A simple app bar at the top of the screen that displays "Canban" and a toggle button for dark-mode or light-mode.

##### Props

- onToggleTheme: `ICallback`

  Callback that is fired when the dark-mode / light-mode button is pressed.

### Utility Functions

Before diving in to the utility functions, it's important to understand a concept in Canvas: overrides. An override
essentially means the status is overwritten by user actions. For example, something can be marked as done even though
the assignment isn't submitted. Canban utilizes these overrides by creating one whenever a card is moved into certain
columns. Also, this section uses `${}` to denote a variable (or expression) is inside of a string.

#### markAsNotDone

If `override_id` is not null, the override `marked_complete` is updated to be not done (`false`). If `override_id` is null, this
function first creates an override then updates the `marked_complete` to be not done (`false`).

Calls `PUT https://vsc.instructure.com/api/v1/planner/overrides/${override_id}`

Body (JSON):

```json
{ "marked_complete": "false" }
```

If override_id is null it will instead call:

`POST https://vsc.instructure.com/api/v1/planner/overrides`

Body (JSON):

```json
{
        "plannable_id": ${id},
        "marked_complete": "false",
        "plannable_type": "assignemnt"
}
```

##### Parameters

- override_id: `number | null`

  override ID of an assignment.

- id: `number`

  ID of an assignment.

#### markAsDone

If `override_id` is not null, the override `marked_complete` is updated to be done (`true`). If `override_id` is null, this
function first creates an override then updates the `marked_complete` to be done (`true`).

Calls `PUT https://vsc.instructure.com/api/v1/planner/overrides/${override_id}`

Body (JSON):

```json
{ "marked_complete": "true" }
```

If override_id is null it will instead call:

`POST https://vsc.instructure.com/api/v1/planner/overrides`

Body (JSON):

```json
{
        "plannable_id": ${id},
        "marked_complete": "true",
        "plannable_type": "assignemnt"
}
```

NOTE: This is a bit of an oversimplification. Behind the scenes, `markAsDone` and `markAsNotDone` call the same function with
slightly different parameters.

##### Parameters

- override_id: `number | null`

  override ID of an assignment.

- id: `number`

  ID of an assignment.

#### markAsDoing

`markAsDoing` works a bit differently than `markAsDone` or `markAsNotDone`. It takes in multiple IDs and marks them all
as `Doing`. Canvas does not support any kind of "in progress" or "doing" indicator for assignments. However, Canvas accepts
arbitrary JSON. Canban takes advantage of this by storing IDs of all assignments in the `Doing` column in this arbitrary
JSON. Canvas takes in a namespace parameter called `ns` for their arbitrary JSON data. This is a unique string that should indicate
the application. In this case, I used `dev.acardosi.canban`, since my personal domain is `acardosi.dev` and this application
is called Canban.

Calls `PUT https://vsc.instructure.com/api/v1/users/self/custom_data`

Body:

```json
{
       "ns": "dev.acardosi.canban",
       "data": {
         "doing": ${JSON.stringify(ids)}
       }
}
```

##### Parameters

- ids: `number[]`

  Array of IDs that are currently in the "doing" column. Any ids that are not in this array will not be in the `Doing`
  column.

#### getCourse

A simple utility function to return assignment details based on the assignment ID and the course ID. Returns exactly what
the Canvas API returns.

Calls `GET https://vsc.instructure.com/api/v1/courses/${courseId}/assignments/${assignmentId}`

Returns the JSON response (containing assignment details) that the API sends.

##### Parameters

- course_id: `number`

  The course ID.

- assignment_id: `number`

  The assignment ID.

### Interfaces

These interfaces are used for props throughout Canban.

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
  custom_colors: ICustomColor[]
}

interface ICustomColor {
  [name: string]: string
}

interface ICallback {
  (): void
}
```

### Generated HTML Sample

## UI/UX design
