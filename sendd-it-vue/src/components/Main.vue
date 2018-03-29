<template>
  <div id="Main" v-if="data">
    <h1>Tracks</h1>
    <div class="track" v-for="item in data" :key="item.id">
      <h2>ID: {{ item.id }}</h2>
      <h2>Name: {{ item.name }}</h2>
    </div>
  </div>
</template>

<script>
import database from '../db'
export default {
  name: 'Main',
  data () {
    return {
      data: ''
    }
  },
  methods: {
    readData () {
      var that = this
      database.ref('/tracks').once('value').then(function (data) {
        that.data = data.val()
      })
    }
  },
  created () {
    this.readData()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#Main {
  text-align: left;
  padding: 0 5%;
}
h1 { margin-bottom: 50px; }
.track {
  font-size: 0.8em;
  margin-bottom: 20px;
  border-bottom: 1px solid #dedede;
}
</style>
