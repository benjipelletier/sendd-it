<template>
  <div id="app">
    <Navbar></Navbar>
    <div class="components">
      <router-view/>
    </div>
  </div>
</template>
<script>
import Navbar from './components/Navbar'
export default {
  name: 'App',
  components: {
    Navbar
  }
}

</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #353535;
}

.components {
  max-width: 1200px;
  margin: auto;
  padding: 20px 30px;
}

</style>
