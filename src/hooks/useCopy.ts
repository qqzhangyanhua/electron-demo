import { message } from "ant-design-vue";
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();

export const handelCopy = async (value: string) => {
  await toClipboard(value);
  message.success("复制成功");
};
