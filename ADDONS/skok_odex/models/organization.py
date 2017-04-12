# -*- coding: utf-8 -*-
from openerp import api, models, fields, _


class Organization(models.Model):
    _name = 'skok.organization'
    _order = 'code, name'
    _description = 'Organizations'

    code = fields.Char(string='Code')
    name = fields.Char(string='Name', related='partner_id.name', store=True)
    partner_id = fields.Many2one('res.partner', string='Address Ref')
    street = fields.Char(string='Street', related='partner_id.street')
    street2 = fields.Char(string='Street 2', related='partner_id.street2')
    zip = fields.Char(string='Zip', related='partner_id.zip')
    mobile = fields.Char(string='mobile', related='partner_id.mobile')
    phone = fields.Char(string='phone', related='partner_id.phone')
    fax = fields.Char(string='fax', related='partner_id.fax')
    email = fields.Char(string='email', related='partner_id.email')

    country_id = fields.Many2one('res.country', string='Country', default=lambda self: self.env.ref('base.sa', False))
    state_id = fields.Many2one('res.country.state', string='State')
    city_id = fields.Many2one('res.country.city', string='City')

    # organization committee
    committee_ids = fields.One2many('skok.committee.member', 'organization_id', string='Commitees')


    @api.model
    @api.returns('self', lambda value: value.id)
    def create(self, vals):
        Partner = self.env['res.partner']

        data = {
            'name': vals.pop('name', ''),
            'street': vals.pop('street', ''),
            'street': vals.pop('street', ''),
            'street2': vals.pop('street2', ''),
            'zip': vals.pop('zip', ''),
            'mobile': vals.pop('mobile', ''),
            'phone': vals.pop('phone', ''),
            'fax': vals.pop('fax', ''),
            'email': vals.pop('email', ''),
            'country_id': vals.get('country_id', False),
            'state_id': vals.get('state_id', False),
            'is_company': True,
        }

        partner = Partner.create(data)
        vals['partner_id'] = partner.id

        return super(Organization, self).create(vals)

