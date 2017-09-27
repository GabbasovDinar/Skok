# -*- coding: utf-8 -*-
##############################################################################
#
#    (Odex - Skok Management Module).
#    Copyright (C) 2017 Expert Co. Ltd. (<http://exp-sa.com>).
#
##############################################################################
{
    'name' : 'Odex - Skok Management',
    'version' : '0.1',
    'sequence' : 4,
    'author' : 'Expert Co. Ltd.',
    'category' : 'Skok Management',
    'summary': 'Advanced Document Management',
    'description' : """
Odex - Skok management module
=================================
    """,
    'website': 'http://www.exp-sa.com',
    'depends' : ['base', 'base_odex', 'document'],
    'data': [
        # security
        'security/skok_security.xml',
        'security/ir.model.access.csv',
        # views
        'data/skok_data.xml',
        # views
        'views/organization_view.xml',
        'views/committee_view.xml',
        'views/skok_config_view.xml',
        'views/skok_view.xml',
        'views/procedure_view.xml',
        'views/skok_owner_view.xml',
        'views/actions_and_menus.xml',
        # wizards
        'wizards/skok_wizards_wizard.xml',
        'wizards/confirm_wizard.xml',
    ],
    'qweb' : [
    ],
    'installable': True,
    'application': True,
}
