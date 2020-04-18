---
title: System Design
sidebar: Docs
showTitle: true
---


Introduction
----------

Architecture
----------
![Overall architecture of Canban](https://lh5.googleusercontent.com/GQ9jT9t7HppcGwi45U5qcdDIPEeQbr9VqSRWi4EXLOzENlxdvtdZxIkOuwSdpawjRpcUIv63E6-mcjCcwJYrBtRG80VHJYd8JvcPgdOR_zLwecRMw2wnnUkiK0yJq0zzYTqcUiTg)

Components
----------

### React UI

The React UI is the central component of Canban. By default, a login page is displayed. This login page uses the Authenticator to authenticate with Canvas and allow the user to see their assignments with Canban. This UI utilizes a library called [React-Kanban](https://github.com/lourenci/react-kanban) for the kanban board. The UI detects changes in the board and will interface with Data Requester to initiate API requests with Canvas.

### Authenticator

### Data Requester