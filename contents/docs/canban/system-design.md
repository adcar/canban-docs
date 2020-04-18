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

| ![Overall architecture of Canban](https://i.ibb.co/X3fHsLz/System-Design-Canban.png) |
| :----------------------------------------------------------------------------------: |
|                     _Figure 1 - Overall architecture of Canban_                      |

Canban relies on a UI built with React to communicate with Canvas and Auth0. The React UI is served as a static web page
from the hosting service [Zeit](https://zeit.co/). Zeit, Canvas, and [Auth0](https://auth0.com/) are hosted off-premises.
The React UI uses the APIs of Canvas and Auth0 to authenticate with Canvas and provide the user with a filled Kanban board.
The UI also makes requests to Canvas to update the user assignment's based on how the user moves cards around. Auth0 makes
requests to Canvas to authenticate the user. On the UI side,the components are broken down. The [Data Requester / Sender](#data-requester--sender)
plays a different rule and handles a different API than the [Authenticator](#authenticator).

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
do it for us. Auth0 is a serverless solution that makes authentication easier. The user token that is obtained after the
OAuth2 flow is stored as a cookie on the user's machine. The cookie expires 1 minute before the user token expires. If no
token is detected when the webapp is run (E.g. the token expired or the user has never authenticated), then the user must
go through the authentication steps (again or for the first time). Figure 2 shows this authentication flow visually.

| ![Canban authentication flow](https://i.ibb.co/KjPmPzQ/Auth-flow.png) |
| :-------------------------------------------------------------------: |
|                _Figure 2 - Canban authentication flow_                |

### Data Requester / Sender

The Data Requester / Sender is responsible for retrieving and sending data to and from Canvas.
The data that it sends includes:

- Marking an assignment as complete / not complete.
- Marking an assignment as "doing". This is stored as arbitrary JSON in Canvas.

The data it retrieves includes:

- All assignments in the past week.
- Specific info on assignments.

Specific info is only requested when the user requests it (by clicking on an assignment).
