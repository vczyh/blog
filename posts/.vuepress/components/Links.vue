<template>
  <div class="links">
    <div class="list">
      <div class="link-item card" v-for="(item, index) in currentPageData" :key="item.name">
        <img class="avatar" :src="item.avatar" @error="checkImg" />
        <div class="info">
          <h4 class="info-item title">{{item.title}}</h4>
          <p class="info-item desc">{{item.desc}}</p>
          <a class="info-item btn" target="blank" :href="item.link">去看看</a>
        </div>
      </div>
    </div>
    <pagation
      class="pagation"
      :total="examplesData.length"
      :currentPage="currentPage"
      :perPage="10"
      @getCurrentPage="getCurrentPage"
    ></pagation>
  </div>
</template>

<script>
import examplesData from "../data/friendData";
export default {
  data() {
    return {
      examplesData,
      currentPage: 1,
    };
  },
  computed: {
    currentPageData() {
      const start = (this.currentPage - 1) * 10;
      const end = this.currentPage * 10;
      return this.examplesData.slice(start, end);
    },
  },
  methods: {
    getCurrentPage(currentPage) {
      this.currentPage = currentPage;
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    },
    checkImg() {
      let img = event.srcElement;
      img.src = "https://p.vczyh.com/blog/white.jpg";
      img.onerror = null;
    },
  },
};
</script>

<style lang="stylus" scoped>
.links
  .list
    display flex
    flex-wrap wrap
    justify-content space-between
    .link-item
      display flex
      align-items center
      margin-bottom 4rem
      width 360px
      height 120px
      overflow hidden
      .avatar
        width 120px
      .info
        box-sizing border-box
        width 240px
        padding 0 1rem
        .info-item
          &:not(:last-child)
            margin-bottom 0.5rem
        .title
          margin 0
          font-weight 600
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .desc
          font-size 13px
          color #7f7f7f
          margin 0
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .btn
          display inline-block
          background-color $accentColor
          color #ffffff
          border-radius 2px
          padding 2px 5px
          font-size 12px
          text-decoration none
          cursor pointer
    .card
      box-shadow var(--box-shadow)
      border-radius 6px
@media (max-width $MQMobile)
  .links
    .list
      .link-item
        width 100%
</style>