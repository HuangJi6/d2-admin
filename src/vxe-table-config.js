import VXETable from 'vxe-table'
// import VXETablePluginElement from 'vxe-table-plugin-element'
// import VXETablePluginMenus from 'vxe-table-plugin-menus'
// import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'

const vxeTable = {
  install: function (Vue) {
    VXETable.setup({
      // 全局图标
      // loading
      LOADING: 'vxe-icon-spinner roll vxe-loading--default-icon',

      // table
      TABLE_SORT_ASC: 'vxe-icon-caret-up',
      TABLE_SORT_DESC: 'vxe-icon-caret-down',
      TABLE_FILTER_NONE: 'vxe-icon-funnel',
      TABLE_FILTER_MATCH: 'vxe-icon-funnel',
      TABLE_EDIT: 'vxe-icon-edit',
      TABLE_HELP: 'vxe-icon-question-circle-fill',
      TABLE_TREE_LOADED: 'vxe-icon-spinner roll',
      TABLE_TREE_OPEN: 'vxe-icon-caret-right rotate90',
      TABLE_TREE_CLOSE: 'vxe-icon-caret-right',
      TABLE_EXPAND_LOADED: 'vxe-icon-spinner roll',
      TABLE_EXPAND_OPEN: 'vxe-icon-arrow-right rotate90',
      TABLE_EXPAND_CLOSE: 'vxe-icon-arrow-right',
      TABLE_CHECKBOX_CHECKED: 'vxe-icon-checkbox-checked',
      TABLE_CHECKBOX_UNCHECKED: 'vxe-icon-checkbox-unchecked',
      TABLE_CHECKBOX_INDETERMINATE: 'vxe-icon-checkbox-indeterminate',
      TABLE_RADIO_CHECKED: 'vxe-icon-radio-checked',
      TABLE_RADIO_UNCHECKED: 'vxe-icon-radio-unchecked',

      // button
      BUTTON_DROPDOWN: 'vxe-icon-arrow-down',
      BUTTON_LOADING: 'vxe-icon-spinner roll',

      // select
      SELECT_LOADED: 'vxe-icon-spinner roll',
      SELECT_OPEN: 'vxe-icon-caret-down rotate180',
      SELECT_CLOSE: 'vxe-icon-caret-down',

      // pager
      PAGER_JUMP_PREV: 'vxe-icon-arrow-double-left',
      PAGER_JUMP_NEXT: 'vxe-icon-arrow-double-right',
      PAGER_PREV_PAGE: 'vxe-icon-arrow-left',
      PAGER_NEXT_PAGE: 'vxe-icon-arrow-right',
      PAGER_JUMP_MORE: 'vxe-icon-ellipsis-h',

      // input
      INPUT_CLEAR: 'vxe-icon-error-circle-fill',
      INPUT_PWD: 'vxe-icon-eye-fill',
      INPUT_SHOW_PWD: 'vxe-icon-eye-fill-close',
      INPUT_PREV_NUM: 'vxe-icon-caret-up',
      INPUT_NEXT_NUM: 'vxe-icon-caret-down',
      INPUT_DATE: 'vxe-icon-calendar',
      INPUT_SEARCH: 'vxe-icon-search',

      // modal
      MODAL_ZOOM_IN: 'vxe-icon-square',
      MODAL_ZOOM_OUT: 'vxe-icon-maximize',
      MODAL_CLOSE: 'vxe-icon-close',
      MODAL_INFO: 'vxe-icon-info-circle-fill',
      MODAL_SUCCESS: 'vxe-icon-success-circle-fill',
      MODAL_WARNING: 'vxe-icon-warnion-circle-fill',
      MODAL_ERROR: 'vxe-icon-error-circle-fill',
      MODAL_QUESTION: 'vxe-icon-question-circle-fill',
      MODAL_LOADING: 'vxe-icon-spinner roll',

      // toolbar
      TOOLBAR_TOOLS_REFRESH: 'vxe-icon-repeat',
      TOOLBAR_TOOLS_REFRESH_LOADING: 'vxe-icon-repeat roll',
      TOOLBAR_TOOLS_IMPORT: 'vxe-icon-upload',
      TOOLBAR_TOOLS_EXPORT: 'vxe-icon-download',
      TOOLBAR_TOOLS_PRINT: 'vxe-icon-print',
      TOOLBAR_TOOLS_FULLSCREEN: 'vxe-icon-fullscreen',
      TOOLBAR_TOOLS_MINIMIZE: 'vxe-icon-minimize',
      TOOLBAR_TOOLS_CUSTOM: 'vxe-icon-custom-column',

      // form
      FORM_PREFIX: 'vxe-icon-question-circle-fill',
      FORM_SUFFIX: 'vxe-icon-question-circle-fill',
      FORM_FOLDING: 'vxe-icon-arrow-up rotate180',
      FORM_UNFOLDING: 'vxe-icon-arrow-up'
    })
    // VXETable.use(VXETablePluginMenus)
    // VXETable.use(VXETablePluginExportXLSX)
    // VXETable.use(VXETablePluginElement)
    Vue.use(VXETable)
  }
}
export default vxeTable
