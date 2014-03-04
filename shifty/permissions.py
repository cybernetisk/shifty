from rest_framework.permissions import BasePermission, SAFE_METHODS

class isAdminOrReadOnly(BasePermission):
	"""Checks if userlevel is Admin, if not, only allow SAFE_METHODS."""
	def has_object_permission(self, request, view, obj):
		print "lol"
		return False
		if request.method in SAFE_METHODS:
			return True

		return user.is_staff