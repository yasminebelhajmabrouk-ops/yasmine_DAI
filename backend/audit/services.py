from .models import AuditLog


def create_audit_log(action: str, entity_type: str, entity_id: str, actor: str = "", details: dict | None = None):
    return AuditLog.objects.create(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        actor=actor,
        details=details or {},
    )