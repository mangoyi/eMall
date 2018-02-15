<template xmlns:v-lazy="http://www.w3.org/1999/xhtml">
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span slot="bread">goods</span>
    </nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short"></use>
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" v-bind:class="{'cur': priceChecked == 'all'}" @click="priceChecked = 'all' ">All</a></dd>
              <dd v-for="(price, index) in priceFilter">
                <a href="javascript:void(0)" v-bind:class="{'cur': priceChecked==index}"  @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,index) in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                加载中...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
    import './../assets/css/base.css'
    import './../assets/css/product.css'

    import NavHeader from '../components/NavHeader'
    import NavFooter from './../components/NavFooter'
    import NavBread  from './../components/NavBread'

    import axios from 'axios'

    export default {
        data() {
          return {
            goodsList: [],
            sortFlag: true,
            page: 1,
            pageSize: 8,
            busy: true,
            priceFilter:[
              {
                startPrice: '0.00',
                endPrice: '500.00'
              },
              {
                startPrice: '500.00',
                endPrice: '1000.00'
              },
              {
                startPrice: '1000.00',
                endPrice: '2000.00'
              }
            ],
            priceChecked: 'all',
            filterBy: false,
            overLayFlag: false
          }
        },
        components: {
          NavHeader:NavHeader,
          NavFooter:NavFooter,
          NavBread:NavBread
        },
        mounted: function() {
          this.getGoodsList();
        },
        methods: {
          getGoodsList(flag) {
            var param  = {
              page: this.page,
              pageSize: this.pageSize,
              sort: this.sortFlag ? 1:-1
            };

            axios.get("/goods", {
              params: param                           // url中传递的参数  http://localhost:8080/goods?page=1&pageSize=8&sort=-1
            }).then((responce) => {
              let res = responce.data;
              if (res.status == 0){
                if (flag) {
                  this.goodsList = this.goodsList.concat(res.result.list);                             // flag == true表示分页

                  if (res.result.count == 0) {   // 说明已经没有数据了
                    this.busy = true;
                  } else {
                    this.busy = false;
                  }

                } else {
                  this.goodsList = res.result.list;
                  this.busy = false;
                }

              } else {
                this.goodsList = [];
              }
             });
          },
          sortGoods() {
            this.sortFlag = !this.sortFlag;
            this.page = 1;
            this.getGoodsList();
          },
          loadMore() {
            this.busy = true;  // 在请求成功之前，禁止浏览器再次进行滚动加载。 busy = true, 滚动加载失效
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 500);                    // 通过使用setTimeout去控制，当第一个请求发送完成之后，在开始第二个请求（而不是当鼠标只要一滚动就发送请求，不然这样对服务器的压力太大了）
          },
          showFilterPop() {
            this.filterBy = true;
            this.overLayFlag = true;
          },
          setPriceFilter(index) {
            this.priceChecked = index;
            this.closePop();
          },
          closePop() {
            this.filterBy = false;
            this.overLayFlag = false;
          }
        }
    }
</script>

<style scoped>
  .container{
    padding: 0 10px;
  }
  .filter-nav{
    height: 55px;
    line-height: 55px;
    background-color: white;
    /*text-align: center;*/
    padding-right: 20px;
    margin: 60px 0 30px 0;
  }
  .def{
    color: #ee7a23;
  }
  .filter-nav span{
    margin-right: 10px;
  }
  .filter-nav a {
    margin-left: 10px;
  }
  .icon-arrow-short {
    width: 11px;
    height: 11px;
  }
  .goods-container {
    display: flex;
  }
  .price-wrap {
    padding: 0 20px;
    margin-right: 50px;
    width: 230px;
  }
  .price-filter dt{
    height: 40px;
    line-height: 40px;
    margin-bottom: 30px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .price-filter dd {
    height: 26px;
    line-height: 26px;
    margin-bottom: 20px;
  }
  .price-filter dd a {
    transition: all .3s ease-out;
  }
  .cur {
    border-left: 2px solid #ee7a2c;
    color: #ee7a2c;
    transition: all .3s ease-out;
    padding-left: 15px;
  }
  .list-wrap {
    flex: 1;
  }
  .list-wrap ul::after{
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }
  .list-wrap .item{
    width: 23.80952%;
    float: left;
    margin-right: 1.5%;
    margin-bottom: 1.5%;
    border: 2px solid #e9e9e9;
    background-color: white;
    transition: all .5s ease-out;
  }
  .load-more {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
