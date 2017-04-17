# -*- coding: utf-8 -*-
from openerp import api, models, fields, _, exceptions

import logging


class Confirm(models.TransientModel):
    _name = 'skok.confirm.wizard'

    skok_id = fields.Many2one('skok.skok', string='Skok Document')
    entry_date = fields.Date(string='Entry Date')

    @api.multi
    def run(self):
        for r in self:
            if not len(r.skok_id):
                raise exceptions.Warning(_('Please select a document befor proceed!'))
            r.skok_id.confirm()


class AddSkok(models.TransientModel):
    _name = 'skok.add_skok.wizard'

    skok_id = fields.Many2one('skok.skok', string='Skok Document')
    entry_date = fields.Date(string='Entry Date')

    procedure_id = fields.Many2one('skok.procedure.type', string='Procedure')
    member_id = fields.Many2one('skok.committee.member', string='Member')

    @api.multi
    def run(self):
        for r in self:
            if not len(r.skok_id):
                raise exceptions.Warning(_('Please select a document befor proceed!'))
            p = r.procedure_id
            if not len(p):
                continue
            r.skok_id.add_procedure(procedure=p, member=r.member_id)


class ViewSkok(models.TransientModel):
    _name = 'skok.view_skok.wizard'

    skok_id = fields.Many2one('skok.skok', string='Skok Document')
    date = fields.Date(string='Date')

    procedure_id = fields.Many2one('skok.procedure.type', string='Procedure')
    beneficier = fields.Char(string='Beneficier')

    @api.multi
    def run(self):
        for r in self:
            if not len(r.skok_id):
                raise exceptions.Warning(_('Please select a document befor proceed!'))
            p = r.procedure_id
            if not len(p):
                continue
            partner = self.env['res.partner'].create({
                'name': r.beneficier,
                'customer': False,
            })
            r.skok_id.add_procedure(procedure=p, partner=partner)

