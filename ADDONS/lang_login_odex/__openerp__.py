# -*- coding: utf-8 -*-
##############################################################################
#
#    (Odex - Add language to login page).
#    Copyright (C) 2017 Expert Co. Ltd. (<http://exp-sa.com>).
#
##############################################################################
{
    'name' : 'Odex - Add language to login page',
    'version' : '0.1',
    'sequence' : 5,
    'author' : 'Expert Co. Ltd.',
    'category' : 'Skok Management',
    'summary': 'Advanced Document Management',
    'description' : """
Odex - Skok management module
=================================
    """,
    'website': 'http://www.exp-sa.com',
    'depends' : ['base', 'web'],
    'data': [
        # views
        'views/webclient_templates.xml',
    ],
    'qweb' : [
    ],
    'installable': True,
    'application': False,
}
