# -*- coding: utf-8 -*-
from openerp import api, models, fields, _


class SkokOwner(models.Model):
    _name = 'skok.owner'
    _order = 'name'
    _description = 'Skok Owner'
    _inherits = {
        'res.partner': 'partner_id',
    }

    notes = fields.Text(string='note')
    