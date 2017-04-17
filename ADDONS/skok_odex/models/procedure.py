# -*- coding: utf-8 -*-
from openerp import models, fields, api, _


class ProcedureLog(models.Model):
    _name = 'skok.procedure.type'

    code = fields.Char(string='Procedure Code')
    name = fields.Char(string='Procedure Name')
    model = fields.Char(string='Procedure Model')
    notes = fields.Text(string='Notes')


class Procedure(models.Model):
    _name = 'skok.procedure'

    name = fields.Char(string='Name')
    date = fields.Datetime(string='Date', default=lambda self: fields.Datetime.now())
    member_id = fields.Many2one('skok.committee.member', string='Member')
    partner_id = fields.Many2one('res.partner', string='Member')
    skok_id = fields.Many2one('skok.skok', string='Skok Document')
    type_id = fields.Many2one('skok.procedure.type', string='Procedure Type')
    code = fields.Char(string='Procedure Code', related='type_id.code', store=True)
    notes = fields.Text(string='Notes')


