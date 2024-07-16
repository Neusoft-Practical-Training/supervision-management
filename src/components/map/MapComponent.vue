<script lang="ts">
import { defineComponent, type PropType } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { KEY_AMAP, SECURITY_JS_CODE_AMAP, VERSION_AMAP } from "@/common/constants";
import { ElMessage } from 'element-plus'

// 确定具体位置后，放大的地图比例
const ENLARGE_ZOOM: number = 14

export type Mark = {
  position: string,
  title: string
}

export type Location = {
  province: string,
  city: string,
  address: string
}

/**
 * 基于高德地图公开API构建的地图组件，若不传入具体地址，则地图将自动定位到您所在城市并显示
 */
export default defineComponent({
  name: 'MapComponent',
  props: {
    width: {
      type: String,
      required: false,
      default: '100%',
    },
    height: {
      type: String,
      required: false,
      default: '250px',
    },
    type: {
      type: String,
      required: false,
      default: '2D',
      validator: (type: string) => ['2D', '3D'].includes(type),
    },
    city: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    zoom: {
      type: Number,
      required: false,
      default: 11,
    },
    showToolBar: {
      type: Boolean,
      required: false,
      default: false,
    },
    showScale: {
      type: Boolean,
      required: false,
      default: false,
    },
    showHawkEye: {
      type: Boolean,
      required: false,
      default: false,
    },
    marks: {
      type: Array as PropType<Mark[]>,
      required: false,
      default: () => [], // 默认值为空数组
    },
  },
  watch: {
    city: 'updateMapLocation',
    address: 'updateMapLocation',
    marks: {
      handler(newMarks: Mark[], oldMarks: Mark[]) {
        // 计算新增的标记
        const addedMarks = newMarks.filter((_, index) => !oldMarks[index]);

        // 计算删除的标记
        const removedMarks = oldMarks.filter((_, index) => !newMarks[index]);

        // 计算更新的标记
        const updatedMarks = newMarks.filter((newMark, index) => {
          const oldMark = oldMarks[index];
          return oldMark && (oldMark.position !== newMark.position || oldMark.title !== newMark.title);
        });

        // 添加新增的标记
        addedMarks.forEach(mark => this.addMark(mark));

        // 移除删除的标记
        removedMarks.forEach((_, index) => this.removeMark(index));

        // 更新内容变更的标记
        updatedMarks.forEach((newMark, index) => this.updateMark(index, newMark));
      },
      deep: true,
    },
  },
  mounted() {
    this.initAMap();
  },
  unmounted() {
    this.mapComponent?.destroy();
  },
  methods: {
    initAMap() {
      const mapContainer = this.$refs.mapContainer as HTMLDivElement;
      mapContainer.style.width = this.width;
      mapContainer.style.height = this.height;
      const w: any = window
      w._AMapSecurityConfig = {
        securityJsCode: SECURITY_JS_CODE_AMAP,
      };

      AMapLoader.load({
        key: KEY_AMAP, // 申请好的Web端开发者key，调用 load 时必填
        version: VERSION_AMAP, // 指定要加载的 JS API 的版本，缺省时默认为 1.4.15
        plugins: ['AMap.AutoComplete', 'AMap.Geocoder'],
      })
        .then((AMap) => {
          this.AMap = AMap;
          this.mapComponent = new AMap.Map(this.$refs.mapContainer, {
            zoom: this.zoom, // 地图显示的缩放级别
            viewMode: this.type //地图模式
          });

          if (this.showToolBar) {
            AMap.plugin('AMap.ToolBar', () => this.mapComponent!.addControl(new AMap.ToolBar()));
          }
          if (this.showScale) {
            AMap.plugin('AMap.Scale', () => this.mapComponent!.addControl(new AMap.Scale()));
          }
          if (this.showHawkEye) {
            AMap.plugin('AMap.HawkEye', () => this.mapComponent!.addControl(new AMap.HawkEye()));
          }

          if (this.city && this.address) {
            this.updateMapLocation();  // 根据父组件传递的位置定位
          } else {
            this.locateCurrentLocation();  // 根据当前位置定位，并返回当前位置信息
          }

          this.updateMarks();
        })
        .catch((e) => {
          console.error(`Init failed for AMap: ${e}`); // 加载错误提示
        });
    },
    updateMapLocation() {
      if (this.city && this.address) {
        const geocoder = new this.AMap!.Geocoder({
          city: this.city,
        });
        geocoder.getLocation(this.address, (status: string, result: any) => {
          if (status === 'complete' && result.geocodes.length) {
            const location = result.geocodes[0].location;
            this.mapComponent!.setZoomAndCenter(ENLARGE_ZOOM, location);
          } else {
            console.log(`Update failed for map location: ${result}`)
          }
        });
      }
    },
    locateCurrentLocation() {
      this.AMap.plugin('AMap.Geolocation', () => {
        const geolocation = new this.AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认：true
          timeout: 10000, // 设置定位超时时间，默认：无穷大
          offset: [10, 20], // 定位按钮的停靠位置的偏移量
          zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          position: 'RB', // 定位按钮的排放位置,  RB表示右下
        });
        this.mapComponent.addControl(geolocation);
        geolocation.getCurrentPosition((status: string, result: any) => {
          if (status == 'complete') {
            this.onComplete(result);
          } else {
            this.onError(result);
          }
        });
      });
    },
    locateCurrentCity() {
      this.AMap.plugin('AMap.CitySearch', () => {
        const citySearch = new this.AMap.CitySearch()
        citySearch.getLocalCity(function (status: string, result: any) {
          if (status === 'complete' && result.info === 'OK') {
            const location: Location = {province: result['province'], city: result['city'], address: ''}
            return location;
          }
        })
      })
      return undefined;
    },
    updateMarks() {
      this.clearMarks();
      this.marks.forEach(mark => this.addMark(mark));
    },
    clearMarks() {
      if (this.markers && this.markers.length) {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
      }
    },
    addMark(mark: Mark) {
      const geocoder = new this.AMap.Geocoder();
      geocoder.getLocation(mark.position, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes.length) {
          const location = result.geocodes[0].location;
          const marker = new this.AMap.Marker({
            position: location,
            map: this.mapComponent,
            title: mark.title,
          });
          this.markers.push(marker);
        } else {
          console.error(`Geocoding failed for address: ${mark.position}`);
        }
      });
    },
    removeMark(index: number) {
      if (this.markers && this.markers[index]) {
        this.markers[index].setMap(null);
        this.markers.splice(index, 1);
      }
    },
    updateMark(index: number, newMark: Mark) {
      const marker: any = this.markers[index];
      if (marker) {
        const geocoder = new this.AMap!.Geocoder();
        geocoder.getLocation(newMark.position, (status: string, result: any) => {
          if (status === 'complete' && result.geocodes.length) {
            const location = result.geocodes[0].location;
            marker.setPosition(location);
            marker.setTitle(newMark.title);
            this.markers[index] = marker;
          } else {
            console.error(`Geocoding failed for address: ${newMark.position}`);
          }
        });
      }
    },
    onComplete(data: any) {
      const geocoder = new this.AMap.Geocoder();
      let address = undefined
      geocoder.getAddress(data.position, (status: string, result: any) => {
          if (status === 'complete' && result.regeocode.length) {
            address = result.regeocode[0].address;
          } else {
            ElMessage({ type: 'warning', message: '获取精确位置失败！' })
          }
      })
      // 向父组件返回精确位置
      this.$emit('locationComplete', address);
    },
    onError(data: any) {
      console.log(data)
      const address = this.locateCurrentCity();
      ElMessage({ type: 'warning', message: '获取精确位置失败！' })
      // 向父组件返回精确位置
      this.$emit('locationComplete', address);
    },
  },
  data() {
    return {
      markers: [] as any[],
      AMap: undefined as any,
      mapComponent: undefined as any
    };
  },
});
</script>

<template>
  <div ref="mapContainer" class="map" :style="{ width: width, height: height }"></div>
</template>

<style scoped>
.map {
  margin-bottom: 10px;
}
</style>