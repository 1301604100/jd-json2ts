<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElMessage, ElInput, ElButton, ElRow, ElCol } from "element-plus";

import { generateTsType } from "./json2ts";

import "element-plus/dist/index.css";

const route = ref("");
const enterAction = ref<{
  code: string;
  type: string;
  payload: any;
  option: any;
  from?: PluginEnterFrom;
}>();

const inputJson = ref("");
const outputType = ref("");

const handleGenerate = () => {
  try {
    outputType.value = generateTsType(JSON.parse(inputJson.value));
  } catch (error) {
    console.log(error);
    ElMessage.error("JSON格式错误，请检查输入");
  }
};

const handleCopy = () => {
  if (!outputType.value) {
    ElMessage.warning("没有可复制的内容");
    return;
  }

  navigator.clipboard
    .writeText(outputType.value)
    .then(() => {
      ElMessage.success("复制成功");
    })
    .catch(() => {
      ElMessage.error("复制失败");
    });
};

onMounted(() => {
  window.utools.onPluginEnter((action) => {
    route.value = action.code;
    enterAction.value = action;
  });
  window.utools.onPluginOut((isKill) => {
    route.value = "";
  });
});
</script>

<template>
  <div class="container">
    <el-row :gutter="20" class="main-content">
      <el-col :span="11">
        <el-input
          v-model="inputJson"
          type="textarea"
          :rows="20"
          placeholder="请输入JSON数据"
          resize="none"
        />
      </el-col>
      <el-col :span="2" class="center-button">
        <el-button type="primary" @click="handleGenerate">
          生成类型 →
        </el-button>
      </el-col>
      <el-col :span="11">
        <div class="output-wrapper">
          <el-input
            v-model="outputType"
            type="textarea"
            :rows="20"
            placeholder="生成的TypeScript类型将显示在这里"
            readonly
            resize="none"
          />
          <el-button
            v-if="outputType"
            class="copy-button"
            type="primary"
            circle
            @click="handleCopy"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.main-content {
  height: 100%;
  display: flex;
  align-items: center;
}

.center-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-textarea__inner) {
  font-family: "Courier New", Courier, monospace;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.output-wrapper {
  position: relative;
}

.copy-button {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.copy-button:hover {
  opacity: 1;
}
</style>
