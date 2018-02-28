<style scoped>
.carousel > h2 {
  text-align: center;
  margin-top: 40px;
}
.carousel {
  overflow: hidden;
}
.bg-white {
  background-color: #ffffff;
}
.bg-white > h2 {
  text-align: center;
  color: #19be6b;
}
.bg-white > img {
  margin: 0 auto;
}
</style>

<template>
    <Carousel ref="carousel" autoplay v-model="current" :autoplay-speed="speed" loop :height="carouselHeight">

        <CarouselItem>
            <Layout style="height:100%;">
                <Header class="bg-white">
                    <h2>第一步：选择一个项目</h2>
                </Header>
                <Layout class="bg-white">
                    <img src="../assets/selectProject.gif" width="80%" alt="" srcset="">
                </Layout>
            </Layout>
        </CarouselItem>
        <CarouselItem>
            <Layout style="height:100%;">
                <Header class="bg-white">
                    <h2>第二步：设置项目的查询结果字段</h2>
                </Header>
                <Layout class="bg-white">
                    <img src="../assets/setResultField.gif" width="80%" alt="" srcset="">

                </Layout>
            </Layout>
        </CarouselItem>
        <CarouselItem>
            <Layout style="height:100%;">
                <Header class="bg-white">
                    <h2>第三步：设置项目的查询条件字段</h2>
                </Header>
                <Layout class="bg-white">
                    <img src="../assets/setQueryField.gif" alt="" width="80%" srcset="">
                </Layout>
            </Layout>

        </CarouselItem>
        <CarouselItem>
            <Layout style="height:100%;">
                <Header class="bg-white">
                    <h2>第四步：操作项目缺陷</h2>
                </Header>
                <Layout class="bg-white">
                    <img src="../assets/setQueryField.gif" alt="" width="80%" srcset="">

                </Layout>
            </Layout>
        </CarouselItem>
    </Carousel>
</template>

<script>
export default {
  name: "Sindex",
  mounted() {
    this.carouselHeight = this.$refs.carousel.$parent.$parent.$el.offsetHeight;
  },
  data() {
    return {
      current: 0,
      speed: 4000,
      carouselHeight: 800
    };
  }
};
</script>
