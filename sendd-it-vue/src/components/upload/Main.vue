<template>
  <div id="UploadMain">
    <Heading title="Upload" subtitle="Your track will be available for 7 days. Share with friends and colleagues."></Heading>
    <TrackBox :title="file.name" v-on:onSelectFile="onSelectFile"></TrackBox>
    <!-- <div class="container">
      <div class="component lg">
        <transition name="fade">
          <div id="edit" v-if="status==0">
            <div class="input-group">
              <h2>Title</h2>
              <input type="text" placeholder="Name your track" name="title" v-model="title">
            </div>
            <div class="input-group">
              <h2>Description</h2>
              <textarea placeholder="Describe your track" rows="3" maxlength="200" type="text" name="desc" v-model="desc"></textarea>
              <span v-if="desc">{{ 200-desc.length }} characters left</span>
            </div>
            <div class="button-wrapper">
              <div v-if="title&&file" class="button blue-button" @click="postTrack(title)">Upload</div>
              <div v-else class="button disabled">Upload</div>
            </div>
          </div>
        </transition>
        <transition name="fadeIn" class="fadeIn">
          <div v-show="status==2">
            <div class="progress">
              <div class="bar" :style='progressBar()'></div>
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
    </div> -->
  </div>
</template>
<script>
import axios from "axios"
import Heading from "../public/Heading"
import TrackBox from "./TrackBox"

export default {
  name: "UploadMain",
  data() {
    return {
      title: "",
      desc: "",
      status: 0,
      id: "",
      file: "",
      queue: new FormData(),
      progress: 0
    };
  },
  components: {
    Heading,
    TrackBox
  },
  watch: {
    file: function(newData, oldData) {
      this.queue.append("file", newData)
    }
  },
  methods: {
    setProgressBar() {
      let progress = setInterval(() => {
        this.progress += Math.floor(Math.random() * 30);
        if (this.progress >= 100) clearInterval(progress);
      }, 500)
    },
    progressBar() {
      if (this.progress < 100) {
        return `width: ${Math.floor(this.progress)}%`;
      } else {
        return `width: 100%; border-radius: 5px`;
      }
    },
    onSelectFile(event) {
      const file = event.target.files[0]
      if (file) {
        console.log(file)
        if (!this.checkFileSize(file)) {
          return this.fileRejected()
        }
        if (!this.checkFileType(file)) {
          return this.fileRejected()
        }
        this.file = file
      }
    },
    checkFileSize(file) {
      return file.size < 50000000
    },
    checkFileType(file) {
      return file.type.includes("audio")
    },
    fileRejected() {
      alert("File size is bigger than 50mb");
    },
    postTrack(title) {
      this.status = 2
      this.setProgressBar()
      this.$axios
        .post("file", this.queue)
        .then(res => {
          if (res.status === 200) {
            this.postTrackMeta()
          } else {
            alert("upload error")
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    async postTrackMeta() {
      try {
        const { data } = await this.$axios.post("tracks", {
          title: this.title
        })
        this.status = 1
        this.id = data.body.id
      } catch (err) {
        console.log(err)
      }
      
      // this.$axios
      //   .post("tracks", {
      //     title: this.title
      //   })
      //   .then(res => {
      //     if (res.data.code === 200) {
      //       this.status = 1
      //       this.id = res.data.body.id
      //     } else {
      //       this.status = 3
      //     }
      //   })
      //   .catch(function(error) {
      //     console.log("failed")
      //   })
    }
  },
  created() {
  }
}
</script>
<style scoped lang="scss">
@import "@/styles/style.scss";

#UploadMain {
}

/* Animation*/

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
  height: 0;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: opacity 0.3s;
  transition-delay: 0.4s;
}

.fadeIn-enter,
.fade-leave-to {
  opacity: 0;
}

.component {
}

h2 {
  font-size: 1.3em;
  font-weight: 600;
  /*  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;*/
}

/*.input-group {
  h2 {
    font-weight: 400;
    font-size: 1em;
  }
  span {
    color: rgb(142, 141, 141);
    font-size: 0.8em;
    position: absolute;
  }
}*/

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
  border-radius: 5px;
  font-size: 1.5em;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    cursor: pointer;
  }
}

.button:nth-child(2) {
  margin-left: 5px;
}

.progress {
  $status-bar-radius: 5px;
  width: 100%;
  margin: 10px auto 0 auto;
  background: #dcdcdc;
  height: 20px;
  border-radius: $status-bar-radius;
  .bar {
    background: #2985f1;
    height: 20px;
    width: 20px;
    transition: width 0.5s ease;
    border-top-left-radius: $status-bar-radius;
    border-bottom-left-radius: $status-bar-radius;
  }
}
</style>
