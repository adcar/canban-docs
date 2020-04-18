---
title: Requirements
sidebar: Docs
showTitle: true
---

## Introduction

Canban is a web-based Kanban board that integrates with the Canvas Learning Management System (LMS). Canban automatically pulls down your to-dos and completed assignments from Canvas (only for the last week). It then puts those assignments in their respective columns, called "To-do" and "Done". There is also a middle column that is called "Doing". You can drag around cards (assignments) into any column you want. Canban sends API requests to Canvas to either mark the assignment as completed, unmark an assignment as completed, or mark as "doing". "Doing" is not supported in Canvas (there is only "completed" or "not completed") so Canban uses the arbitrary JSON endpoint Canvas offers to store that information. Canban also supports adding new cards to the To-Do column, which are stored as To-Dos in Canvas.

## Functional requirements

### Use Cases

- #### Authenticate with Canvas

    - Goal: Authenticate the user with Canvas so they can access their assignments from Canban.
    
    - User actions: Click "Sign in with Canvas" then click "Allow". If they aren't currently logged in with Canvas they will be taken to a login page first.

- #### App actions: Store the resulting token for the OAuth flow.

    - Initialize the board
    
    - Goal: Initialize the board with the assignments in the correct places.
    
    - User actions: Open the webapp while authenticated
    
    - App actions: Sends out API requests for assignments that are not completed, and places those in the "To-Do" column. Sends out API requests for completed assignments for the week (no later than 7 days old) and puts those in the "Done" column. It also sends API requests for arbitrary JSON and puts those assignments in the "Doing" column.

- #### Move a card to "Done"

    - Goal: Move card to "Done" column and mark assignment as done.
    
    - User actions: Click and drag a card into the "Done" column.
    
    - App actions: An API request will automatically be sent out to mark the assignment as done.

- #### Move a card to "Doing" 

    - Goal: Move a card to the default "Doing" column or any custom column that was previously created.
    
    - User actions: Drag and drop a card to that column.
    
    - App actions: An API request will automatically be sent out to the arbitrary JSON endpoint, adding the assignment ID to the respective column.

- #### Move a card to "To-Do"

    - Goal: Move card to "To-Do" column and mark assignment as not completed.
    
    - User actions: Click and drag a card into the "To-Do" column.
    
    - App Actions:  An API request will automatically be sent out to mark the assignment as not done.

- #### Add a new card 

    - Goal: Add a new card to the To-Do column.
    
    - User actions: Click the "+" button at the bottom of the To-Do column. This brings up a dialog box where the user fills out the title and content of the card. Then press done.
    
    - App actions: Once the user presses done the card is added and an API request is sent out adding an item to Canvas's To-Do.
    
    - View an assignment in detail
    
    - Goal: View more details of a card. This will include non-truncated content of the card.
    
    - User actions: Click on the "info" button located on a card
    
    - App actions: Bring up a modal displaying information about an assignment.  This allows the user to read the full assignment description.

## Non-functional requirements

### Platform / Hosting

Canban is a web application that supports Chrome 70+, Firefox 65+, and Safari 13+. There are no plans for supporting Internet Explorer. Canban will be hosted on the serverless platform Zeit. The web app will technically support mobile phones but it is not recommended since drag and drop will be difficult to use.

### API

Canban relies on the Canvas API. In order for OAuth to be possible, a new key pair needs to be created on the Canvas server.

### Performance

All API requests must happen in the background and not give the user any loading spinners. The app must work like a normal kanban board but performs API requests in the background to keep your changes in sync with Canvas.

### Security

Users must not be able to access another user's assignments.  OAuth needs to be properly implemented so this can't happen.
