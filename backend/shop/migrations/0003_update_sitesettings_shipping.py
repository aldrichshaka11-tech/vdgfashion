from django.db import migrations


def update_sitesettings_shipping(apps, schema_editor):
    SiteSettings = apps.get_model('shop', 'SiteSettings')
    SiteSettings.objects.all().update(
        free_shipping_threshold=999.00,
        shipping_fee=50.00
    )


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_coupon_alter_sitesettings_free_shipping_threshold_and_more'),
    ]

    operations = [
        migrations.RunPython(update_sitesettings_shipping, migrations.RunPython.noop),
    ]
