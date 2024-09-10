export default {
    data() {
        return {
            field: {
                isVertical: this.isVertical || false,
                width: this.width,
                labelWidth: this.labelWidth
            }
        }
    },
    props: {
        width: Number,         // 组件宽度
        labelWidth: Number,     // 标签宽度
        isVertical: Boolean    // 组件宽度100%
    },
    watch: {
        width(val) {
            this.field['width'] = val;
        },
        labelWidth(val) {
            this.field['labelWidth'] = val;
        },
        isVertical(val) {
            this.field['isVertical'] = val;
        }
    }
}