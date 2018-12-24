<template>
  <div id="navbar">
    <div class="left"><img id="logo" src="../assets/logo.png"></div>
    <router-link tag="div" to="/upload" class="right">Upload</router-link>
  </div>
</template>
<script>
export default {
  name: 'Navbar',
  data() {
    return {

    }
  },
  created() {

  }
}
</script>
<style scoped lang="scss">
#navbar {
  width: 100%;
  height: 70px;
  background-color: #2985F1;
  padding: 20px 5%;
  color: white;
  font-size: 1.1em;
  display: flex;
  justify-content: space-between;
  align-items: center;

  #logo {
    width: 80px;
  }
  .right {
    font-size: 15px;
    box-sizing: border-box;
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover {
      opacity: 0.5;
    }
  }
}

</style>
