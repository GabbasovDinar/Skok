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

class res_company(osv.osv):
    _inherit = "res.company"

    def _get_default_logo_web(self, cr, uid, ids, _field_name, _args, context=None):
        result = dict.fromkeys(ids, False)
        for record in self.browse(cr, uid, ids, context=context):
            result[record.id] = record.partner_id.image
        return result
        
    def _get_companies_from_partner(self, cr, uid, ids, context=None):
        return self.pool['res.company'].search(cr, uid, [('partner_id', 'in', ids)], context=context)

    _columns = {
        'web_company_logo': fields.function(_get_default_logo_web, string="Logo Web", type="binary", store={
            'res.company': (lambda s, c, u, i, x: i, ['partner_id'], 10),
            'res.partner': (_get_companies_from_partner, ['image'], 10),
        }),
    }
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4:
