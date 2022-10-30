export default () => ({
  contentId: window.localStorage.getItem('contentId') || 1,
  isDark: window.localStorage.getItem('dark') || false,
  user: {},
  modelOpen: false,
  toggleTheme() {
    this.isDark = !this.isDark
    window.localStorage.setItem('dark', this.isDark)
  },
  setContentId(value) {
    this.contentId = value
    window.localStorage.setItem('contentId', this.contentId)
  },
  getContentId() {
    return this.contentId
  },
  openModal(userId, name) {
    this.modelOpen = true
    this.user = { id: userId, name: name }
  },
})
