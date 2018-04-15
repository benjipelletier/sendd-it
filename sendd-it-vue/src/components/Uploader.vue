<template>
  <div id="Uploader">
    <h2>Add your audio file</h2>
    <!-- <form id="uploadFile" enctype="multipart/form-data">
      <input id="uploadFile" type="file" name="uploadFile">
    </form> -->
    <div class="input-group">
      <h2>Title</h2>
      <input type="text" placeholder="" name="title" v-model="title">
    </div>
    <div class="input-group">
      <h2>Description</h2>
      <textarea placeholder="Two. Five. One." rows="2" maxlength="200" type="text" name="desc" v-model="desc"></textarea>
      <span v-if="desc">{{ 200-desc.length }} characters left</span>
    </div>
    <br>
    <br>
    <div v-if="title" class="button" @click="postTrack(title)">Upload</div>
    <div v-else class="button disabled">Upload</div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'Uploader',
  data() {
    return {
      url: 'https://us-central1-sendd-it.cloudfunctions.net/api',
      title: '',
      desc: ''
    }
  },
  methods: {
    postTrack(title) {
      axios.post(this.url + '/tracks', {
          title: title
        })
        .then(function(response) {
          console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  },
  created() {}
}

</script>
<style scoped lang="scss">
/* To be extracted */
$blue: #3A76BD;
$black: #353535;
.font-bold {
  font-weight: 500;
}

.font-light {
  font-weight: 400;
}

.font-reg {
  font-weight: 400;
}

.disabled {
  opacity: 0.5
}
/* ------ */

#Uploader {

  border-radius: 3px;
  min-height: 500px;
  padding: 20px 20px;
  box-shadow: 0 0 2px 0px #c3c3c3;
}

h2 {
  font-size: 1.3em;
  font-weight: 600;
}

.input-group h2 {
  font-weight: 400;
  font-size: 1em;
}

input,
select,
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 3px;
  width: 100%;
  font-size: 1em;
  font-weight: 400;
  box-shadow: none;
  border: none;
  border: 1px solid #E3E3E3;
  line-height: 1.5;
  padding: 5px 10px;
  outline: none;
  height: auto;
  resize: none;
  &:focus {
    outline: none;
  }
}

.input-group {
  span {
    color: rgb(142, 141, 141);
    font-size: 0.8em;
    position: absolute;
  }
}

.button {
  display: inline-block;
  background-color: $blue;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 1em;
  font-weight: 500;
  &:hover {
    cursor: pointer;
  }
  &:active {
    background-color: #235b9c;
  }
}

</style>
