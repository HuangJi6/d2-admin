<template>
  <d2-container type="full" class="page">
    <d2-grid-layout
      v-bind="layout"
      @layout-updated="layoutUpdatedHandler">
      <d2-grid-item
        v-for="(item, index) in layout.layout"
        :key="index"
        v-bind="item"
        @resize="resizeHandler"
        @move="moveHandler"
        @resized="resizedHandler"
        @moved="movedHandler">
        <el-card shadow="never" class="page_card">
          <el-tag size="mini" type="info" slot="header">Card {{item.i}}</el-tag>
          <template v-if="item.i === '0'">
            <VueEcharts :option="option3" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
          <template v-if="item.i === '1'">
            <VueEcharts :option="option_column1" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
          <template v-if="item.i === '2'">
            <VueEcharts :option="polar" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
          <template v-if="item.i === '3'">
            <VueEcharts :option="option" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
          <template v-if="item.i === '4'">
            <VueEcharts :option="option2" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
          <template v-if="item.i === '5'">
            <VueEcharts :option="point" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
          <template v-if="item.i === '6'">
            <VueEcharts :option="option_column" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
          <template v-if="item.i === '7'">
            <VueEcharts :option="option7" :style="{height:item.h/22*700+'px'}" autoresize></VueEcharts>
          </template>
        </el-card>
      </d2-grid-item>
    </d2-grid-layout>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import { GridLayout, GridItem } from 'vue-grid-layout'
Vue.component('d2-grid-layout', GridLayout)
Vue.component('d2-grid-item', GridItem)
export default {
  data () {
    return {
      layout: {
        layout: [
          { x: 0, y: 0, w: 6, h: 11, i: '0' },
          { x: 6, y: 0, w: 6, h: 11, i: '1' },
          { x: 0, y: 11, w: 4, h: 10, i: '2' },
          { x: 4, y: 11, w: 4, h: 10, i: '3' },
          { x: 8, y: 11, w: 4, h: 10, i: '4' },
          { x: 0, y: 21, w: 3, h: 10, i: '5' },
          { x: 3, y: 21, w: 5, h: 10, i: '6' },
          { x: 8, y: 21, w: 4, h: 10, i: '7' }
        ],
        colNum: 12,
        rowHeight: 30,
        isDraggable: true,
        isResizable: true,
        isMirrored: false,
        verticalCompact: true,
        margin: [10, 10],
        useCssTransforms: true
      },
      // 柱状图
      option_column: {
        title: { text: 'Column Chart' },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      },
      // 堆叠柱状图
      option_column1: {
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E']
        },
        yAxis: {},
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: 'bar',
            stack: 'x'
          },
          {
            data: [5, 4, 3, 5, 10],
            type: 'bar',
            stack: 'x'
          }
        ]
      },
      // 折线图
      option: {
        xAxis: {
          type: 'category',
          data: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 300, 500, 438, 600],
            type: 'line'
          }
        ]
      },
      // 堆叠折现
      option2: {
        xAxis: {
          data: ['A', 'B', 'C', 'D', 'E']
        },
        yAxis: {},
        series: [
          {
            data: [10, 22, 28, 43, 49],
            type: 'line',
            stack: 'x'
          },
          {
            data: [5, 4, 3, 5, 10],
            type: 'line',
            stack: 'x'
          }
        ]
      },
      // 饼状图
      polar: {
        title: {
          text: '会员数据统计',
          subtext: '动态数据',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: 'left',
          data: ['微信访问', '公众号访问', '扫码进入', '分享进入', '搜索访问']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '微信访问' },
              { value: 310, name: '公众号访问' },
              { value: 234, name: '扫码进入' },
              { value: 135, name: '分享进入' },
              { value: 1548, name: '搜索访问' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      point: {
        xAxis: {},
        yAxis: {},
        series: [
          {
            type: 'scatter',
            data: [
              [10, 5],
              [0, 8],
              [6, 10],
              [2, 12],
              [8, 9]
            ]
          }
        ]
      },
      option3: {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '2012', '2013', '2014', '2015'],
            ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
            ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
            ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
          ]
        },
        xAxis: [
          { type: 'category', gridIndex: 0 },
          { type: 'category', gridIndex: 1 }
        ],
        yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
        grid: [{ bottom: '55%' }, { top: '55%' }],
        series: [
          // These series are in the first grid.
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          { type: 'bar', seriesLayoutBy: 'row' },
          // These series are in the second grid.
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
          { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 }
        ]
      },
      option7: {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: 'Pressure',
            type: 'gauge',
            progress: {
              show: true
            },
            detail: {
              valueAnimation: true,
              formatter: '{value}'
            },
            data: [
              {
                value: 50,
                name: 'SCORE'
              }
            ]
          }
        ]
      }
    }
  },
  mounted () {
    // 加载完成后显示提示
    this.showInfo()
  },
  methods: {
    log (arg1 = 'log', ...logs) {
      if (logs.length === 0) {
        console.log(arg1)
      } else {
        console.group(arg1)
        logs.forEach(e => {
          console.log(e)
        })
        console.groupEnd()
      }
    },
    // 显示提示
    showInfo () {
      this.$notify({
        title: '提示',
        message: '你可以按住卡片拖拽改变位置；或者在每个卡片的右下角拖动，调整卡片大小'
      })
    },
    // 测试代码
    layoutUpdatedHandler (newLayout) {
      console.group('layoutUpdatedHandler')
      newLayout.forEach(e => {
        console.log(`{'x': ${e.x}, 'y': ${e.y}, 'w': ${e.w}, 'h': ${e.h}, 'i': '${e.i}'},`)
      })
      console.groupEnd()
    },
    resizeHandler (i, newH, newW) {
      this.log('resizeHandler', `i: ${i}, newH: ${newH}, newW: ${newW}`)
    },
    moveHandler (i, newX, newY) {
      this.log('moveHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
    },
    resizedHandler (i, newH, newW, newHPx, newWPx) {
      this.log('resizedHandler', `i: ${i}, newH: ${newH}, newW: ${newW}, newHPx: ${newHPx}, newWPx: ${newWPx}`)
    },
    movedHandler (i, newX, newY) {
      this.log('movedHandler', `i: ${i}, newX: ${newX}, newY: ${newY}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  .vue-grid-layout {
    background-color: $color-bg;
    border-radius: 4px;
    margin: -10px;
    .page_card {
      height: 100%;
      @extend %unable-select;
    }
    .vue-resizable-handle {
      opacity: .3;
      &:hover{
        opacity: 1;
      }
    }
  }
}
</style>
