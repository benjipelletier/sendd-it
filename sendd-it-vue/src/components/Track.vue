<template>
  <div id="Track">
    <div v-if="data">
      <h2>{{ data.title }}</h2>
      <p>Passcode: {{ data.passcode }}</p>
      <p>Timestamp: {{ data.timestamp }}</p>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Track",
  data() {
    return {
      url: "https://us-central1-sendd-it.cloudfunctions.net/api",
      id: this.$route.params.id,
      data: ""
    };
  },
  methods: {
    getTrack(trackID) {
      var _this = this;
      axios
        .get(this.url + "/tracks/" + trackID)
        .then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.data = res.data.body;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    this.getTrack(this.$route.params.id);
  }
};
</script>

<style scoped>
#Track {
  text-align: left;
  padding: 100px 5%;
}
.uploader {
  max-width: 400px;
  margin: auto;
}
</style>
