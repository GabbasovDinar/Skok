(function () {
    'use strict';

    var website = openerp.website;
    var _t = openerp._t;

    CKEDITOR.plugins.addExternal('font','/geminate_website_font_manager/static/lib/ckeditor/plugins/font/plugin.js'); 
    website.RTE.include({
    	_config: function () {
            self.myFonts = ['ABeeZee', 'Abel', 'Abril Fatface', 'Aclonica', 'Acme', 'Actor', 'Adamina', 'Advent Pro', 'Aguafina Script', 'Akronim', 'Aladin', 'Aldrich', 'Alef', 'Alegreya', 'Alegreya SC', 'Alegreya Sans', 'Alegreya Sans SC', 'Alex Brush', 'Alfa Slab One', 'Alice', 'Alike', 'Alike Angular', 'Allan', 'Allerta', 'Allerta Stencil', 'Droid Sans', 'Lato', 'Lora', 'Open Sans', 'Open Sans Condensed', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'Source Sans Pro', 'Vollkorn', 'Work-Sans', 'Yellowtail', 'Yesteryear', 'Zeyada'];
            var plugins = [
                'a11yhelp', 'basicstyles', 'blockquote',
                'clipboard', 'colorbutton', 'colordialog', 'dialogadvtab',
                'elementspath', /*'enterkey',*/ 'entities', 'filebrowser',
                'find', 'floatingspace','format', 'htmlwriter', 'iframe',
                'indentblock', 'indentlist', 'justify',
                'list', 'pastefromword', 'pastetext', 'preview',
                'removeformat', 'resize', 'save', 'selectall', 'stylescombo',
                'table', 'templates', 'toolbar', 'undo', 'wysiwygarea',
            ];
            /* Add local fonts seperated by semicolon (;) */
            var font_names = 'serif;sans serif;monospace;cursive;fantasy;Calibri;GE Dinar One Medium;GillSans;Shorooq Yara Medium;NeoSansW23 Black;NeoSansW23 Bold;NeoSansW23 Light;NeoSansW23 Med;NeoSansW23 Regular;NeoSansW23 Ultra';
            /* End of local fonts seperated by semicolon (;) */
            
            for(var i = 0; i<self.myFonts.length; i++){
                font_names = font_names +';'+self.myFonts[i];
                self.myFonts[i] = 'http://fonts.googleapis.com/css?family='+self.myFonts[i].replace(' ','+');
            }
            return {
                language: 'en',
                title: false,
                plugins: plugins.join(','),
                uiColor: '',
                customConfig: '',
                allowedContent: true,
                autoParagraph: false,
                fillEmptyBlocks: false,
                filebrowserImageUploadUrl: "/website/attach",
                extraPlugins: 'sharedspace,customdialogs,tablebutton,oeref,font',
                font_names: font_names,
                contentsCss: ['/web/static/lib/ckeditor/contents.css'].concat(self.myFonts),
                sharedSpaces: { top: 'oe_rte_toolbar' },
                toolbar: [{
                        name: 'basicstyles', items: [
                        "Bold", "Italic", "Underline", "Strike", "Subscript",
                        "Superscript", "TextColor", "BGColor", "RemoveFormat"
                    ]},{
                    name: 'span', items: [
                        "Link", "Blockquote", "BulletedList",
                        "NumberedList", "Indent", "Outdent"
                    ]},{
                    name: 'justify', items: [
                        "JustifyLeft", "JustifyCenter", "JustifyRight", "JustifyBlock"
                    ]},{
                    name: 'special', items: [
                        "Image", "TableButton"
                    ]},{
                    name: 'styles', items: [
                        "Styles", "Font", "FontSize"
                    ]}
                ],
                stylesSet: [
                    {name: "Normal", element: 'p'},
                    {name: "Heading 1", element: 'h1'},
                    {name: "Heading 2", element: 'h2'},
                    {name: "Heading 3", element: 'h3'},
                    {name: "Heading 4", element: 'h4'},
                    {name: "Heading 5", element: 'h5'},
                    {name: "Heading 6", element: 'h6'},
                    {name: "Formatted", element: 'pre'},
                    {name: "Address", element: 'address'}
                ],
            };
        }
    });
})();   