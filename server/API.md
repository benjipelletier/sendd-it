# Sendd-it REST API Endpoint documentation

`GET /tracks/:id`

**Required:** 
    
    id=[alphanumeric]

**Success Response:**

    {
        code: 200,
        body: {
            passcode: [numeric],
            timestamp: [alphanumeric],
            title: [alphanumeric|alphabetical]
        }
    }

---
`GET /comments/:id`

**Required:** 
    
    id=[alphanumeric]

**Success Response:**

    {
        code: 200,
        body: {
            status: "null"
        }
    }
or

    {
        code: 200,
        body: {
            0: [commentBody],
            1: [commentBody],
            ...
            status: [numeric] // index of last comment
        }
    }
[commentBody]

    {
        name: [alphabetical],
        timestamp: [alphanumeric],
        body: [alphabetical]
    }
---

`POST /tracks`

**Required:** 
    
    title=[alphanumeric|alphabetical]

**Success Response:**

    {
        code: 200,
        body: {
            id: [alphanumeric]
            passcode: [numeric],
            timestamp: [alphanumeric],
            title: [alphanumeric|alphabetical]
        }
    }

---
`POST /commends/:id`

**Required:** 
    
    id=[alphanumeric]

**Success Response:**

    {
        code 200,
        body: {}
    }

---

**Error Response:**

    {
        code: 401
        body: {error: "Unauthorized"}
    }
    or
    {
        code: 404,
        body: {error: "Not Found"}
    }

