<template>
  <div id="Uploader">
    <transition name="fade">
      <div id="edit" v-if="status==0">
        <h2 v-if="!file">
          <label for="myFile"><u>Upload</u> your audio file</label>
        </h2>
        <h2 v-else>
          {{ file.name }}
          <p class="font-small font-reg"><label for="myFile"><u>Choose another file</u></label></p>
        </h2>
        <input name="myFile" id="myFile" accept="audio/*" type="file" v-on:change="fileSelected" style="display: none;">
        <div class="input-group">
          <h2>Title</h2>
          <input type="text" placeholder="" name="title" v-model="title">
        </div>
        <div class="input-group">
          <h2>Description</h2>
          <textarea placeholder="Two. Five. One." rows="2" maxlength="200" type="text" name="desc" v-model="desc"></textarea>
          <span v-if="desc">{{ 200-desc.length }} characters left</span>
        </div>
        <div class="button-wrapper">
          <div v-if="title&&file" class="button" @click="postTrack(title)">Upload</div>
          <div v-else class="button disabled">Upload</div>
        </div>
      </div>
    </transition>
    <transition name="fadeIn" class="fadeIn">
      <div id="success" v-show="status==1">
        <h2>Done! Here’s your link.</h2>
        <input type="text" name="title" disabled :value="'https://sendd.it/tracks/' + id">
        <div class="button-wrapper">
          <div class="button white-button">Copy link</div>
          <router-link class="button blue-button" tag="div" :to="'/track/' + id">Visit</router-link>
        </div>
      </div>
    </transition>
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
      desc: '',
      status: 0,
      id: '',
      file: '',
      queue: ''
    }
  },
  watch: {
    file: function(newData, oldData) {
      this.queue.append('file', newData)
    }
  },
  methods: {
    fileSelected(event) {
      if (event.target.files[0]) {
        if (this.checkFileSize(event.target.files[0])) {
          this.file = event.target.files[0]
          console.log(this.file)
        } else {
          this.fileRejected()
        }
      }
    },
    checkFileSize(file) {
      return file.size < 50000000
    },
    fileRejected() {
      alert('File size is bigger than 50mb')
    },
    postTrack(title) {
      var _this = this
      axios.post(this.url + '/file', this.queue).then(function(response) {
        if (response.status === 200) {
          _this.postTrackMeta()
        } else {
          alert('upload error')
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    postTrackMeta() {
      var _this = this
      axios.post(this.url + '/tracks', {
        title: this.title
      }).then(function(response) {
        if (response.data.code === 200) {
          _this.status = 1
          _this.id = response.data.body.id
        } else {
          _this.status = 3
        }
      }).catch(function(error) {
        console.log(error)
      })
    }
  },
  created() {
    this.queue = new FormData()
  }
}

</script>
<style scoped lang="scss">
@import '../styles/style.scss';

/* Animation*/

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
  height: 0;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: opacity .3s;
  transition-delay: 0.4s;
}

.fadeIn-enter,
.fade-leave-to {
  opacity: 0;
}

#Uploader {

  border-radius: 3px;
  min-height: 400px;
  padding: 20px 20px;
  box-shadow: 0 0 2px 0px #c3c3c3;
}

h2 {
  font-size: 1.3em;
  font-weight: 600;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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
  margin-bottom: 10px;
  &:focus {
    outline: none;
  }
}

.input-group {
  h2 {
    font-weight: 400;
    font-size: 1em;
  }
  span {
    color: rgb(142, 141, 141);
    font-size: 0.8em;
    position: absolute;
  }
}

.button-wrapper {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button {
  display: inline-block;
  background-color: $blue;
  color: white;
  border: none;
  width: 100%;
  text-align: center;
  padding: 10px 15px;
  border-radius: 100px;
  font-size: 1em;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
  }
}

.button:nth-child(2) {
  margin-left: 5px;
}

</style>
