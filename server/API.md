# Sendd-it REST API Endpoint documentation
Request URL: `https://us-central1-sendd-it.cloudfunctions.net/api`


## Get Track by ID

 **`GET /tracks/:id`** 

**Required:** 
    
    id=[alphanumeric]

**Success Response:**
```js
{
    code: 200,
    body: {
        passcode: [numeric],
        timestamp: [alphanumeric],
        title: [alphanumeric|alphabetical]
    }
}
```
---
## Get Comment Tree by Track ID

 **`GET /comments/:id`**



**Required:** 
    
    id=[alphanumeric]

**Success Response:**
```js
{
    code: 200,
    body: {
        status: "null"
    }
}
```
or
```js
{
    code: 200,
    body: {
        0: [commentBody],
        1: [commentBody],
        ...
        status: [numeric] // index of last comment
    }
}
```
*[commentBody]*
```js
{
    name: [alphabetical],
    timestamp: [alphanumeric],
    body: [alphabetical]
}
```
---
## Upload Track

**`POST /tracks`**

**Required:** 
    
    title=[alphanumeric|alphabetical]

**Success Response:**

```js
{
    code: 200,
    body: {
        id: [alphanumeric]
    }
}
```
---
## Upload Comment

**`POST /comments/:id`**

**Required:** 
    
    id=[alphanumeric]

**Success Response:**

```js
{
    code 200,
    body: {}
}
```
---

**Error Response:**

```js
{
    code: 401
    body: {error: "Unauthorized"}
}
or
{
    code: 404,
    body: {error: "Not Found"}
}
```

