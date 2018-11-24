<template>
  <div id="heading">
    <h1>{{ title }}</h1>
    <h2>{{ subtitle }}</h2>
  </div>
</template>
<script>
export default {
  name: "heading",
  props: {
    title: String,
    subtitle: String
  }
}

</script>
<style scoped lang="scss">
@import "@/styles/font.scss";
#heading {
  margin: 0 0 80px 0;
  padding: 50px 0 50px 0;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  h1 {
    font-size: 2.5em;
    font-weight: bold;
    margin: 0 0 5px 0;
    color: $blue;
  }
  h2 {
    font-size: 17px;
    margin: auto;
    font-weight: 400;
    width: 50%;
    color: $black;
  }
}
</style>