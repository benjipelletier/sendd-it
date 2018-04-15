<template>
  <div id="Main">
    <Uploader class="uploader"></Uploader>
  </div>
</template>
<script>
import axios from 'axios'
import Uploader from './Uploader'

export default {
  name: 'Main',
  components: {
    Uploader
  },
  data () {
    return {
      url: 'https://us-central1-sendd-it.cloudfunctions.net/api',
      data: '',
      title: '',
      desc: ''
    }
  },
  methods: {
    getTrack (trackID) {
      axios.get(this.url + '/tracks/' + trackID)
        .then(function (response) {
          console.log(response)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  },
  created () {
  }
}
</script>

<style scoped>

#Main {
  text-align: left;
  padding: 100px 5%;
}
.uploader {
  max-width: 400px;
  margin: auto;
}
</style>
