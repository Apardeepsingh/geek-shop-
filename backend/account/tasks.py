from account.utils import Util
from django.template.loader import render_to_string


def send_order_confirmation_email(order, order_items, user):
    
    # Prepare the context for the template
    context = {
        'user': user,
        'order': order,
        'order_items': order_items,
    }

    # Render the email body using the template
    email_body = render_to_string('order_confirmation_email.html', context)


    data = {
        'subject': f'Your Geek Shop order is confirmed!',
        'body': email_body,
        'to': user.email
    }
    Util.send_email(data)


def send_order_cancel_email(orderItem, user, emailType):
    emailPage = [*emailType.keys()] 

    context = {
        'orderItem' : orderItem,
        'user' : user,
        'emailPage': emailPage[0]
    }

    subject = ""
    if emailPage[0] == "isCancel":
        subject = f'Your cancellation request for Order ID #{orderItem.order.uid} has been processed'
    else:
        subject = f'Your Return Request for Order ID #{orderItem.order.uid} has been received'


    email_body = render_to_string('order_cancel_email.html', context)


    data = {
        'subject': subject,
        'body': email_body,
        'to': user.email
    }
    Util.send_email(data)


def send_order_deliverd_mail(orderItem):
    context = {
        'orderItem': orderItem
    }

    # Render the email body using the template
    email_body = render_to_string('order_delivered_email.html', context)


    data = {
        'subject': f'Order Delivered (ID: {orderItem.order.uid})',
        'body': email_body,
        'to': orderItem.order.user.email
    }
    Util.send_email(data)