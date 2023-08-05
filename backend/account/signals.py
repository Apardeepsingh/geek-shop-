from django.db.models.signals import post_save
from django.dispatch import receiver
from account.models import OrderItem
from .tasks import send_order_deliverd_mail 
import threading

@receiver(post_save, sender=OrderItem)
def order_delivered(sender, instance, **kwargs):
    if instance.isDeliver and not instance.isReturn:
        # send_order_deliverd_mail(instance)
        email_thread = threading.Thread(target=send_order_deliverd_mail, args=(instance,))
        email_thread.start()
        
