---
title: System Design
sidebar: Docs
showTitle: true
---

## Introduction

Canban is a web-based Kanban board that integrates with the Canvas Learning Management System (LMS).
It allows a user to sign in to their Canvas account and manage their current assignments inside a Kanban board. This
System Design should follow the [Requirements](/docs/canban/requirements).

## Architecture

![Overall architecture of Canban](https://i.ibb.co/wQ4MH6s/System-Design-Canban.png)

## Components

### React UI

The React UI is the central component of Canban. By default, a login page is displayed.
This login page uses the Authenticator to authenticate with Canvas and allow the user to see their assignments in a
Kanban board. This UI utilizes a library called [React-Kanban](https://github.com/lourenci/react-kanban) for the kanban board.
Initially, when the board is loaded, the UI calls on the Data Requester to get all assignments for the past week. It then
places those assignments in the correct columns. Each assignment is a card. When a user clicks on a card, they are brought
to a modal displaying more info about that assignment. This relies on the Data Requester as another API request has to
be made for this.

The UI detects changes in the board and will interface with Data Sender to initiate API requests with Canvas. For example,
when the user moves a card into the "Done" column, the Data Sender knows to send an API request to Canvas to mark that
assignment as done.

### Authenticator

The Authenticator is responsible to authenticating the user via OAuth 2. It sends requests to [Auth0](https://auth0.com/)'s API which then
authentication requests to Canvas.
Canvas sends the user token which Auth0 then sends to React. If any of this fails the user is prompted with an error and
must attempt to sign in again. The reason an intermediate server is necessary is because OAuth requires an application to have
**private keys**. For security reasons we can't store those private keys on the client-side, thus we need to have a server
do it for us. Auth0 is a serverless solution that makes authentication easier.

### Data Requester / Sender

The Data Requester / Sender is responsible for retrieving and sending data to and from Canvas.
The data that it sends includes:

- Marking an assignment as complete / not complete
- Marking an assignment as "doing". This is stored as arbitrary JSON in Canvas.

The only data it retrieves includes:

- All assignments in the past week
- Specific info on assignments
