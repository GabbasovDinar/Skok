# -*- coding: utf-8 -*-

import datetime
import werkzeug
import functools
from openerp import tools
from openerp.addons.web import http
from openerp.addons.web.http import request
from openerp.addons.website.models.website import slug
from openerp.osv.orm import browse_record
from openerp.tools.translate import _
from openerp import SUPERUSER_ID
from openerp.tools import html2plaintext
from openerp.modules import get_module_resource
import openerp.modules.registry
from cStringIO import StringIO

class Website(http.Controller):
    @http.route('/website/theme_customize', type='http', auth="user", website=True)
    def theme_customize(self, theme_id=False, **kwargs):
        imd = request.registry['ir.model.data']
        Views = request.registry['ir.ui.view']

        _, theme_template_id = imd.get_object_reference(
            request.cr, request.uid, 'website', 'theme')
        views = Views.search(request.cr, request.uid, [
            ('inherit_id', '=', theme_template_id),
        ], context=request.context)
        Views.write(request.cr, request.uid, views, {
            'active': False,
        }, context=dict(request.context or {}, active_test=True))

        if theme_id:
            module, xml_id = theme_id.split('.')
            _, view_id = imd.get_object_reference(
                request.cr, request.uid, module, xml_id)
            Views.write(request.cr, request.uid, [view_id], {
                'active': True
            }, context=dict(request.context or {}, active_test=True))

        return request.render('website.colors', {'theme_customized': True})

class Binary(http.Controller):
    @http.route([
        '/default_logo.png'
    ], type='http', auth="none", cors="*")
    def company_logo(self, dbname=None, **kw):
        imgname = 'default_logo.png'
        placeholder = functools.partial(get_module_resource, 'web', 'static', 'src', 'img')
        uid = None
        if request.session.db:
            dbname = request.session.db
            uid = request.session.uid
        elif dbname is None:
            dbname = db_monodb()

        if not uid:
            uid = openerp.SUPERUSER_ID

        if not dbname:
            response = http.send_file(placeholder(imgname))
        else:
            try:
                registry = openerp.modules.registry.Registry(dbname)
                with registry.cursor() as cr:
                    cr.execute("""SELECT c.web_company_logo, c.write_date
                                    FROM res_users u
                               LEFT JOIN res_company c
                                      ON c.id = u.company_id
                                   WHERE u.id = %s
                               """, (uid,))
                    row = cr.fetchone()
                    if row and row[0]:
                        image_data = StringIO(str(row[0]).decode('base64'))
                        response = http.send_file(image_data, filename=imgname, mtime=row[1])
                    else:
                        response = http.send_file(placeholder('nologo.png'))
            except Exception:
                response = http.send_file(placeholder(imgname))
        return response


    @http.route(['/page/about_us'], 
        type='http', auth="public", website=True)
    def about_us(self, **kwargs):
        values = {}        
        values.update(kwargs=kwargs.items())
        return request.website.render("sync_uppercrust_theme.about_us", values)