# -*- coding: utf-8 -*-
from openerp import api, models, fields, _


class SpecialCase(models.Model):
    _name = 'skok.special.case'
    _order = 'name'
    _description = 'Special case'
    
    name  = fields.Char(string='Case name')
    notes = fields.Text(string='note')

class SkokPurpose(models.Model):
    _name = 'skok.purpose'
    _order = 'name'
    _description = 'Skok purpose'
    
    name  = fields.Char(string='Purpose')
    notes = fields.Text(string='note')
    
class TenureType(models.Model):
    _name = 'tenure.type'
    _order = 'name'
    _description = 'Tenure type'
    
    name  = fields.Char(string='Tenure type')
    notes = fields.Text(string='note')
    