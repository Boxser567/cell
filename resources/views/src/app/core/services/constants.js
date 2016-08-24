'use strict';

export default function (app) {
    app
        .constant('ROUTE_ERRORS', {
            auth: 'Authorization has been denied.',
        })
        .constant('FILE_SORTS', {
            'SORT_PDF': ['pdf'],
            'SORT_PPT': ['pot', 'pptx', 'ppt', 'pps', 'potm', 'potx', 'ppsm', 'ppsx', 'pptm'],
            'SORT_IMG': ['png'],
            'SORT_PHOTO': ['jpg', 'jpeg', 'gif', 'bmp'],
            'SORT_DOCUMENT': ['doc', 'docx', 'dot', 'dotm'],
            'SORT_OTHERDOC': ['txt', 'rtf', 'gknote', 'md', 'odt', 'ods', 'odp'],
            'SORT_TABLE': ['xls', 'xlt', 'xlw', 'xlsb', 'xlsm', 'xlsx', 'xltm', 'xltm'],
            'SORT_DRAW': ['psd', 'ai', 'dwg', 'dxf'],
            'SORT_AUDIO': ['wav', 'aac', 'm4a', 'mp3', 'flac', 'ape'],
            'SORT_VIDEO': ['mp4', 'mov', 'avi', 'rmvb', 'mpg', 'mkv', '3gp'],
            'SORT_COMMON': ['exe', 'rar', 'zip', 'cmd']
            //'SORT_EXE': ['exe', 'bat', 'com']
        })
}
