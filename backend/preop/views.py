from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from audit.services import create_audit_log
from .models import QuestionTemplate, PreOpQuestionnaire, PreOpQuestionnaireResponse, ClinicalScore
from .serializers import (
    QuestionTemplateSerializer,
    PreOpQuestionnaireSerializer,
    PreOpQuestionnaireResponseSerializer,
    ClinicalScoreSerializer,
    PreOpQuestionnaireFormSerializer,
)
from rest_framework.views import APIView
from .scoring_engine import compute_all_scores, compute_all_scores_from_map

import os, base64
from io import BytesIO
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pydicom

class DicomView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Simulation: on pointe vers votre dossier d'images du projet dicom
        # Dans un cas reel, on lierait l'ID du dossier au chemin du fichier
        dicom_dir = r"C:\Users\YASMINE\dicom_project\s"
        try:
            fichiers = [f for f in os.listdir(dicom_dir) if f.endswith(".IMA") or f.endswith(".dcm")]
            if not fichiers:
                return Response({"error": "No DICOM files found"}, status=404)
            
            chemin = os.path.join(dicom_dir, fichiers[0])
            dicom = pydicom.dcmread(chemin, force=True)
            
            # Rendu image
            fig, ax = plt.subplots()
            ax.imshow(dicom.pixel_array, cmap="gray")
            ax.axis("off")
            buf = BytesIO()
            fig.savefig(buf, format="png", bbox_inches="tight", pad_inches=0)
            plt.close(fig)
            buf.seek(0)
            image_base64 = base64.b64encode(buf.read()).decode("utf-8")

            return Response({
                "image": image_base64,
                "info": {
                    "PatientName": str(getattr(dicom, "PatientName", "N/A")),
                    "PatientID": str(getattr(dicom, "PatientID", "N/A")),
                    "Modality": str(getattr(dicom, "Modality", "N/A")),
                }
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class ComputeScoresStandaloneView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        response_map = request.data.get("responses", {})
        scores, alerts = compute_all_scores_from_map(response_map)
        
        # We don't save these to the DB since it's a standalone calculator
        return Response({
            "scores": scores,
            "alerts": alerts
        }, status=status.HTTP_200_OK)

class QuestionTemplateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QuestionTemplate.objects.filter(is_active=True).all()
    serializer_class = QuestionTemplateSerializer
    permission_classes = [AllowAny]

class PreOpQuestionnaireViewSet(viewsets.ModelViewSet):
    queryset = PreOpQuestionnaire.objects.select_related("anesthesia_case").prefetch_related("responses")
    serializer_class = PreOpQuestionnaireSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        questionnaire = serializer.save()
        create_audit_log(
            action="CREATE",
            entity_type="PreOpQuestionnaire",
            entity_id=str(questionnaire.id),
            details={
                "anesthesia_case_id": str(questionnaire.anesthesia_case.id),
                "language": questionnaire.language,
            },
        )

    @action(detail=True, methods=["post"], url_path="compute-scores")
    def compute_scores(self, request, pk=None):
        questionnaire = self.get_object()
        scores, alerts = compute_all_scores(questionnaire)

        created_scores = []
        for score_data in scores:
            score, _ = ClinicalScore.objects.update_or_create(
                anesthesia_case=questionnaire.anesthesia_case,
                score_type=score_data["score_type"],
                defaults={
                    "score_value": score_data["score_value"],
                    "score_details": score_data["score_details"],
                },
            )
            created_scores.append(score)

        create_audit_log(
            action="COMPUTE_SCORES",
            entity_type="PreOpQuestionnaire",
            entity_id=str(questionnaire.id),
            details={
                "anesthesia_case_id": str(questionnaire.anesthesia_case.id),
                "score_count": len(created_scores),
                "alerts": alerts,
            },
        )

        serializer = ClinicalScoreSerializer(created_scores, many=True)
        return Response({
            "scores": serializer.data,
            "alerts": alerts
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="form")
    def form(self, request, pk=None):
        questionnaire = self.get_object()

        questions = QuestionTemplate.objects.filter(is_active=True).order_by("section", "question_code")
        responses = questionnaire.responses.all()

        serializer = PreOpQuestionnaireFormSerializer({
            "questionnaire": questionnaire,
            "questions": questions,
            "responses": responses,
        })
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class PreOpQuestionnaireResponseViewSet(viewsets.ModelViewSet):
    queryset = PreOpQuestionnaireResponse.objects.select_related("questionnaire").all()
    serializer_class = PreOpQuestionnaireResponseSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        response = serializer.save()
        create_audit_log(
            action="CREATE",
            entity_type="PreOpQuestionnaireResponse",
            entity_id=str(response.id),
            details={
                "questionnaire_id": str(response.questionnaire.id),
                "question_code": response.question_code,
            },
        )


class ClinicalScoreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClinicalScore.objects.select_related("anesthesia_case").all()
    serializer_class = ClinicalScoreSerializer
    permission_classes = [AllowAny]