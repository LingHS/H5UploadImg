<template>
  <div>
    <div @click="handleClick">
      <input 
      ref="input"
      type="file"
      @change="handleChange"
      :accept="accept"
      >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import uploadImg from "./upload.js";
import "./upload.scss";
export default {
  name: "Upload",
  props: {
    action: {
      type: String,
      required: true
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number,
      default: 1024 * 1024 * 1
    },
    format: {
      type: Array,
      default() {
        return ["jpeg", "png", "gif", "jpg"];
      },

      headers: Object,
      onExceededSize: {
        type: Function,
        default() {
          return {};
        }
      },
      onFormatError: {
        type: Function,
        default() {
          return {};
        }
      },
      onSuccess: {
        type: Function,
        default() {
          return {};
        }
      },
      onError: {
        type: Function,
        default() {
          return {};
        }
      }
    }
  },
  methods: {
    handleClick() {
      this.$refs.input.click();
    },
    handleChange(e) {
      console.log(this.format);
      let up = new uploadImg(this.maxSize, this.action, this.format);
      // console.log(1);
      up.onFormatError = this.onFormatError;
      up.onExceededSize = this.onExceededSize;
      up.handleInputChange(e);
    }
  }
};
</script>

