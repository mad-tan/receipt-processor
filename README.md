# Receipt Processor

A simple web service to process receipts, calculate points based on specific rules, and check for duplicates. This project is implemented using Node.js and Express.

---

## Features

- **Process Receipts**: Submit receipts for processing via a POST endpoint.
- **Calculate Points**: Calculate points based on rules for receipts.
- **Check Duplicates**: Detect and return the same ID for duplicate receipts.
- **Retrieve Points**: Query points for a specific receipt using its ID.

---

## API Endpoints

### POST `/receipts/process`

- **Request**: JSON object representing the receipt.
- **Response**:
  - **Success**: `{ "id": "<receipt_id>" }`
  - **Duplicate**: Same ID as the original receipt.
  - **Error**: `{ "error": "Invalid receipt format" }`

### GET `/receipts/{id}/points`

- **Request**: Receipt ID in the URL path.
- **Response**:
  - **Success**: `{ "points": <points> }`
  - **Error**: `{ "error": "Receipt not found" }`

---

## Setup and Run

### Prerequisites

- Node.js
- npm

### Steps

1. Clone the repository

2. npm install

3. node index.js

4. Access the API at localhost:4000
