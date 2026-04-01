from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

class EmailBackend(ModelBackend):
    """
    Backend d'authentification personnalise permettant de se connecter
    indifferemment avec l'email ou le nom d'utilisateur (username).
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        UserModel = get_user_model()
        if username is None:
            username = kwargs.get(UserModel.USERNAME_FIELD)
        
        try:
            # On cherche par email OU par username
            user = UserModel.objects.filter(
                Q(username__iexact=username) | Q(email__iexact=username)
            ).first()
        except UserModel.DoesNotExist:
            return None
        
        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
