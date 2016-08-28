'use strict';

export default function (app) {
    app
        .filter('getFileIconSuffix', ['FILE_SORTS', function (FILE_SORTS) {
            return function (filename) {
                var suffix = '';
                var sorts = FILE_SORTS;
                var ext = Util.String.getExt(filename);
                if (jQuery.inArray(ext, sorts['SORT_PDF']) > -1) {
                    suffix = 'sort_pdf';
                } else if (jQuery.inArray(ext, sorts['SORT_PPT']) > -1) {
                    suffix = 'sort_ppt';
                } else if (jQuery.inArray(ext, sorts['SORT_IMG']) > -1) {
                    suffix = 'sort_img';
                } else if (jQuery.inArray(ext, sorts['SORT_PHOTO']) > -1) {
                    suffix = 'sort_photo';
                } else if (jQuery.inArray(ext, sorts['SORT_DOCUMENT']) > -1) {
                    suffix = 'sort_document';
                } else if (jQuery.inArray(ext, sorts['SORT_OTHERDOC']) > -1) {
                    suffix = 'sort_otherdoc';
                } else if (jQuery.inArray(ext, sorts['SORT_TABLE']) > -1) {
                    suffix = 'sort_table';
                } else if (jQuery.inArray(ext, sorts['SORT_DRAW']) > -1) {
                    suffix = 'sort_draw';
                } else if (jQuery.inArray(ext, sorts['SORT_AUDIO']) > -1) {
                    suffix = 'sort_audio';
                } else if (jQuery.inArray(ext, sorts['SORT_VIDEO']) > -1) {
                    suffix = 'sort_video';
                } else {
                    suffix = 'sort_comment';
                }
                return suffix;


            }
        }])


        .filter("bitSize", function () {
            return function (num) {
                return Util.Number.bitSize(num);
            }
        })


}


