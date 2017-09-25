# -*- coding: utf-8 -*-

import openerp
from openerp.tools.translate import _
from openerp import http
from openerp.http import request

#----------------------------------------------------------
# OpenERP Web web Controllers
#----------------------------------------------------------
class Home(openerp.addons.web.controllers.main.Home):

    @http.route('/web/login', type='http', auth="none")
    def web_login(self, redirect=None, **kw):
        user_obj = request.registry.get('res.users')
        lang_obj = request.env()['res.lang'].sudo()
        if request.httprequest.method == 'POST':
            old_uid = request.uid
            uid = request.session.authenticate(request.session.db, request.params['login'], request.params['password'])
            if uid is not False:
                # If login success change language
                lg = request.params.get('lang')
                if lg:
                    user_obj.write(request.cr,uid, uid,{'lang':lg})
                return super(Home, self).web_login(redirect=redirect,**kw)
        if request.env.ref('web.login', False):
            languages = lang_obj.sudo().search([])
            return request.render('web.login', {'languages':languages})
        return super(Home, self).web_login(*args, **kw)
        
    

# vim:expandtab:tabstop=4:softtabstop=4:shiftwidth=4:
