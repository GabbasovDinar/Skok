# -*- coding: utf-8 -*-
from openerp import api, models, fields, _


class CommitteeTitle(models.Model):
    _name = 'skok.committee.title'
    _description = 'Organization Committee Title'

    name = fields.Char(string='Title')
    notes = fields.Text(string='Notes')


class CommitteeMember(models.Model):
    _name = 'skok.committee.member'
    _description = 'Organization Committee Member'

    name = fields.Char(string='Member Name')
    title_id = fields.Many2one('skok.committee.title', string='Title')
    organization_id = fields.Many2one('skok.organization', string='Organization')
    notes = fields.Text(string='Notes')


class Committee(models.Model):
    _name = 'skok.committee'
    _description = 'Organization Committee'

    name = fields.Char(string='Committee Name')
    organization_id = fields.Many2one('skok.organization', string='Organization')
    member_ids = fields.Many2many('skok.committee.member', string='Committee Members')
    notes = fields.Text(string='Notes')

