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

import openerp
from openerp.osv import orm, osv, fields

class res_partner(osv.osv):
    _inherit = "res.partner"

    def google_map_address(self, cr, uid, ids, zoom=8, context=None):
        partner = self.browse(cr, uid, ids[0], context=context)
        params = {
            'q': '%s, %s %s, %s' % (partner.street or '', partner.city  or '', partner.zip or '', partner.country_id and partner.country_id.name_get()[0][1] or ''),
        }
        # print"/n/n===Ret==>",params['q'].replace(',', ' ')
        return params['q'].replace(',', ' ')

class res_company(osv.osv):
    _inherit = "res.company"

    def google_map_address(self, cr, uid, ids, zoom=8, context=None):
        partner = self.browse(cr, openerp.SUPERUSER_ID, ids[0], context=context).partner_id
        return partner and partner.google_map_address(zoom, context=context) or None

# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
