from allauth.socialaccount.signals import social_account_added
from django.dispatch import receiver

@receiver(social_account_added)
def social_account_added_request(request, sociallogin, **kwargs):
    pass
    # print("here-----------")
    # user = sociallogin.user
    # extra_data = sociallogin.account.extra_data

    # discord_id = extra_data.get('id')
    # username = extra_data.get('username')
    # discriminator = extra_data.get('discriminator')
    # avatar = extra_data.get('avatar')
    # email = extra_data.get('email')

    # You can now use this data as needed
    # For example, you might store the Discord ID in the user's profile
