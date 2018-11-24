import axios from "axios"

const URL = "https://us-central1-sendd-it.cloudfunctions.net/api"

const client = axios.create({
  baseURL: URL
})

export default client