# -*- coding: utf-8 -*-
from openerp import api, fields, models, _

import logging

from . import Hijri

_logger = logging.getLogger(__name__)


def calculate_hijri(date):
    h = Hijri(date)
    return h.format()


class SkokType(models.Model):
    _name = 'skok.skok.type'

    code = fields.Char(string='Code', size=3)
    name = fields.Char(string='Name')
    sequence_id = fields.Many2one('ir.sequence', string='Sequencing')
    procedure_type_ids = fields.Many2many('skok.procedure.type', 'sktype_prtype_rel', 'skok_type_id', 'procedure_type_id', string='Allowed Procedures')
    created = fields.Boolean(default=False)
    notes = fields.Text(string='Notes')


    @api.model
    def get_sequence(self):
        return self.env['ir.sequence'].get(self.sequence_id.code)


    @api.model
    @api.returns('self', lambda value: value.id)
    def create(self, vals):
        code = vals.get('code', False)
        name = vals.get('name', False)
        type = self.env['ir.sequence.type'].create({
            'name': u'{} Sequence Type'.format(name),
            'code': u'skok.{}'.format(code),
        })
        sequence = self.env['ir.sequence'].create({
            'name': u'{} Sequencing'.format(name),
            'code': u'skok.{}'.format(code),
            'prefix': u'%(year)s%(month)s%(day)s-',
            'padding': 3,
        })
        vals['created'] = True
        vals['sequence_id'] = sequence.id

        return super(SkokType, self).create(vals)



class SkokTag(models.Model):
    _name = 'skok.skok.tag'

    name = fields.Char(string='Name')


class Skok(models.Model):
    _name = 'skok.skok'
    _inherit = ['mail.thread', 'ir.needaction_mixin']


    @api.depends('code', 'name')
    def _compute_display_name(self):
        for r in self:
            r.display_name = u'[{}] {}'.format(r.code, r.name)

    @api.depends('creation_date', 'entry_date')
    def _compute_hijri(self):
        for r in self:
            r.creation_date_hijri = r.creation_date and calculate_hijri(r.creation_date) or ''
            r.entry_date_hijri = r.entry_date and calculate_hijri(r.entry_date) or ''


    @api.depends('procedure_ids')
    def _compute_counter(self):
        for r in self:
            r.counter = len(r.procedure_ids)


    code = fields.Char(string='Number')
    origin = fields.Char(string='Origin Number')
    name = fields.Char(string='Short Description')
    display_name = fields.Char(string='Name', compute='_compute_display_name')

    type_id = fields.Many2one('skok.skok.type', string='Type')
    state = fields.Selection(string='Status', selection=[
        ('draft', _('Draft')),
        ('confirmed', _('Confirmed')),
    ], default='draft')

    storage = fields.Char(string='Storage')
    row = fields.Char(string='Row Number')

    address = fields.Char(string='Address')
    country_id = fields.Many2one('res.country', string='Country', default=lambda self: self.env.ref('base.sa', False))
    state_id = fields.Many2one('res.country.state', string='Counttry State')
    city_id = fields.Many2one('res.country.city', string='City')
    value = fields.Float(string='Value', digits=(12,2))
    description = fields.Text(string='Full Description')
    tag_ids = fields.Many2many('skok.skok.tag', 'skok_tag_rel','skok_id', 'tag_id', string='Tags')

    organization_id = fields.Many2one('skok.organization', string='Organization')
    original = fields.Selection(string='Originality', selection=[
        ('original', _('Original')),
        ('copy', _('Photo Copy')),
    ])

    page_numbers = fields.Integer(string='Number of Pages')

    creation_date = fields.Date(string='Creation Date')
    creation_date_hijri = fields.Char(string='Creation Date (Hijri)', compute='_compute_hijri', store=True)

    entry_date = fields.Date(string='Entry Date')
    entry_date_hijri = fields.Char(string='Entry Date (Hijri)', compute='_compute_hijri', store=True)

    ravage_date = fields.Date(string='Ravage Date', help='''
        Proposed date to ravage the document.
        ''')

    counter = fields.Integer(string='Activity Counter', compute='_compute_counter')

    keep = fields.Selection(string='Keep Strategy', selection=[
        ('forever', _('Forever')),
        ('temporary', _('Temporary')),
    ], default='forever')

    publish_date = fields.Date(string='Publish Date')
    expiry_date = fields.Date(string='Expiry Date')

    level = fields.Selection(string='Security Level', selection=[
        ('high', _('High Secret')),
        ('fair', _('Fair Secret')),
        ('low', _('Low Secret')),
    ], default='low')

    attachment_ids = fields.Many2many('ir.attachment', string='Attachment')
    related_ids = fields.Many2many('skok.skok', 'skok_related_rel', 'skok_id', 'related_id', string='Related Documents')

    procedure_ids = fields.One2many('skok.procedure', 'skok_id', string='Procedures')


    # messaging
    @api.multi
    def message_auto_subscribe(self, updated_fields, values=None):
        users = []
        self.message_subscribe(users, [])
        return super(Skok, self).message_auto_subscribe(updated_fields, values=values)


    @api.model
    def _needaction_domain_get(self):
        return [('state', '=', 'draft')]

    # ende messaging and needaction_mixin

    @api.multi
    def launch_procedures(self):
        return {
            'name': _('Procedures'),
            'view_type': 'form',
            'view_mode': 'form',
            'res_id': False,
            'res_model': 'skok.wizards.wizard',
            'target': 'new',
            'type': 'ir.actions.act_window',
            'context': {
                'default_skok_id': self.id
            },
        }

    @api.multi
    def confirm(self):
        for r in self:
            seq = r.type_id.get_sequence()
            _logger.warn(seq)
            code = u'{}-{}-{}'.format(r.type_id.code, r.organization_id.code, seq)
            r.write({
                'code': code,
                'state': 'confirmed',
            })


    @api.multi
    def reset(self):
        for r in self:
            r.state = 'draft'

    @api.multi
    def add_procedure(self, procedure=None, member=None, partner=False):
        for r in self:
            if not procedure:
                break
            self.env['skok.procedure'].create({
                'name': procedure.name,
                'type_id': procedure.id,
                'member_id': member and member.id or False,
                'skok_id': r.id,
                'partner_id': partner and partner.id or False,
                'date': fields.Datetime.now(),
            })