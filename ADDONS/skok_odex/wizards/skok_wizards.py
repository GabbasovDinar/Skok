# -*- coding: utf-8 -*-
from openerp import api, models, fields, _, exceptions

import logging


_logger = logging.getLogger(__name__)


PROCEDURES = [
    ('confirm', _('Confirm')),
]


WIZARDS = dict([
    ('confirm', 'skok.confirm.wizard'),
])


def _get_procedures(self):
    bid = self.skok_id.browse([self.env.context.get('default_skok_id', False)])
    p = []
    if bid.state != 'draft':
        for r in self.env['skok.procedure.type'].search([]):
            if r.model:
                p.append((r.code, r.name))

    if bid.state == 'draft':
        if self.env.user.has_group('base.group_user'):
            p += [
                    ('confirm', _('Confirm')),
            ]
    return p


class Wizard(models.TransientModel):
    _name = 'skok.wizards.wizard'

    procedure = fields.Selection(selection=_get_procedures, string='Select a procedure')

    skok_id = fields.Many2one('skok.skok', string='Skok Document')

    @api.multi
    def run(self):
        for r in self:
            if not len(r.skok_id):
                raise exceptions.Warning(_('Please select a document befor proceed!'))
            procedure = r.procedure
            name, model = None, None
            cxt = {
                'default_skok_id': r.skok_id.id,
            }
            if procedure in WIZARDS:
                title = dict(PROCEDURES)[procedure]
                model = WIZARDS[procedure]
            else:
                p = self.env['skok.procedure.type'].search([('code', '=', procedure)], limit=1)
                if not len(p):
                    raise exceptions.Warning(_('Please select a document befor proceed!'))
                title = p.name
                model = p.model
                cxt['default_procedure_id'] = p.id


            return {
                'name': u'{}'.format(name),
                'view_type': 'form',
                'view_mode': 'form',
                'res_model': model,
                'target': 'new',
                'type': 'ir.actions.act_window',
                'context': cxt,
            }
