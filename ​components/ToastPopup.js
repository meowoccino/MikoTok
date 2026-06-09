// components/ToastPopup.js
export default {
    props: {
        toastData: {
            type: Object,
            required: true
        }
    },
    template: `
        <div class="toast-popup" :class="{ show: toastData.visible }" v-html="toastData.message"></div>
    `
};
