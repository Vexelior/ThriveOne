import { defineStore } from 'pinia';
export const useRequestStore = defineStore('error', {
  state: () => ({
    message: '' as string,
    show: false,
    type: '',
  }),
  actions: {
    setInfo(msg: string) {
      this.message = msg;
      this.show = true;
      this.type = 'secondary';
      setTimeout(() => {
        this.clearMessage();
      }, 3000);
    },
    setWarning(msg: string) {
      this.message = msg;
      this.show = true;
      this.type = 'warning';
      setTimeout(() => {
        this.clearMessage();
      }, 3000);
    },
    setError(msg: string) {
      this.message = msg;
      this.show = true;
      this.type = 'danger';
      setTimeout(() => {
        this.clearMessage();
      }, 3000);
    },
    setSuccess(msg: string) {
      this.message = msg;
      this.show = true;
      this.type = 'success';
      setTimeout(() => {
        this.clearMessage();
      }, 3000);
    },
    clearMessage() {
      this.message = '';
      this.show = false;
      this.type = '';
    },
  },
});