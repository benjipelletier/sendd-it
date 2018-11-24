<template>
  <div id="Main">
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'Main',
  data () {
    return {
      url: 'https://us-central1-sendd-it.cloudfunctions.net/api',
      data: '',
      title: '',
      desc: ''
    }
  },
  methods: {
    getTrack(trackID) {
      axios.get(this.url + '/tracks/' + trackID)
        .then(res => {
          console.log(res)
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
