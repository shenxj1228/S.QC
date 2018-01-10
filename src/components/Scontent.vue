<style scoped>
.layout-content {
 padding: 0 50px;min-height: 600px;

}
</style>

<template>
<Content class="layout-content" >
  <Breadcrumb :style="{margin: '20px 0'}">
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Components</BreadcrumbItem>
    <BreadcrumbItem>Layout</BreadcrumbItem>
  </Breadcrumb>
  <Card>
    <div style="min-height: 200px;">
      Content
    </div>
  </Card>
</Content>

</template>
<script>
export default {
  name: "Scontent",
  data: function() {
    return {};
  }
};
</script>
