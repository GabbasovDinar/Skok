# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2004-today OpenERP SA (<http://www.openerp.com>)
#    Copyright (C) 2011-today Synconics Technologies Pvt. Ltd. (<http://www.synconics.com>)
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################
{
    'name': "Uppercrust Theme",
    'description': """
                     Customized Uppercrust Theme.
                   """,
    'version': "1.0",
    'author': "Expert",
    'website': "http://www.exp-sa.com",
    'category': 'Theme/Corporate',
    'depends': ['website'],
	'data': ['static/src/views/snippet.xml', 'static/src/views/theme.xml', 'sync_uppercrust_theme.xml',
    'static/src/views/about_us.xml'],
    'images': [
            'static/description/main_screen.jpg',
    ],
	'qweb': [],
    'price': 9150,
    'currency': 'EUR',
    'live_test_url': 'http://uppercrust-default-theme-v8.synconics.com',
    'active': True,
    'installable': True,
	
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
