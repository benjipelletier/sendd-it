<template>
  <div id="track-box">
    <div class="animated fadeIn container" key="track-selected" v-if="isTrack">
      <h1>{{ title }}</h1>
      <h2>
        <span>drag and drop or </span>
        <label for="file">choose another file</label>
      </h2>
      <input name="file" id="file" accept="audio/*" type="file" v-on:change="onSelectFile">
    </div>
    <div class="container" key="track-empty" v-else>
      <h1>Drag and drop your track</h1>
      <label for="file">
        <div class="white-button" id="choose-file-button">or choose file</div>
      </label>
      <input name="file" id="file" accept="audio/*" type="file" v-on:change="onSelectFile">
    </div>
  </div>
</template>
<script>
export default {
  name: "track-box",
  props: {
    title: String
  },
  computed: {
    isTrack() {
      if (this.title) {
        return true
      }
      return false
    }
  },
  methods: {
    onSelectFile(event) {
      this.$emit("onSelectFile", event)
    }
  },
  data() {
    return {}
  },
  created() {
  }
}
</script>
<style scoped lang="scss">
@import "@/styles/style.scss";
@import "@/styles/animate.scss";
#track-box {
  margin-bottom: 50px;
  width: 100%;

  .container {
    text-align: center;
    h1 {
      font-size: 25px;
      margin: 0 auto;
      display: block;
      max-width: 600px;
    }
    input {
      display: none;
    }
    h2 {
      font-size: 15px;
      font-weight: 400;
      margin: 0;
      span {
        opacity: 0.7;
      }
      label {
        color: $blue;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    #choose-file-button {
      margin: 5px 0 0 0;
      display: inline-block;
    }
  }
}
</style>
